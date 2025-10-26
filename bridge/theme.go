package bridge

import (
	"log"
)

func (a *App) GetSystemTheme() string {
	theme, err := GetSystemThemeKey()
	if err != nil {
		log.Printf("get system theme error: %v", err)

		return "light"
	}

	return theme
}
