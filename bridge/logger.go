package bridge

import (
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"time"
)

type safeWriter struct {
	w io.Writer
}

func (s safeWriter) Write(p []byte) (int, error) {
	_, _ = s.w.Write(p)
	return len(p), nil
}

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

	multiWriter := io.MultiWriter(safeWriter{os.Stdout}, f)
	log.SetOutput(multiWriter)

	log.SetFlags(log.LstdFlags | log.Lshortfile)

	log.Printf("日志文件初始化: %s\n", logFilePath)

	return f, nil
}

func (a *App) Log(msg string) {
	log.Println(msg)
}

// CleanOldLogs 删除日志目录下修改时间早于七天前的 *.log 文件，返回删除数量。
func (a *App) CleanOldLogs() (int, error) {
	var logDir string

	if IsWindows() {
		execDir, err := os.Getwd()
		if err != nil {
			return 0, fmt.Errorf("无法获取当前执行目录: %w", err)
		}
		logDir = filepath.Join(execDir, "logs")
	}

	if IsMacOS() {
		configDir, err := os.UserConfigDir()
		if err != nil {
			return 0, fmt.Errorf("获取用户配置目录失败: %w", err)
		}
		logDir = filepath.Join(configDir, APP_NAME, "logs")
	}

	entries, err := os.ReadDir(logDir)
	if err != nil {
		if os.IsNotExist(err) {
			return 0, nil
		}
		return 0, fmt.Errorf("读取日志目录失败: %w", err)
	}

	cutoff := time.Now().AddDate(0, 0, -7)
	removed := 0

	for _, entry := range entries {
		if entry.IsDir() || filepath.Ext(entry.Name()) != ".log" {
			continue
		}

		info, err := entry.Info()
		if err != nil {
			log.Printf("读取日志文件信息失败 %s: %v", entry.Name(), err)
			continue
		}

		if !info.ModTime().Before(cutoff) {
			continue
		}

		path := filepath.Join(logDir, entry.Name())
		if err := os.Remove(path); err != nil {
			log.Printf("删除日志文件失败 %s: %v", path, err)
			continue
		}

		removed++
		log.Printf("已删除过期日志: %s", path)
	}

	return removed, nil
}
