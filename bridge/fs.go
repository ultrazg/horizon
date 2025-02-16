package bridge

import (
	"log"
	"os"
	"os/user"
	"path/filepath"
)

func IsExist(path string) bool {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return false
	}

	return true
}

func GetPath() string {
	execPath, err := os.Executable()
	if err != nil {
		log.Println("获取程序路径失败:", err)
		return ""
	}

	// 获取所在目录
	execDir := filepath.Dir(execPath)
	log.Println("程序所在目录:", execDir)

	return execDir
}

func GetUserDownloadPath() string {
	current, err := user.Current()
	if err != nil {
		return ""
	}

	return filepath.Join(current.HomeDir, "Downloads")
}
