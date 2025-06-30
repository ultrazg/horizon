package main

import (
	"embed"
	"fmt"
	"runtime"

	"github.com/ultrazg/horizon/bridge"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

//go:embed build/appicon.png
var icon []byte

func AppOptions(app *bridge.App) *options.App {
	return &options.App{
		Title:     bridge.APP_NAME,
		Width:     1024,
		Height:    720,
		MinWidth:  1024,
		MinHeight: 720,
		// DisableResize: true,
		AssetServer: &assetserver.Options{
			Assets:  assets,
			Handler: bridge.NewHttpRequest(),
		},
		//BackgroundColour: &options.RGBA{R: 67, G: 67, B: 67, A: 1},
		OnStartup:     app.Start,
		OnBeforeClose: app.BeforeClose,
		Bind: []interface{}{
			app,
		},
		Frameless: runtime.GOOS == "windows",
		Windows: &windows.Options{
			WebviewIsTransparent:              true,
			WindowIsTranslucent:               true,
			BackdropType:                      windows.Acrylic,
			DisableWindowIcon:                 false,
			Theme:                             windows.Dark,
			DisableFramelessWindowDecorations: false,
		},
		Mac: &mac.Options{
			TitleBar:             mac.TitleBarHiddenInset(),
			Appearance:           mac.NSAppearanceNameDarkAqua,
			WebviewIsTransparent: true,
			WindowIsTranslucent:  true,
			About: &mac.AboutInfo{
				Title:   fmt.Sprintf("%s %s", bridge.APP_NAME, bridge.APP_VERSION),
				Message: "第三方小宇宙桌面客户端，支持 Windows 与 macOS\r\n\r\n© 2025 2bit",
				Icon:    icon,
			},
		},
		Debug: options.Debug{
			OpenInspectorOnStartup: true,
		},
	}
}
