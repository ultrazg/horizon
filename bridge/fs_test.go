package bridge

import (
	"fmt"
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
	path := `C:\Users\XXX\Downloads\upgrade-windows.zip`

	err := UnzipZIPFile(path)
	if err != nil {
		fmt.Println(err.Error())
	} else {
		fmt.Println("unzip success")
	}
}
