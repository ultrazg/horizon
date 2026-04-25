package bridge

func (a *App) SetMacAppearance(mode string) bool {
	return setMacAppearance(mode)
}
