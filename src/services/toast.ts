import "toastify-js/src/toastify.css"

import Toastify from "toastify-js"

export const toast = (message: string) => {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
  }).showToast();
}