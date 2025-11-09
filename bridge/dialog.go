package bridge

import (
	"log"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// ShowDialog 显示对话框
func (a *App) MessageDialog(dialogType runtime.DialogType, title, message string) (string, error) {
	if IsMacOS() && dialogType == runtime.QuestionDialog {
		result, err := runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
			Type:          runtime.QuestionDialog,
			Title:         title,
			Message:       message,
			DefaultButton: "否",
			Buttons:       []string{"是", "否"},
		})
		if err != nil {
			return "", err
		}

		return result, nil
	}

	result, err := runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
		Type:    dialogType,
		Title:   title,
		Message: message,
	})
	if err != nil {
		log.Println(err)
		return "", err
	}

	return result, nil
}
