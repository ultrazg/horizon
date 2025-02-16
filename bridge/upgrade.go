package bridge

import (
	"encoding/json"
	"fmt"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
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
		if strings.Contains(strings.ToLower(assets.Name), "darwin") && runtime.Environment(a.ctx).Platform == "darwin" {
			downloadUrl = assets.BrowserDownloadURL
		}

		if strings.Contains(strings.ToLower(assets.Name), "windows") && runtime.Environment(a.ctx).Platform == "windows" {
			downloadUrl = assets.BrowserDownloadURL
		}
	}

	return &Latest{
		TagName:   githubReleaseInfo.TagName,
		CreatedAt: githubReleaseInfo.CreatedAt,
		Body:      githubReleaseInfo.Body,
	}, nil
}

func DownloadLatestRelease(a *App, url string, path string, fc func(progress float64, total, downloaded int64)) error {
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
		n, err := resp.Body.Read(buffer)
		if n > 0 {
			_, err := create.Write(buffer[:n])
			if err != nil {
				return err
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

			break
		}
	}

	fc(100, fileSize, downloadedSize)

	return nil
}

func (a *App) Upgrade() error {
	path := GetUserDownloadPath()
	savePath := filepath.Join(path, "horizon-upgrade.zip")

	if downloadUrl == "" {
		fmt.Println("找不到更新包下载地址")

		runtime.EventsEmit(a.ctx, "download-error", fmt.Errorf("找不到更新包下载地址"))
		return fmt.Errorf("找不到更新包下载地址")
	}

	fmt.Println("download url --->", downloadUrl)

	err := DownloadLatestRelease(a, downloadUrl, savePath, func(progress float64, total, downloaded int64) {
		fmt.Println("正在下载...", progress)

		runtime.EventsEmit(a.ctx, "download-progress", progress, total, downloaded)
	})
	if err != nil {
		fmt.Println("下载出错", err)

		runtime.EventsEmit(a.ctx, "download-error", err.Error())
		return fmt.Errorf("下载出错 %v", err)
	} else {
		fmt.Println("下载成功")

		runtime.EventsEmit(a.ctx, "download-complete")
	}

	return nil
}
