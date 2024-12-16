package bridge

import "github.com/wailsapp/wails/v2/pkg/runtime"

// ShowDialog 显示对话框
func (a *App) MessageDialog(dialogType runtime.DialogType, title, message string) (string, error) {
	result, err := runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
		Type:    dialogType,
		Title:   title,
		Message: message,
	})
	if err != nil {
		return "", err
	}

	return result, nil
}
