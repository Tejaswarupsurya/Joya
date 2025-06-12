export function setupPasswordValidation({
  passwordId = "password",
  confirmId = "confirm",
  submitId = "submitBtn",
} = {}) {
  const password = document.getElementById(passwordId);
  const confirm = document.getElementById(confirmId);
  const submitBtn = document.getElementById(submitId);

  function validate() {
    if (!password.value || !confirm.value) {
      confirm.classList.remove("is-valid", "is-invalid");
      submitBtn?.removeAttribute("disabled");
      return;
    }

    if (password.value === confirm.value) {
      confirm.classList.add("is-valid");
      confirm.classList.remove("is-invalid");
      submitBtn?.removeAttribute("disabled");
    } else {
      confirm.classList.add("is-invalid");
      confirm.classList.remove("is-valid");
      submitBtn?.setAttribute("disabled", true);
    }
  }

  password?.addEventListener("input", validate);
  confirm?.addEventListener("input", validate);
}

export function setupEyeToggle() {
  const icons = document.querySelectorAll(".eye-toggle");
  icons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const input = icon.previousElementSibling;
      const isHidden = input.getAttribute("type") === "password";
      input.setAttribute("type", isHidden ? "text" : "password");
      icon.classList.toggle("bi-eye");
      icon.classList.toggle("bi-eye-slash");
    });
  });
}


