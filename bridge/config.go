package bridge

import (
	"log"

	"github.com/spf13/viper"
)

const (
	configFileName = "config"
	configFilePath = "."
	configFile     = configFilePath + "/" + configFileName + ".yaml"
)

func initConfig() {
	viper.SetConfigName(configFileName)
	viper.AddConfigPath(configFilePath)
	viper.SetConfigType("yaml")

	viper.SetDefault("user.access_token", "")
	viper.SetDefault("user.refresh_token", "")
	viper.SetDefault("setting.check_update_on_startup", true)
	viper.SetDefault("proxy.enabled", false)
	viper.SetDefault("proxy.ip", "")
	viper.SetDefault("proxy.port", "")

	if err := viper.SafeWriteConfigAs(configFile); err != nil {
		log.Printf("创建配置文件失败: %v", err)
	}
}

func (a *App) ReadConfig() *Config {
	if !IsExist(configFile) {
		initConfig()
	}

	viper.SetConfigName(configFileName)
	viper.AddConfigPath(configFilePath)
	viper.SetConfigType("yaml")

	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("读取配置文件失败: %v", err)
	}

	var c *Config

	if err := viper.Unmarshal(&c); err != nil {
		log.Fatalf("解析配置文件失败: %v", err)
	}

	return c
}

func (a *App) UpdateConfig(key string, value any) (bool, string) {
	viper.Set(key, value)

	if err := viper.WriteConfig(); err != nil {
		log.Println("无法写入配置文件")

		return false, "无法写入配置文件"
	}

	log.Println("配置文件已更新")
	return true, "配置文件已更新"
}
