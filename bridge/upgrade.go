package bridge

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
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

var (
	downloadUrl    string
	downloadSize   int64
	downloadDigest string
)

func (a *App) CheckForUpgrade() *CheckUpgradeInfo {
	latest, err := GetGithubReleaseInfo(a)
	if err != nil {
		log.Printf("获取远程版本失败: %v", err)

		return &CheckUpgradeInfo{Err: err.Error(), IsLatest: false, Latest: nil}
	}

	log.Printf("远程仓库 tag name: %s", latest.TagName)

	remoteVersion := strings.TrimPrefix(latest.TagName, "v")
	if remoteVersion != APP_VERSION {
		return &CheckUpgradeInfo{Err: "", IsLatest: false, Latest: latest}
	} else {
		return &CheckUpgradeInfo{Err: "", IsLatest: true, Latest: nil}
	}
}

func GetChangelogInfo(a *App) (string, error) {
	proxyUrl := GetProxyInfo(a)
	client, err := HTTPClientWithProxy(proxyUrl)
	if err != nil {
		log.Printf("创建 HTTP 客户端失败: %v", err)
		return "", err
	}

	req, err := http.NewRequest(http.MethodGet, CHANGELOG_URL, nil)
	if err != nil {
		log.Printf("创建 HTTP 请求失败: %v", err)
		return "", err
	}

	req.Header.Set("User-Agent", fmt.Sprintf("%s/%s", APP_NAME, APP_VERSION))

	res, err := client.Do(req)
	if err != nil {
		log.Printf("发送 HTTP 请求失败: %v", err)
		return "", err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		log.Printf("HTTP 请求返回状态码: %d", res.StatusCode)
		return "", err
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		log.Printf("读取响应体失败: %v", err)
		return "", err
	}

	return string(body), nil
}

func GetGithubReleaseInfo(a *App) (*Latest, error) {
	proxyUrl := GetProxyInfo(a)

	client, err := HTTPClientWithProxy(proxyUrl)
	if err != nil {
		log.Printf("创建 HTTP 客户端失败: %v", err)

		return nil, err
	}

	req, err := http.NewRequest(http.MethodGet, GITHUB_REPO_RELEASE_URL, nil)
	if err != nil {
		log.Printf("创建 HTTP 请求失败: %v", err)

		return nil, err
	}

	res, err := client.Do(req)
	if err != nil {
		log.Printf("发送 HTTP 请求失败: %v", err)

		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		log.Printf("HTTP 请求返回状态码: %d", res.StatusCode)

		return nil, err
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		log.Printf("读取响应体失败: %v", err)

		return nil, err
	}

	var githubReleaseInfo *GithubReleaseInfo
	if err := json.Unmarshal(body, &githubReleaseInfo); err != nil {
		log.Printf("解析 JSON 失败: %v", err)

		return nil, err
	}

	for _, assets := range githubReleaseInfo.Assets {
		if strings.Contains(strings.ToLower(assets.Name), r.GOOS) && strings.Contains(strings.ToLower(assets.Name), r.GOARCH) {
			log.Printf("更新包下载地址: %s", assets.BrowserDownloadURL)

			downloadUrl = assets.BrowserDownloadURL
			downloadSize = assets.Size
			downloadDigest = assets.Digest
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
	client, err := HTTPClientForDownload(proxyUrl)
	if err != nil {
		log.Printf("创建 HTTP 客户端失败: %v", err)

		return err
	}

	const maxRetries = 3
	var (
		downloadedSize int64
		fileSize       int64
		lastErr        error
	)

	for attempt := 0; attempt < maxRetries; attempt++ {
		if attempt > 0 {
			backoff := time.Duration(1<<(attempt-1)) * time.Second
			log.Printf("下载第 %d 次失败（%v），%s 后重试，已下载 %d 字节",
				attempt, lastErr, backoff, downloadedSize)

			select {
			case <-time.After(backoff):
			case <-ctx.Done():
				RemoveFile(path)
				runtime.EventsEmit(a.ctx, "download-cancelled")
				return fmt.Errorf("下载已取消")
			}
		}

		err = downloadOnce(ctx, client, url, path, &downloadedSize, &fileSize, fc)
		if err == nil {
			return nil
		}

		if errors.Is(err, context.Canceled) || ctx.Err() != nil {
			RemoveFile(path)
			runtime.EventsEmit(a.ctx, "download-cancelled")
			return fmt.Errorf("下载已取消")
		}

		lastErr = err
	}

	log.Printf("下载更新包失败，已重试 %d 次: %v", maxRetries, lastErr)
	RemoveFile(path)
	return lastErr
}

// downloadOnce 执行一次下载尝试。若 downloadedSize > 0 则用 Range 请求续传；
// 服务器返回 200 时回退为全量下载并重置 downloadedSize。
func downloadOnce(
	ctx context.Context,
	client *http.Client,
	url, path string,
	downloadedSize, fileSize *int64,
	fc func(progress float64, total, downloaded int64),
) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		log.Printf("创建 HTTP 请求失败: %v", err)
		return err
	}

	if *downloadedSize > 0 {
		req.Header.Set("Range", fmt.Sprintf("bytes=%d-", *downloadedSize))
	}

	resp, err := client.Do(req)
	if err != nil {
		log.Printf("发送 HTTP 请求失败: %v", err)
		return err
	}
	defer resp.Body.Close()

	var file *os.File
	switch resp.StatusCode {
	case http.StatusPartialContent:
		file, err = os.OpenFile(path, os.O_WRONLY|os.O_APPEND, 0644)
		if err != nil {
			log.Printf("打开续传文件失败: %v", err)
			return err
		}
		if *fileSize == 0 {
			*fileSize = *downloadedSize + resp.ContentLength
		}
	case http.StatusOK:
		// 服务器忽略 Range 头或首次请求：从头开始
		*downloadedSize = 0
		file, err = os.Create(path)
		if err != nil {
			log.Printf("创建文件失败: %v", err)
			return err
		}
		*fileSize = resp.ContentLength
	default:
		log.Printf("下载更新包返回非预期状态码: %d", resp.StatusCode)
		return fmt.Errorf("下载更新包失败：HTTP %d", resp.StatusCode)
	}
	defer file.Close()

	buffer := make([]byte, 32*1024)
	progressTicker := time.NewTicker(time.Millisecond * 50)
	defer progressTicker.Stop()

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
			n, err := resp.Body.Read(buffer)
			if n > 0 {
				_, writeErr := file.Write(buffer[:n])
				if writeErr != nil {
					log.Printf("写入文件失败: %v", writeErr)
					return writeErr
				}

				*downloadedSize += int64(n)

				select {
				case <-progressTicker.C:
					if fc != nil && *fileSize > 0 {
						progress := float64(*downloadedSize) / float64(*fileSize) * 100
						fc(progress, *fileSize, *downloadedSize)
					}
				default:
				}
			}

			if err != nil {
				if errors.Is(err, io.EOF) {
					if fc != nil {
						fc(100, *fileSize, *downloadedSize)
					}
					return nil
				}
				log.Printf("读取响应体失败: %v", err)
				return err
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

		log.Printf("下载更新包失败: %v", err)

		runtime.EventsEmit(a.ctx, "download-error", err)

		return err
	}

	ctx, cancel := context.WithCancel(context.Background())
	a.cancel = cancel

	err := DownloadLatestRelease(ctx, a, downloadUrl, savePath, func(progress float64, total, downloaded int64) {
		runtime.EventsEmit(a.ctx, "download-progress", progress, total, downloaded)
	})
	if err != nil {
		log.Printf("下载更新包失败: %v", err)

		runtime.EventsEmit(a.ctx, "download-error", err.Error())

		return err
	}

	if err := verifyDownload(savePath, downloadSize, downloadDigest); err != nil {
		log.Printf("更新包校验失败: %v", err)

		RemoveFile(savePath)
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
		err := a.upgradeForWindows()
		if err != nil {
			log.Printf("升级版本失败: %v", err)

			return err
		}
	}

	if IsMacOS() {
		err := a.upgradeForMac()
		if err != nil {
			log.Printf("升级版本失败: %v", err)

			return err
		}
	}

	return nil
}

func (a *App) ShowChangelog() *ShowChangelogResult {
	changelogInfo, err := GetChangelogInfo(a)
	if err != nil {
		log.Printf("获取更新日志失败: %v", err)
		return &ShowChangelogResult{Flag: false, Err: "无法获取更新日志，请检查网络连接", Info: ""}
	}

	return &ShowChangelogResult{Flag: true, Err: "", Info: changelogInfo}
}

func (a *App) upgradeForWindows() error {
	userDownloadPath := GetUserDownloadPath()
	zipFilePath := filepath.Join(userDownloadPath, DOWNLOAD_ZIPFILE_NAME_WINDOWS)
	unzipExecFilePath := filepath.Join(userDownloadPath, APP_NAME+".exe")

	err := UnzipZIPFile(zipFilePath)
	if err != nil {
		log.Printf("解压 ZIP 文件失败: %v", err)

		return err
	}

	RemoveFile(zipFilePath)

	if _, err := os.Stat(unzipExecFilePath); err != nil {
		log.Printf("更新包解压后未找到可执行文件: %v", err)

		return fmt.Errorf("更新包解压后未找到可执行文件: %s", unzipExecFilePath)
	}

	oldExePath, err := os.Executable()
	if err != nil {
		log.Printf("获取当前可执行文件路径失败: %v", err)

		return err
	}

	if !strings.HasSuffix(strings.ToLower(oldExePath), ".exe") {
		return fmt.Errorf("当前不是 .exe 程序，无法升级: %s", oldExePath)
	}

	bakExePath := oldExePath + ".bak"
	logPath := filepath.Join(os.TempDir(), "horizon_update.log")

	// 路径通过命令行参数传入（%~1 = 去引号后的参数），避免拼接到脚本字面量带来的注入风险
	batchScript := `@echo off
setlocal enabledelayedexpansion
set "NEW_EXE=%~1"
set "OLD_EXE=%~2"
set "BAK_EXE=%~3"
set "LOG=%~4"

echo [Update] start > "%LOG%"

REM 1. 等待主程序退出并把旧 exe 重命名为 .bak（最多 10 次）
set /a retry=0
:rename_old
if exist "%BAK_EXE%" del /f /q "%BAK_EXE%" >nul 2>&1
move /y "%OLD_EXE%" "%BAK_EXE%" >nul 2>&1
if not errorlevel 1 goto move_new
set /a retry+=1
if !retry! GEQ 10 (
  echo [Update] failed: rename old after !retry! tries >> "%LOG%"
  start "" "%OLD_EXE%"
  goto cleanup
)
timeout /t 1 /nobreak >nul
goto rename_old

REM 2. 把新 exe 移到旧位置；失败则回滚
:move_new
move /y "%NEW_EXE%" "%OLD_EXE%" >nul 2>&1
if errorlevel 1 (
  echo [Update] failed: move new, rolling back >> "%LOG%"
  move /y "%BAK_EXE%" "%OLD_EXE%" >nul 2>&1
  start "" "%OLD_EXE%"
  goto cleanup
)

REM 3. 启动新版本，等旧进程退出后清理备份
start "" "%OLD_EXE%"
timeout /t 3 /nobreak >nul
del /f /q "%BAK_EXE%" >nul 2>&1
echo [Update] success >> "%LOG%"

:cleanup
del "%~f0"
exit /b 0
`

	batchFilePath := filepath.Join(os.TempDir(), "horizon_update.bat")
	err = os.WriteFile(batchFilePath, []byte(batchScript), 0644)
	if err != nil {
		log.Printf("创建批处理文件失败: %v", err)

		return err
	}

	cmd := exec.Command("cmd", "/c", batchFilePath, unzipExecFilePath, oldExePath, bakExePath, logPath)
	cmd.SysProcAttr = sysProcAttr
	err = cmd.Start()
	if err != nil {
		log.Printf("启动批处理文件失败: %v", err)

		return err
	}

	runtime.Quit(a.ctx)

	return nil
}

func (a *App) upgradeForMac() error {
	userDownloadPath := GetUserDownloadPath()
	zipFilePath := filepath.Join(userDownloadPath, DOWNLOAD_ZIPFILE_NAME_MACOS)
	unzipExecFilePath := filepath.Join(userDownloadPath, APP_NAME+".app")

	err := UnzipZIPFile(zipFilePath)
	if err != nil {
		log.Printf("解压 ZIP 文件失败: %v", err)

		return err
	}

	RemoveFile(zipFilePath)

	if _, err := os.Stat(unzipExecFilePath); err != nil {
		log.Printf("更新包解压后未找到 .app: %v", err)

		return fmt.Errorf("更新包解压后未找到 .app: %s", unzipExecFilePath)
	}

	oldAppExe, err := os.Executable()
	if err != nil {
		log.Printf("获取当前可执行文件路径失败: %v", err)

		return err
	}

	oldAppPath := filepath.Clean(filepath.Join(oldAppExe, "../../.."))

	// 安全校验：必须运行在 .app bundle 内才允许升级，避免 rm -rf 误删非 .app 路径
	if !strings.HasSuffix(oldAppPath, ".app") {
		return fmt.Errorf("当前未在 .app bundle 内运行，无法升级: %s", oldAppPath)
	}

	bakAppPath := oldAppPath + ".bak"
	logPath := filepath.Join(os.TempDir(), "horizon_update.log")

	// 路径通过位置参数传入，bash 直接收 argv，无需在脚本内做字面量转义
	script := `#!/bin/bash
NEW_APP="$1"
OLD_APP="$2"
BAK_APP="$3"
LOG="$4"

log() {
  echo "[$(date '+%H:%M:%S')] $1" >> "$LOG"
}

log "update start"

# 1. 把旧 .app 重命名为 .bak（最多 10 次）
retry=0
while [ $retry -lt 10 ]; do
  [ -e "$BAK_APP" ] && rm -rf "$BAK_APP"
  if mv "$OLD_APP" "$BAK_APP" 2>/dev/null; then
    break
  fi
  retry=$((retry+1))
  sleep 1
done

if [ ! -e "$BAK_APP" ]; then
  log "failed: rename old after $retry tries"
  open "$OLD_APP" 2>/dev/null
  rm -- "$0"
  exit 1
fi

# 2. 把新 .app 移到旧位置；失败则回滚
if ! mv "$NEW_APP" "$OLD_APP"; then
  log "failed: move new, rolling back"
  mv "$BAK_APP" "$OLD_APP"
  open "$OLD_APP"
  rm -- "$0"
  exit 1
fi

# 3. 清除 quarantine、启动新版本、等旧进程退出后清理备份
xattr -dr com.apple.quarantine "$OLD_APP" 2>/dev/null
open "$OLD_APP"
sleep 2
rm -rf "$BAK_APP"
log "success"
rm -- "$0"
`

	scriptPath := filepath.Join(os.TempDir(), "horizon_update.sh")
	err = os.WriteFile(scriptPath, []byte(script), 0755)
	if err != nil {
		log.Printf("创建脚本文件失败: %v", err)

		return err
	}

	cmd := exec.Command("bash", scriptPath, unzipExecFilePath, oldAppPath, bakAppPath, logPath)
	err = cmd.Start()
	if err != nil {
		log.Printf("启动脚本文件失败: %v", err)

		return err
	}

	runtime.Quit(a.ctx)

	return nil
}

// verifyDownload 校验下载文件大小与（若 release 提供了）SHA256 摘要
func verifyDownload(path string, expectedSize int64, expectedDigest string) error {
	info, err := os.Stat(path)
	if err != nil {
		return err
	}

	if expectedSize > 0 && info.Size() != expectedSize {
		return fmt.Errorf("文件大小不匹配: 期望 %d, 实际 %d", expectedSize, info.Size())
	}

	if !strings.HasPrefix(expectedDigest, "sha256:") {
		return nil
	}

	f, err := os.Open(path)
	if err != nil {
		return err
	}
	defer f.Close()

	h := sha256.New()
	if _, err := io.Copy(h, f); err != nil {
		return err
	}

	actual := hex.EncodeToString(h.Sum(nil))
	expected := strings.TrimPrefix(expectedDigest, "sha256:")
	if !strings.EqualFold(actual, expected) {
		return fmt.Errorf("SHA256 不匹配: 期望 %s, 实际 %s", expected, actual)
	}

	return nil
}

// CleanupStaleBackups 清理上次升级残留的 .bak 文件/目录
// Windows: <exe>.bak  /  macOS: <App.app>.bak
func CleanupStaleBackups() {
	exe, err := os.Executable()
	if err != nil {
		return
	}

	candidates := []string{exe + ".bak"}

	if IsMacOS() {
		appPath := filepath.Clean(filepath.Join(exe, "../../.."))
		if strings.HasSuffix(appPath, ".app") {
			candidates = append(candidates, appPath+".bak")
		}
	}

	for _, p := range candidates {
		if _, err := os.Stat(p); err != nil {
			continue
		}
		if err := os.RemoveAll(p); err != nil {
			log.Printf("清理升级残留备份失败 %s: %v", p, err)
		} else {
			log.Printf("已清理升级残留备份: %s", p)
		}
	}
}
