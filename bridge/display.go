package bridge

import "github.com/kbinani/screenshot"

func GetDisplaySize() (int, int) {
	bounds := screenshot.GetDisplayBounds(0)

	return bounds.Dx(), bounds.Dy()
}
