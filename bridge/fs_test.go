package bridge

import (
	"fmt"
	"testing"
)

func TestGetUserDownloadPath(t *testing.T) {
	path := GetUserDownloadPath()

	fmt.Printf("user download path %s", path)
}
