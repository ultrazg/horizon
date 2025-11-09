package bridge

import (
	"context"
	"log"
	"runtime"

	"github.com/ultrazg/xyz/service"
	r "github.com/wailsapp/wails/v2/pkg/runtime"
)

func NewApp() *App {
	return &App{}
}

func (a *App) Start(ctx context.Context) {
	a.ctx = ctx
	logFile, err := initLog()
	if err != nil {
		log.Printf("初始化日志失败: %v", err)
	}

	a.logFile = logFile

	err = service.Start()
	if err != nil {
		log.Printf("启动 xyz 服务失败: %v", err)
	}

	log.Println("Start")
	log.Printf("%s %s %s", APP_VERSION, runtime.GOOS, runtime.GOARCH)
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

func (a *App) Shutdown(ctx context.Context) {
	log.Println("Shutdown")

	if a.logFile != nil {
		a.logFile.Close()
	}
}
