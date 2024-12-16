package bridge

import (
	"context"
	"fmt"
	"runtime"

	"github.com/ultrazg/xyz/service"
)

var isStartup = true

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

func (a *App) IsStartup() bool {
	if isStartup {
		isStartup = false

		return true
	}

	return false
}

func IsWindows() bool {
	return runtime.GOOS == "windows"
}

func IsMacOS() bool {
	return runtime.GOOS == "darwin"
}
