//go:build windows
// +build windows

package bridge

import (
	"golang.org/x/sys/windows/registry"
)

func GetSystemThemeKey() (string, error) {
	key, err := registry.OpenKey(
		registry.CURRENT_USER,
		`Software\Microsoft\Windows\CurrentVersion\Themes\Personalize`,
		registry.QUERY_VALUE,
	)
	if err != nil {
		return "light", err
	}
	defer key.Close()

	appsUseLightTheme, _, err := key.GetIntegerValue("AppsUseLightTheme")
	if err != nil {
		return "light", err
	}

	if appsUseLightTheme == 0 {
		return "dark", nil
	}

	return "light", nil
}
