package bridge

import (
	"bytes"
	"log"
	"os/exec"

	"golang.org/x/sys/windows/registry"
)

func (a *App) GetSystemTheme() string {
	var theme string

	if IsWindows() {
		t, err := getWindowsTheme()
		if err != nil {
			log.Printf("getWindowsTheme error: %v", err)
		}

		theme = t
	}

	if IsMacOS() {
		t, err := getMacosTheme()
		if err != nil {
			log.Printf("getMacosTheme error: %v", err)
		}

		theme = t
	}

	return theme
}

func getWindowsTheme() (string, error) {
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
		return "", err
	}

	if appsUseLightTheme == 0 {
		return "dark", nil
	}

	return "light", nil
}

func getMacosTheme() (string, error) {
	cmd := exec.Command("defaults", "read", "-g", "AppleInterfaceStyle")
	var out bytes.Buffer
	cmd.Stdout = &out
	err := cmd.Run()
	if err != nil {
		return "light", err
	}

	if out.String() == "Dark\n" {
		return "dark", nil
	}

	return "light", nil
}
