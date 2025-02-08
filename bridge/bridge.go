package bridge

import (
	"context"
	"fmt"
	"runtime"

	"github.com/ultrazg/xyz/service"
	r "github.com/wailsapp/wails/v2/pkg/runtime"
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

func (a *App) BeforeClose(ctx context.Context) (prevent bool) {
	dialog, err := r.MessageDialog(ctx, r.MessageDialogOptions{
		Type:    r.QuestionDialog,
		Title:   APP_NAME,
		Message: "是否退出应用?",
	})

	if err != nil {
		return false
	}

	// TODO: 保存正在播放的音频信息

	return dialog != "Yes"
}
