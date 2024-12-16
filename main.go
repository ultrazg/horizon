package main

import (
	"github.com/ultrazg/horizon/bridge"
	"github.com/wailsapp/wails/v2"
)

func main() {
	err := wails.Run(AppOptions(bridge.NewApp()))
	if err != nil {
		println("Error:", err.Error())
	}
}
