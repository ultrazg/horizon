//go:build darwin

package bridge

/*
#cgo CFLAGS: -x objective-c
#cgo LDFLAGS: -framework Cocoa

#include <stdlib.h>
#import <Cocoa/Cocoa.h>

static void horizon_set_mac_appearance(const char *mode) {
	void (^applyAppearance)(void) = ^{
		NSString *appearanceName = nil;
		if (mode != NULL) {
			NSString *value = [NSString stringWithUTF8String:mode];
			if ([value isEqualToString:@"light"]) {
				appearanceName = NSAppearanceNameAqua;
			} else if ([value isEqualToString:@"dark"]) {
				appearanceName = NSAppearanceNameDarkAqua;
			}
		}

		NSAppearance *appearance = appearanceName != nil ? [NSAppearance appearanceNamed:appearanceName] : nil;
		[NSApp setAppearance:appearance];

		NSWindow *window = [NSApp mainWindow];
		if (window == nil) {
			window = [NSApp keyWindow];
		}
		if (window != nil) {
			[window setAppearance:appearance];
			[[window contentView] setNeedsDisplay:YES];
		}
	};

	if ([NSThread isMainThread]) {
		applyAppearance();
		return;
	}

	dispatch_sync(dispatch_get_main_queue(), applyAppearance);
}
*/
import "C"
import "unsafe"

func setMacAppearance(mode string) bool {
	cMode := C.CString(mode)
	defer C.free(unsafe.Pointer(cMode))

	C.horizon_set_mac_appearance(cMode)
	return true
}
