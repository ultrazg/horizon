package bridge

import "syscall"

var sysProcAttr = &syscall.SysProcAttr{
	HideWindow: true,
}
