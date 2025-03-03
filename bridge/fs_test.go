package bridge

import (
	"fmt"
	"os"
	"path/filepath"
	"testing"
)

func TestGetUserDownloadPath(t *testing.T) {
	path := GetUserDownloadPath()

	fmt.Printf("user download path %s", path)
}

func TestGetPath(t *testing.T) {
	GetPath()
}

func TestUnzipZIPFile(t *testing.T) {
	path := `C:\Users\XXX\Downloads\horizon-upgrade.zip`

	err := UnzipZIPFile(path)
	if err != nil {
		fmt.Println(err.Error())
	} else {
		fmt.Println("unzip success")
	}
}

func TestLibraryRoot(t *testing.T) {
	exePath, err := os.Executable()
	if err != nil {
		fmt.Println(err.Error())
	}

	basePath := filepath.Dir(exePath)
	fmt.Println("basePath", basePath)
}

func TestGetMacOSUserConfigDir(t *testing.T) {
	configDir, err := os.UserConfigDir()
	if err != nil {
		println(err.Error())
	}

	println("configDir", configDir)
}
