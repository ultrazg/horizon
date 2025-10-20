package bridge

import (
	"log"
	"os"
	"path/filepath"

	"github.com/spf13/viper"
)

const configFileName = "config.yaml"

var configFilePath string

func init() {
	initConfig()
}

func initConfig() {
	if IsMacOS() {
		configDir, err := os.UserConfigDir()
		if err != nil {
			log.Printf("获取用户配置目录失败: %v", err)
		}

		configFilePath = filepath.Join(configDir, APP_NAME)
		if err := os.MkdirAll(configFilePath, os.ModePerm); err != nil {
			log.Printf("创建配置目录失败: %v", err)
		}
	} else {
		configFilePath = "."
	}

	configFile := filepath.Join(configFilePath, configFileName)

	println("配置文件：", configFile)

	viper.SetConfigFile(configFile)
	viper.SetConfigType("yaml")

	if _, err := os.Stat(configFile); os.IsNotExist(err) {
		setDefaults()

		err := viper.ReadInConfig()
		if err != nil {
			log.Printf("读取配置文件失败: %v", err)

			if err = viper.SafeWriteConfigAs(configFile); err != nil {
				log.Printf("写入配置文件失败: %v", err)
			}
		}
	} else {
		err := viper.ReadInConfig()
		if err != nil {
			log.Printf("读取配置文件失败: %v", err)
		}
	}

	// setDefaults()

	// if !IsExist(configFile) {
	// 	if err := viper.SafeWriteConfigAs(configFile); err != nil {
	// 		log.Printf("创建配置文件失败: %v", err)
	// 	}
	// } else {
	// 	if err := viper.ReadInConfig(); err != nil {
	// 		log.Printf("读取配置文件失败: %v", err)
	// 	}
	// }
}

func setDefaults() {
	viper.SetDefault("user.access_token", "")
	viper.SetDefault("user.refresh_token", "")
	viper.SetDefault("setting.check_update_on_startup", true)
	viper.SetDefault("proxy.enabled", false)
	viper.SetDefault("proxy.ip", "")
	viper.SetDefault("proxy.port", "")
	viper.SetDefault("play.last_play_eid", "")
}

func (a *App) ReadConfig() Config {
	var c Config
	if err := viper.Unmarshal(&c); err != nil {
		log.Printf("解析配置文件失败: %v", err)
	}
	return c
}

func (a *App) UpdateConfig(key string, value any) (bool, string) {
	viper.Set(key, value)

	if err := viper.WriteConfig(); err != nil {
		log.Printf("无法写入配置文件: %v", err)
		return false, "无法写入配置文件"
	}

	log.Println("配置文件已更新")
	return true, "配置文件已更新"
}
