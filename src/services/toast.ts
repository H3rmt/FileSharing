import "toastify-js/src/toastify.css";

import Toastify from "toastify-js";

export const toast = (message: string) => {
  Toastify({
    text: message,
    duration: 3500,
    close: false,
    gravity: "bottom",
    position: "center",
    stopOnFocus: true,
    style: {
      background: "hsl(var(--toast-background))",
      "border-radius": "0.5rem",
      border: "dotted",
      color: "hsl(var(--toast-color))",
      "border-width": "2px",
      "border-color": "hsl(var(--border))",
      "box-shadow": "0 0 60px 30px rgba(130, 1, 120, 0.2)",
    },
  }).showToast();
};
