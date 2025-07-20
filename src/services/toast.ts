import "toastify-js/src/toastify.css";

import Toastify from "toastify-js";

export const toast = (message: string, warn: boolean = false) => {
  try {
    Toastify({
      text: message,
      duration: 3500,
      close: false,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      style: {
        "background": "var(--color-gray-950)",
        "border-radius": "0.5rem",
        "border": "dotted",
        "color": "var(--color-white)",
        "font-weight": warn ? "bold" : "normal",
        "font-size": warn ? "1.2rem" : "1rem",
        "border-width": "2px",
        "border-color": "var(--color-pink-800)",
        "box-shadow": "0 0 40px 15px rgba(130 1 120 / 20%)"
      }
    }).showToast();
  } catch (error) {
    console.error("Error showing toast:", error);
    console.log(message);
  }
};
