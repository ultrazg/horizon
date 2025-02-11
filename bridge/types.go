package bridge

import "context"

type App struct {
	ctx context.Context
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
	CheckUpdateOnStartup bool `mapstructure:"check_update_on_startup" json:"checkUpdateOnStartup"`
	IsIpLocHidden        bool `mapstructure:"is_ip_loc_hidden" json:"isIpLocHidden"`
}

type Proxy struct {
	Enabled bool   `mapstructure:"enabled" json:"enabled"`
	Ip      string `mapstructure:"ip" json:"ip"`
	Port    string `mapstructure:"port" json:"port"`
}

type Play struct {
	LastPlayEid string `mapstructure:"last_play_eid" json:"last_play_eid"`
}
