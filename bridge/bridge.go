package bridge

import (
	"context"
	"fmt"
	"runtime"

	"github.com/ultrazg/xyz/service"
	r "github.com/wailsapp/wails/v2/pkg/runtime"
)

func NewApp() *App {
	return &App{}
}

func (a *App) Start(ctx context.Context) {
	a.ctx = ctx

	err := service.Start()
	if err != nil {
		fmt.Println(err.Error())
	}
}

func IsWindows() bool {
	return runtime.GOOS == "windows"
}

func IsMacOS() bool {
	return runtime.GOOS == "darwin"
}

func (a *App) BeforeClose(ctx context.Context) bool {
	r.EventsEmit(a.ctx, "SaveLastPlay")

	return false
}
