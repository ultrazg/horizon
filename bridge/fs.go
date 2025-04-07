package bridge

import (
	"archive/zip"
	"io"
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

func RemoveFile(path string) error {
	if IsExist(path) {
		err := os.Remove(path)
		if err != nil {
			return err
		}
	}

	return nil
}
