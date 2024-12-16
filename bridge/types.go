package bridge

import "context"

type App struct {
	ctx context.Context
}

type Config struct {
	User    User    `yaml:"user" json:"user"`
	Setting Setting `yaml:"setting" json:"setting"`
}

type User struct {
	AccessToken  string `mapstructure:"access_token" json:"accessToken"`
	RefreshToken string `mapstructure:"refresh_token" json:"refreshToken"`
}

type Setting struct {
	CheckUpdateOnStartup bool `mapstructure:"check_update_on_startup" json:"checkUpdateOnStartup"`
	IsIpLocHidden        bool `mapstructure:"is_ip_loc_hidden" json:"isIpLocHidden"`
}
