document.addEventListener("DOMContentLoaded", () => {
  const adminPanelButton = document.getElementById("adminPanelButton");
  const adminPasswordContainer = document.getElementById(
    "adminPasswordContainer"
  );
  const accessAdminPanelButton = document.getElementById("accessAdminPanel");
  const adminPasswordInput = document.getElementById("adminPassword");
  const searchBar = document.getElementById("searchBar");
  const searchButton = document.getElementById("searchButton");

  // Show admin panel password input when the button is clicked
  adminPanelButton.addEventListener("click", () => {
  adminPasswordContainer.style.display = "block";
  adminPasswordInput.focus();
  });

  // Access admin panel when password is submitted
  accessAdminPanelButton.addEventListener("click", () => {
    const password = adminPasswordInput.value;
    if (password === "1234") {
      window.location.href = "admin.html";
    } else {
      alert("Incorrect password!");
    }
  });

  // Trigger admin panel access on Enter key press
  adminPasswordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      accessAdminPanelButton.click();
    }

    if (event.key === "Escape") {
      adminPasswordContainer.style.display = 'none';
    }
  });

  // Trigger search on Search button click
  searchButton.addEventListener("click", () => {
    performSearch(searchBar.value);
  });

  // Trigger search on Enter key press in the search bar
  searchBar.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      searchButton.click();
    }
  });

  // Function to perform search
  function performSearch(query) {
    fetch("/files")
      .then((response) => response.json())
      .then((data) => {
        const files = data.files;
        const lowerCaseQuery = query.toLowerCase();
        const filteredFiles = files.filter(
          (file) =>
            file.title.toLowerCase().includes(lowerCaseQuery) ||
            file.url.toLowerCase().includes(lowerCaseQuery)
        );
        displayFiles(filteredFiles);
      });
  }

  // Function to load categories and files
  function loadCategories() {
    fetch("/files")
      .then((response) => response.json())
      .then((data) => {
        const files = data.files;
        displayFiles(files);
      });
  }

  // Function to display files in appropriate categories
  function displayFiles(files) {
    const categories = {
      Προγραμματισμός: "filesCategory1",
      Δίκτυα: "filesCategory2",
      Άλγεβρα: "filesCategory3",
      ΣχεδΕφαρμογών: "filesCategory4",
      Φυσική: "filesCategory5",
      Γλώσσα: "filesCategory6",
      ΒάσειςΔεδομένων: "filesCategory7", // New Category
    };

    // Clear all categories
    Object.values(categories).forEach((id) => {
      document.getElementById(id).innerHTML = "";
    });

    // Populate categories
    files.forEach((file) => {
      const fileElement = document.createElement("div");
      fileElement.innerHTML = `
                <p>${file.title}</p>
                <button type="button" class="btn btn-success"><a href="${file.url}" target="_blank" style="text-decoration: none; color: white;">View</a></button>
            `;
      const categoryElement = document.getElementById(
        categories[file.category]
      );
      if (categoryElement) {
        categoryElement.appendChild(fileElement);
      }
    });
  }

  loadCategories();
});


