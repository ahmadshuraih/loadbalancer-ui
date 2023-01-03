import { SecurityInfo } from "@/types";
import VueSimpleAlert from "vue-simple-alert";
import securityWebFacade from "../webServicesFacades/securityWebFacade";
import loginFunctions from "./loginFunctions";
import securityConfig from "./securityConfig";

/**
 * Returns `void`.
 *
 * This function shows/hides the password fields.
 */
function togglePassword(input: string): void {
  const typeToSet = document.querySelector(`#${input}`)?.getAttribute("type") === "password" ? "text" : "password";
  if (typeToSet === "text") {
    VueSimpleAlert.fire({
      title: "Please enter the password to see the contents",
      input: "password",
      inputPlaceholder: "Enter your password",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
      },
    }).then((p) => {
      if (p.value === securityConfig.getPassword()) {
        document.querySelector(`#${input}`)?.setAttribute("type", typeToSet);
        document.querySelector(`#togglePassword-${input}`)?.classList.toggle("fa-eye-slash");
      } else {
        loginFunctions.logout();
        VueSimpleAlert.alert("The entered password is not correct, you are logged out");
      }
    });
  } else {
    document.querySelector(`#${input}`)?.setAttribute("type", typeToSet);
    document.querySelector(`#togglePassword-${input}`)?.classList.toggle("fa-eye-slash");
  }
}

/**
 * Returns `Promise<void>`.
 *
 * Update security info.
 */
async function updateSecurityInfo(event: Event, securityInfo: SecurityInfo): Promise<void> {
  event.preventDefault();
  VueSimpleAlert.fire({
    title: "Please enter the current password to change the security info",
    input: "password",
    inputPlaceholder: "Enter your password",
    inputAttributes: {
      autocapitalize: "off",
      autocorrect: "off",
    },
  }).then(async (p) => {
    if (p.value === securityConfig.getPassword()) {
      const response = await securityWebFacade.updateSecurityInfo(securityInfo);
      if (response.succeed) {
        loginFunctions.logout();
        VueSimpleAlert.alert(response.message);
      } else {
        VueSimpleAlert.alert(response.error);
      }
    } else {
      loginFunctions.logout();
      VueSimpleAlert.alert("The entered password is not correct, you are logged out");
    }
  });
}

export default {
  togglePassword,
  updateSecurityInfo,
};
