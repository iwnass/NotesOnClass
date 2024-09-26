document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const filesList = document.getElementById("filesList");
  const goBackButton = document.getElementById("goBackButton");

  // Toast elements
  const uploadToast = new bootstrap.Toast(document.getElementById('uploadToast'));
  const deleteToast = new bootstrap.Toast(document.getElementById('deleteToast'));

  // Variable to store the ID of the file to delete
  let fileIdToDelete;

  // Handle file upload
  uploadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(uploadForm);

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          uploadToast.show(); // Show upload success toast
          loadFiles();
          uploadForm.reset(); // Reset form fields after upload
        } else {
          alert("Failed to upload file."); // Optionally handle errors
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  // Load files
  function loadFiles() {
    fetch("/files")
      .then((response) => response.json())
      .then((data) => {
        filesList.innerHTML = "";
        data.files.forEach((file) => {
          const fileElement = document.createElement("div");
          fileElement.innerHTML = `
                        <p>${file.title} (${file.category})</p>
                        <a href="${file.url}" target="_blank">View</a>
                        <button data-id="${file.id}" class="deleteButton">Delete</button>
                    `;
          filesList.appendChild(fileElement);
        });

        // Attach event listeners to delete buttons
        document.querySelectorAll(".deleteButton").forEach((button) => {
          button.addEventListener("click", (event) => {
            fileIdToDelete = event.target.getAttribute("data-id");
            const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
            deleteConfirmationModal.show();
          });
        });
      });
  }

  // Confirm delete file
  document.getElementById('confirmDeleteButton').addEventListener("click", () => {
    deleteFile(fileIdToDelete);
    const deleteConfirmationModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
    deleteConfirmationModal.hide();
  });

  // Delete file
  function deleteFile(fileId) {
    fetch(`/delete/${fileId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          deleteToast.show(); // Show delete success toast
          loadFiles();
        } else {
          alert("Failed to delete file."); // Optionally handle errors
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  setTimeout(() => {
    uploadToast.hide();
  }, 1500); // For upload toast
  
  setTimeout(() => {
    deleteToast.hide();
  }, 1500); // For delete toast

  // Go back to main page
  goBackButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  loadFiles();
});
