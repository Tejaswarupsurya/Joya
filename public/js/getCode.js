export function setupOtpHandler({
  buttonId,
  usernameId,
  emailId,
  timerTextId,
}) {
  const getCodeBtn = document.getElementById(buttonId);
  const usernameInput = document.getElementById(usernameId);
  const emailInput = document.getElementById(emailId);

  if (!getCodeBtn || !usernameInput || !emailInput) return;

  getCodeBtn.addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();

    if (!username || !email) {
      alert("Please enter username and email first.");
      return;
    }

    try {
      const res = await fetch("/get-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email }),
      });

      const data = await res.json();
      if (data.success) {
        // Check if preview URL is available (Ethereal email service)
        if (data.previewUrl) {
          let message = `✅ ${data.message}\n\n📧 View your OTP email: ${data.previewUrl}\n\nCode expires in 10 minutes.`;

          if (confirm(message + "\n\nWould you like to open your email now?")) {
            window.open(data.previewUrl, "_blank");
          }
        }
        // Check if we're in development mode and code is provided
        else if (data.code) {
          alert(
            `Development Mode - Your reset code is: ${data.code} (valid for 10 minutes)\n\nIn production, this would be sent to your email.`
          );
        } else {
          alert(
            `OTP sent successfully to your email address!\n\nPlease check your inbox and enter the 6-digit code below.\n\nCode expires in 10 minutes.`
          );
        }
        setupCooldown(buttonId, timerTextId, 60);
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (err) {
      alert("Server error: " + err.message);
    }
  });
}

function setupCooldown(buttonId, timerTextId, durationInSeconds) {
  const getCodeBtn = document.getElementById(buttonId);
  const timerText = document.getElementById(timerTextId);

  let timeLeft = durationInSeconds;
  getCodeBtn.disabled = true;

  const timer = setInterval(() => {
    timeLeft--;
    if (timerText) {
      timerText.textContent = `You can request OTP again in ${timeLeft}s`;
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      getCodeBtn.disabled = false;
      if (timerText) timerText.textContent = "";
    }
  }, 1000);
}
