package bridge

import (
	"context"
	"os"
	"time"
)

type App struct {
	ctx     context.Context
	cancel  context.CancelFunc
	logFile *os.File
}

type Config struct {
	User    User    `yaml:"user" json:"user"`
	Setting Setting `yaml:"setting" json:"setting"`
	Proxy   Proxy   `yaml:"proxy" json:"proxy"`
	Play    Play    `yaml:"play" json:"play"`
}

type User struct {
	AccessToken  string `mapstructure:"access_token" json:"accessToken"`
	RefreshToken string `mapstructure:"refresh_token" json:"refreshToken"`
}

type Setting struct {
	CheckUpdateOnStartup bool   `mapstructure:"check_update_on_startup" json:"checkUpdateOnStartup"`
	Theme                string `mapstructure:"theme" json:"theme"`
}

type Proxy struct {
	Enabled bool   `mapstructure:"enabled" json:"enabled"`
	Ip      string `mapstructure:"ip" json:"ip"`
	Port    string `mapstructure:"port" json:"port"`
}

type Play struct {
	LastPlayEid string `mapstructure:"last_play_eid" json:"last_play_eid"`
}

type CheckUpgradeInfo struct {
	Err      string  `json:"err"`
	IsLatest bool    `json:"isLatest"`
	Latest   *Latest `json:"latest"`
}

type Latest struct {
	TagName   string    `json:"tag_name"`
	CreatedAt time.Time `json:"created_at"`
}

type GithubReleaseInfo struct {
	TagName   string    `json:"tag_name"`
	CreatedAt time.Time `json:"created_at"`
	Assets    []struct {
		Name               string `json:"name"`
		BrowserDownloadURL string `json:"browser_download_url"`
		Size               int64  `json:"size"`
		Digest             string `json:"digest"`
	} `json:"assets"`
	Body string `json:"body"`
}

type TestConnectResult struct {
	Flag bool  `json:"flag"`
	Code int   `json:"code"`
	Err  error `json:"err"`
}

type SystemTheme string

const (
	SystemThemeLight SystemTheme = "light"
	SystemThemeDark  SystemTheme = "dark"
)

type ShowChangelogResult struct {
	Flag bool   `json:"flag"`
	Err  string `json:"err"`
	Info string `json:"info"`
}

type ShowStickerModalOptions struct {
	Uid         string `json:"uid"`
	Perspective string `json:"perspective"`
}

type ShowProfileModalOptions struct {
	Uid string `json:"uid"`
}

type ShowSubscriptionModalOptions struct {
	Uid         string `json:"uid"`
	Perspective string `json:"perspective"`
}

type ShowPodcastDetailModalOptions struct {
	Pid string `json:"pid"`
}
