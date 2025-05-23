package bridge

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	r "runtime"
	"strings"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var downloadUrl string

func (a *App) CheckForUpgrade() *CheckUpgradeInfo {
	latest, err := GetGithubReleaseInfo(a)
	if err != nil {
		return &CheckUpgradeInfo{Err: err.Error(), IsLatest: false, Latest: nil}
	}

	remoteVersion := strings.TrimPrefix(latest.TagName, "v")
	if remoteVersion != APP_VERSION {
		return &CheckUpgradeInfo{Err: "", IsLatest: false, Latest: latest}
	} else {
		return &CheckUpgradeInfo{Err: "", IsLatest: true, Latest: nil}
	}
}

func GetGithubReleaseInfo(a *App) (*Latest, error) {
	proxyUrl := GetProxyInfo(a)

	client, err := HTTPClientWithProxy(proxyUrl)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest(http.MethodGet, GITHUB_REPO_RELEASE_URL, nil)
	if err != nil {
		log.Println(err.Error())

		return nil, err
	}

	res, err := client.Do(req)
	if err != nil {
		log.Println(err.Error())

		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		log.Println(res.StatusCode)

		return nil, err
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		log.Println(err.Error())

		return nil, err
	}

	var githubReleaseInfo *GithubReleaseInfo
	if err := json.Unmarshal(body, &githubReleaseInfo); err != nil {
		log.Println(err.Error())

		return nil, err
	}

	for _, assets := range githubReleaseInfo.Assets {
		if strings.Contains(strings.ToLower(assets.Name), r.GOOS) && strings.Contains(strings.ToLower(assets.Name), r.GOARCH) {
			downloadUrl = assets.BrowserDownloadURL
		}
	}

	return &Latest{
		TagName:   githubReleaseInfo.TagName,
		CreatedAt: githubReleaseInfo.CreatedAt,
		Body:      githubReleaseInfo.Body,
	}, nil
}

func DownloadLatestRelease(ctx context.Context, a *App, url string, path string, fc func(progress float64, total, downloaded int64)) error {
	proxyUrl := GetProxyInfo(a)
	client, err := HTTPClientWithProxy(proxyUrl)
	if err != nil {
		return err
	}

	resp, err := client.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	create, err := os.Create(path)
	if err != nil {
		return err
	}
	defer create.Close()

	fileSize := resp.ContentLength
	downloadedSize := int64(0)
	buffer := make([]byte, 1024)
	progressTicker := time.Tick(time.Millisecond * 50)

	for {
		select {
		case <-ctx.Done():
			create.Close()
			RemoveFile(path)
			runtime.EventsEmit(a.ctx, "download-cancelled")

			return fmt.Errorf("下载已取消")
		default:
			n, err := resp.Body.Read(buffer)
			if n > 0 {
				_, writeErr := create.Write(buffer[:n])
				if writeErr != nil {
					return writeErr
				}

				downloadedSize += int64(n)
				progress := float64(downloadedSize) / float64(fileSize) * 100

				select {
				case <-progressTicker:
					if fc != nil {
						fc(progress, fileSize, downloadedSize)
					}
				default:
				}
			}

			if err != nil {
				if err != io.EOF {
					return err
				}

				fc(100, fileSize, downloadedSize)

				return nil
			}
		}
	}
}

func (a *App) Download() error {
	DOWNLOAD_ZIPFILE_NAME := DOWNLOAD_ZIPFILE_NAME_WINDOWS
	if IsMacOS() {
		DOWNLOAD_ZIPFILE_NAME = DOWNLOAD_ZIPFILE_NAME_MACOS
	}

	userDownloadPath := GetUserDownloadPath()
	savePath := filepath.Join(userDownloadPath, DOWNLOAD_ZIPFILE_NAME)

	if downloadUrl == "" {
		err := fmt.Errorf("找不到更新包下载地址")
		runtime.EventsEmit(a.ctx, "download-error", err)

		return err
	}

	ctx, cancel := context.WithCancel(context.Background())
	a.cancel = cancel

	err := DownloadLatestRelease(ctx, a, downloadUrl, savePath, func(progress float64, total, downloaded int64) {
		runtime.EventsEmit(a.ctx, "download-progress", progress, total, downloaded)
	})
	if err != nil {
		runtime.EventsEmit(a.ctx, "download-error", err.Error())

		return err
	}

	runtime.EventsEmit(a.ctx, "download-complete")

	return nil
}

func (a *App) CancelUpgrade() {
	if a.cancel != nil {
		a.cancel()
	}
}

func (a *App) Upgrade() error {
	if IsWindows() {
		err := upgradeForWindows()
		if err != nil {
			log.Println("upgradeForWindows", err.Error())

			return err
		}
	}

	if IsMacOS() {
		err := upgradeForMac()
		if err != nil {
			log.Println("upgradeForMac", err.Error())

			return err
		}
	}

	return nil
}

func upgradeForWindows() error {
	userDownloadPath := GetUserDownloadPath()
	zipFilePath := filepath.Join(userDownloadPath, DOWNLOAD_ZIPFILE_NAME_WINDOWS)
	unzipExecFilePath := filepath.Join(userDownloadPath, APP_NAME+".exe")

	err := UnzipZIPFile(zipFilePath)
	if err != nil {
		log.Println("UnzipZIPFile", err.Error())
		return err
	}

	RemoveFile(zipFilePath)

	oldExePath, err := os.Executable()
	if err != nil {
		return err
	}

	batchScript := fmt.Sprintf(`@echo off
timeout /t 1 /nobreak >nul
move /y "%s" "%s"
start "" "%s"
del "%%~f0"
`, unzipExecFilePath, oldExePath, oldExePath)

	batchFilePath := filepath.Join(os.TempDir(), "horizon_update.bat")
	err = os.WriteFile(batchFilePath, []byte(batchScript), 0644)
	if err != nil {
		return err
	}

	cmd := exec.Command("cmd", "/c", batchFilePath)
	cmd.SysProcAttr = sysProcAttr
	err = cmd.Start()
	if err != nil {
		return err
	}

	os.Exit(0)

	return nil
}

func upgradeForMac() error {
	userDownloadPath := GetUserDownloadPath()
	zipFilePath := filepath.Join(userDownloadPath, DOWNLOAD_ZIPFILE_NAME_MACOS)
	unzipExecFilePath := filepath.Join(userDownloadPath, APP_NAME+".app")

	err := UnzipZIPFile(zipFilePath)
	if err != nil {
		return err
	}

	RemoveFile(zipFilePath)

	oldAppExe, err := os.Executable()
	if err != nil {
		return err
	}

	oldAppPath := filepath.Join(oldAppExe, "../../..")

	script := fmt.Sprintf(`#!/bin/bash
sleep 1
rm -rf "%s"
mv "%s" "%s"
open "%s"
rm -- "$0"
`, oldAppPath, unzipExecFilePath, oldAppPath, oldAppPath)

	scriptPath := filepath.Join(os.TempDir(), "horizon_update.sh")
	err = os.WriteFile(scriptPath, []byte(script), 0755)
	if err != nil {
		return err
	}

	cmd := exec.Command("bash", scriptPath)
	err = cmd.Start()
	if err != nil {
		return err
	}

	os.Exit(0)

	return nil
}
