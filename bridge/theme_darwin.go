//go:build darwin
// +build darwin

package bridge

import (
	"bytes"
	"log"
	"os/exec"
)

func GetSystemThemeKey() (SystemTheme, error) {
	cmd := exec.Command("defaults", "read", "-g", "AppleInterfaceStyle")
	var out bytes.Buffer
	cmd.Stdout = &out
	err := cmd.Run()
	if err != nil {
		log.Printf("无法获取系统主题: %v", err)

		return SystemThemeLight, err
	}

	log.Printf("系统主题: %s", out.String())

	if out.String() == "Dark\n" {
		return SystemThemeDark, nil
	}

	return SystemThemeLight, nil
}
