package bridge

import (
	"log"
)

func (a *App) GetSystemTheme() SystemTheme {
	theme, err := GetSystemThemeKey()
	if err != nil {
		log.Printf("get system theme error: %v", err)

		return SystemThemeLight
	}

	return SystemTheme(theme)
}
