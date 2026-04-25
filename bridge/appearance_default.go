//go:build !darwin

package bridge

func setMacAppearance(mode string) bool {
	return false
}
