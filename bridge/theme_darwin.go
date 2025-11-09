//go:build darwin
// +build darwin

package bridge

import (
	"bytes"
	"log"
	"os/exec"
)

func GetSystemThemeKey() (string, error) {
	cmd := exec.Command("defaults", "read", "-g", "AppleInterfaceStyle")
	var out bytes.Buffer
	cmd.Stdout = &out
	err := cmd.Run()
	if err != nil {
		log.Printf("无法获取系统主题: %v", err)

		return "light", err
	}

	log.Printf("系统主题: %s", out.String())

	if out.String() == "Dark\n" {
		return "dark", nil
	}

	return "light", nil
}
