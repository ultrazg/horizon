//go:build darwin
// +build darwin

package bridge

import (
	"bytes"
	"os/exec"
)

func GetSystemThemeKey() (string, error) {
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
