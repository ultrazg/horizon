package bridge

import (
	"archive/zip"
	"io"
	"log"
	"os"
	"os/user"
	"path/filepath"
	"strings"
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

func GetPathForMac() string {
	execPath, err := os.Executable()
	if err != nil {
		log.Println("获取程序路径失败:", err)
		return ""
	}

	execPath = execPath[:strings.LastIndex(execPath, "/")]
	appPath := execPath[:strings.LastIndex(execPath, "/")]
	appPath = appPath[:strings.LastIndex(appPath, "/")]
	parentPath := execPath[strings.LastIndex(execPath, "/")+1:]

	if parentPath == "MacOS" {
		return appPath
	} else {
		return ""
	}
}

func GetUserDownloadPath() string {
	current, err := user.Current()
	if err != nil {
		return ""
	}

	return filepath.Join(current.HomeDir, "Downloads")
}

func UnzipZIPFile(path string) error {
	archive, err := zip.OpenReader(path)
	if err != nil {
		return err
	}

	defer archive.Close()

	output := GetUserDownloadPath()

	for _, f := range archive.File {
		filePath := filepath.Join(output, f.Name)

		if f.FileInfo().IsDir() {
			err := os.MkdirAll(filePath, f.Mode())
			if err != nil {
				return err
			}

			continue
		}

		srcFile, err := f.Open()
		if err != nil {
			return err
		}

		defer srcFile.Close()

		destFile, err := os.Create(filePath)
		if err != nil {
			return err
		}

		defer destFile.Close()

		_, err = io.Copy(destFile, srcFile)
		if err != nil {
			return err
		}

		err = os.Chmod(filePath, f.Mode())
		if err != nil {
			return err
		}
	}

	return nil
}
