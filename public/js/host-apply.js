// Host Application Form JavaScript

document.addEventListener("DOMContentLoaded", function () {
  const photoUpload = document.getElementById("photoUpload");
  const avatarInput = document.getElementById("avatarInput");
  const uploadContent = document.getElementById("uploadContent");
  const previewContainer = document.getElementById("previewContainer");
  const previewImage = document.getElementById("previewImage");
  const removeImage = document.getElementById("removeImage");

  // Click to upload
  photoUpload.addEventListener("click", () => {
    avatarInput.click();
  });

  // Drag and drop functionality
  photoUpload.addEventListener("dragover", (e) => {
    e.preventDefault();
    photoUpload.classList.add("dragover");
  });

  photoUpload.addEventListener("dragleave", () => {
    photoUpload.classList.remove("dragover");
  });

  photoUpload.addEventListener("drop", (e) => {
    e.preventDefault();
    photoUpload.classList.remove("dragover");
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      avatarInput.files = files;
      handleFileSelect(files[0]);
    }
  });

  // File input change
  avatarInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  });

  // Remove image
  removeImage.addEventListener("click", (e) => {
    e.stopPropagation();
    avatarInput.value = "";
    uploadContent.style.display = "block";
    previewContainer.style.display = "none";
    avatarInput.classList.remove("is-valid");
  });

  function handleFileSelect(file) {
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      uploadContent.style.display = "none";
      previewContainer.style.display = "block";
      avatarInput.classList.add("is-valid");
    };
    reader.readAsDataURL(file);
  }

  // Form validation for phone and aadhaar
  const phoneInput = document.getElementById("phone");
  const aadhaarInput = document.getElementById("aadhaar");

  phoneInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").substring(0, 10);
  });

  aadhaarInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").substring(0, 12);
  });

  // Bootstrap form validation
  const form = document.querySelector(".needs-validation");
  form.addEventListener("submit", function (event) {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add("was-validated");
  });
});
