package bridge

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"
)

var client = &http.Client{
	Timeout: time.Second * 15,
}

func (a *App) CheckUpgrade() *CheckUpgradeInfo {
	latest, err := GetGithubReleaseInfo()
	if err != nil {
		fmt.Println("1")
		return &CheckUpgradeInfo{Err: err.Error(), IsLatest: false, Latest: nil}
	}

	remoteVersion := strings.TrimPrefix(latest.TagName, "v")
	if remoteVersion != APP_VERSION {
		return &CheckUpgradeInfo{Err: "", IsLatest: false, Latest: latest}
	} else {
		return &CheckUpgradeInfo{Err: "", IsLatest: true, Latest: nil}
	}
}

func GetGithubReleaseInfo() (*Latest, error) {
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

	return &Latest{
		TagName:   githubReleaseInfo.TagName,
		CreatedAt: githubReleaseInfo.CreatedAt,
		Body:      githubReleaseInfo.Body,
	}, nil
}
