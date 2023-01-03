import devTools from "devtools-detect";
import VueSimpleAlert from "vue-simple-alert";
import loginFunctions from "./loginFunctions";

// Check the pressed keyboard key
function ctrlShiftKey(e: KeyboardEvent, key: string): boolean {
  return e.ctrlKey && e.shiftKey && e.key === key;
}

/**
 * Returns `void`.
 *
 * Enables/Disables source code view in browser
 */
function enableViewSourceCodeOnBrowser(enable: boolean): void {
  //Stop loading when developer tools window is open
  if (!enable && devTools.isOpen) {
    VueSimpleAlert.alert("You are logged out because you open developer tools window in security page.");
    loginFunctions.logout();
  }

  // Disable context menu
  window.oncontextmenu = function (): boolean {
    return enable;
  };

  document.onkeydown = (e: KeyboardEvent): boolean => {
    // Disable F12, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + U
    if (!enable) {
      return !(
        e.key === "F12" ||
        ctrlShiftKey(e, "I") ||
        ctrlShiftKey(e, "i") ||
        ctrlShiftKey(e, "J") ||
        ctrlShiftKey(e, "j") ||
        ctrlShiftKey(e, "C") ||
        ctrlShiftKey(e, "c") ||
        (e.ctrlKey && (e.key === "U" || e.key === "u"))
      );
    } else {
      return true;
    }
  };
}

export default {
  enableViewSourceCodeOnBrowser,
};
