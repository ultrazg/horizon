package bridge

import (
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"time"
)

func initLog() (*os.File, error) {
	var logDir string

	if IsWindows() {
		execDir, err := os.Getwd()
		if err != nil {
			return nil, fmt.Errorf("无法获取当前执行目录: %w", err)
		}

		logDir = filepath.Join(execDir, "logs")
		if err := os.MkdirAll(logDir, 0755); err != nil {
			return nil, fmt.Errorf("创建日志目录失败: %w", err)
		}
	}

	if IsMacOS() {
		configDir, err := os.UserConfigDir()
		if err != nil {
			log.Printf("获取用户配置目录失败: %v", err)
		}

		logDir = filepath.Join(configDir, APP_NAME, "logs")
		if err := os.MkdirAll(logDir, 0755); err != nil {
			return nil, fmt.Errorf("创建日志目录失败: %w", err)
		}
	}

	timestamp := time.Now().Format("2006-01-02_15-04-05")
	logFileName := fmt.Sprintf("%s.log", timestamp)
	logFilePath := filepath.Join(logDir, logFileName)

	f, err := os.OpenFile(logFilePath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		return nil, fmt.Errorf("打开日志文件失败: %w", err)
	}

	multiWriter := io.MultiWriter(os.Stdout, f)
	log.SetOutput(multiWriter)

	log.SetFlags(log.LstdFlags | log.Lshortfile)

	log.Printf("日志文件初始化: %s\n", logFilePath)

	return f, nil
}
