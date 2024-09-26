document.addEventListener("DOMContentLoaded", () => {
  const adminPanelButton = document.getElementById("adminPanelButton");
  const accessAdminPanelButton = document.getElementById("accessAdminPanelButton");
  const adminPasswordInput = document.getElementById("adminPasswordInput");
  const searchBar = document.getElementById("searchBar");
  const searchButton = document.getElementById("searchButton");

  // Toast element
  const passwordToast = new bootstrap.Toast(document.getElementById('passwordToast'));

  // Fetch the admin password from the server and wait for it to load
  let serverPassword = null;

  // Create a function to wait for the password to be fetched
  const fetchAdminPassword = () => {
    return fetch('/admin-password')
      .then((response) => response.json())
      .then((data) => {
        serverPassword = data.password;
      });
  };

  // Focus the admin password input when the "Admin Panel" button is clicked
  adminPanelButton.addEventListener("click", () => {
    adminPasswordInput.focus();
  });

  // Handle admin login when "Login" button is clicked
  accessAdminPanelButton.addEventListener("click", function() {
    const username = document.getElementById('adminUsernameInput').value;
    const password = document.getElementById('adminPasswordInput').value;

    // Ensure the password is fetched before performing the login check
    fetchAdminPassword().then(() => {
      if (serverPassword === null) {
        console.error('Failed to load admin password.');
        return;
      }

      // Check the password fetched from the server
      if (username === "admin" && password === serverPassword) {
        // Redirect to admin.html upon correct login
        window.location.href = "admin.html";
      } else {
        // Show the toast for incorrect login
        passwordToast.show();

        // Hide the toast after 1.5 seconds
        setTimeout(() => {
          passwordToast.hide();
        }, 1500);
      }
    });
  });

  // Toggle password visibility
  document.getElementById("togglePasswordVisibility").addEventListener("click", () => {
    const adminPasswordInput = document.getElementById('adminPasswordInput');
    const passwordIcon = document.getElementById("passwordIcon");

    if (adminPasswordInput.type === "password") {
      adminPasswordInput.type = "text";
      passwordIcon.classList.remove("fa-eye");
      passwordIcon.classList.add("fa-eye-slash");
    } else {
      adminPasswordInput.type = "password";
      passwordIcon.classList.remove("fa-eye-slash");
      passwordIcon.classList.add("fa-eye");
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
      const categoryElement = document.getElementById(categories[file.category]);
      if (categoryElement) {
        categoryElement.appendChild(fileElement);
      }
    });
  }

  loadCategories();
});
