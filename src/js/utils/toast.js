import { Toast } from "toaster-js"
import "toaster-js/default.css"

export const showToast = (message, type = 'success') => {
    return new Toast(message, type, 3000);
}