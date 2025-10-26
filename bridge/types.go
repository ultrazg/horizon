package bridge

import (
	"context"
	"time"
)

type App struct {
	ctx    context.Context
	cancel context.CancelFunc
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
	Body      string    `json:"body"`
}

type GithubReleaseInfo struct {
	URL       string `json:"url"`
	AssetsURL string `json:"assets_url"`
	UploadURL string `json:"upload_url"`
	HTMLURL   string `json:"html_url"`
	ID        int    `json:"id"`
	Author    struct {
		Login             string `json:"login"`
		ID                int    `json:"id"`
		NodeID            string `json:"node_id"`
		AvatarURL         string `json:"avatar_url"`
		GravatarID        string `json:"gravatar_id"`
		URL               string `json:"url"`
		HTMLURL           string `json:"html_url"`
		FollowersURL      string `json:"followers_url"`
		FollowingURL      string `json:"following_url"`
		GistsURL          string `json:"gists_url"`
		StarredURL        string `json:"starred_url"`
		SubscriptionsURL  string `json:"subscriptions_url"`
		OrganizationsURL  string `json:"organizations_url"`
		ReposURL          string `json:"repos_url"`
		EventsURL         string `json:"events_url"`
		ReceivedEventsURL string `json:"received_events_url"`
		Type              string `json:"type"`
		UserViewType      string `json:"user_view_type"`
		SiteAdmin         bool   `json:"site_admin"`
	} `json:"author"`
	NodeID          string    `json:"node_id"`
	TagName         string    `json:"tag_name"`
	TargetCommitish string    `json:"target_commitish"`
	Name            string    `json:"name"`
	Draft           bool      `json:"draft"`
	Prerelease      bool      `json:"prerelease"`
	CreatedAt       time.Time `json:"created_at"`
	PublishedAt     time.Time `json:"published_at"`
	Assets          []struct {
		URL      string      `json:"url"`
		ID       int         `json:"id"`
		NodeID   string      `json:"node_id"`
		Name     string      `json:"name"`
		Label    interface{} `json:"label"`
		Uploader struct {
			Login             string `json:"login"`
			ID                int    `json:"id"`
			NodeID            string `json:"node_id"`
			AvatarURL         string `json:"avatar_url"`
			GravatarID        string `json:"gravatar_id"`
			URL               string `json:"url"`
			HTMLURL           string `json:"html_url"`
			FollowersURL      string `json:"followers_url"`
			FollowingURL      string `json:"following_url"`
			GistsURL          string `json:"gists_url"`
			StarredURL        string `json:"starred_url"`
			SubscriptionsURL  string `json:"subscriptions_url"`
			OrganizationsURL  string `json:"organizations_url"`
			ReposURL          string `json:"repos_url"`
			EventsURL         string `json:"events_url"`
			ReceivedEventsURL string `json:"received_events_url"`
			Type              string `json:"type"`
			UserViewType      string `json:"user_view_type"`
			SiteAdmin         bool   `json:"site_admin"`
		} `json:"uploader"`
		ContentType        string    `json:"content_type"`
		State              string    `json:"state"`
		Size               int       `json:"size"`
		DownloadCount      int       `json:"download_count"`
		CreatedAt          time.Time `json:"created_at"`
		UpdatedAt          time.Time `json:"updated_at"`
		BrowserDownloadURL string    `json:"browser_download_url"`
	} `json:"assets"`
	TarballURL string `json:"tarball_url"`
	ZipballURL string `json:"zipball_url"`
	Body       string `json:"body"`
}
