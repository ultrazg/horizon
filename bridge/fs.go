package bridge

import (
	"archive/zip"
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"
	"os/user"
	"path/filepath"
)

func IsExist(path string) bool {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		log.Printf("路径不存在: %s", path)

		return false
	}

	return true
}

func GetUserDownloadPath() string {
	current, err := user.Current()
	if err != nil {
		log.Println(err)

		return ""
	}

	return filepath.Join(current.HomeDir, "Downloads")
}

func UnzipZIPFile(path string) error {
	log.Printf("zip file: %s", path)

	archive, err := zip.OpenReader(path)
	if err != nil {
		log.Println(err)

		return err
	}

	defer archive.Close()

	output := GetUserDownloadPath()

	for _, f := range archive.File {
		filePath := filepath.Join(output, f.Name)

		if f.FileInfo().IsDir() {
			err := os.MkdirAll(filePath, f.Mode())
			if err != nil {
				log.Println(err)

				return err
			}

			continue
		}

		srcFile, err := f.Open()
		if err != nil {
			log.Println(err)

			return err
		}

		defer srcFile.Close()

		destFile, err := os.Create(filePath)
		if err != nil {
			log.Println(err)

			return err
		}

		defer destFile.Close()

		_, err = io.Copy(destFile, srcFile)
		if err != nil {
			log.Println(err)

			return err
		}

		err = os.Chmod(filePath, f.Mode())
		if err != nil {
			log.Println(err)

			return err
		}
	}

	return nil
}

func RemoveFile(path string) error {
	if IsExist(path) {
		err := os.Remove(path)
		if err != nil {
			log.Println(err)

			return err
		}
	}

	return nil
}

func OpenDir(path string) error {
	log.Printf("打开目录: %s", path)

	if IsWindows() {
		cmd := exec.Command("explorer", path)

		return cmd.Start()
	}

	if IsMacOS() {
		cmd := exec.Command("open", path)

		return cmd.Start()
	}

	return nil
}

func (a *App) OpenLogDir() error {
	var logPath string

	if IsWindows() {
		execDir, err := os.Getwd()
		if err != nil {
			log.Printf("无法获取当前目录: %v", err)

			return fmt.Errorf("无法获取当前目录: %w", err)
		}

		logPath = filepath.Join(execDir, "logs")
	}

	if IsMacOS() {
		configDir, err := os.UserConfigDir()
		if err != nil {
			log.Printf("获取用户配置目录失败: %v", err)

			return fmt.Errorf("获取用户配置目录失败: %w", err)
		}

		logPath = filepath.Join(configDir, APP_NAME, "logs")
	}

	err := OpenDir(logPath)
	if err != nil {
		return fmt.Errorf("打开日志目录失败: %w", err)
	}

	return nil
}
