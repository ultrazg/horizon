//go:build windows
// +build windows

package bridge

import (
	"log"

	"golang.org/x/sys/windows/registry"
)

func GetSystemThemeKey() (SystemTheme, error) {
	key, err := registry.OpenKey(
		registry.CURRENT_USER,
		`Software\Microsoft\Windows\CurrentVersion\Themes\Personalize`,
		registry.QUERY_VALUE,
	)
	if err != nil {
		log.Printf("读取系统注册表失败: %v", err)

		return SystemThemeLight, err
	}
	defer key.Close()

	appsUseLightTheme, _, err := key.GetIntegerValue("AppsUseLightTheme")
	if err != nil {
		log.Printf("读取系统主题失败: %v", err)

		return SystemThemeLight, err
	}

	if appsUseLightTheme == 0 {
		return SystemThemeDark, nil
	}

	return SystemThemeLight, nil
}
