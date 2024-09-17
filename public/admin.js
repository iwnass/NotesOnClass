document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const filesList = document.getElementById("filesList");
  const goBackButton = document.getElementById("goBackButton");

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
          alert("File uploaded successfully!");
          loadFiles();
          uploadForm.reset(); // Reset form fields after upload
        } else {
          alert("Failed to upload file.");
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
            const fileId = event.target.getAttribute("data-id");
            deleteFile(fileId);
          });
        });
      });
  }

  // Delete file
  function deleteFile(fileId) {
    fetch(`/delete/${fileId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("File deleted successfully!");
          loadFiles();
        } else {
          alert("Failed to delete file.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Go back to main page
  goBackButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  loadFiles();
});
