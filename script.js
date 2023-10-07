document.addEventListener("DOMContentLoaded", function () {
    const dataList = document.getElementById("data-list");
    const errorMessage = document.getElementById("error-message");
    const addForm = document.getElementById("add-form");
    const newItemInput = document.getElementById("new-item");

    let apiUrl = "https://jsonplaceholder.typicode.com/posts"; // Replace with your API URL
    let items = [];
    
    // Fetch data from the API
    async function fetchData() {
        try {
            const response = await fetch(apiUrl);
    
            // Check if the response status is in the range 200-299 (successful)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            // Parse the JSON response
            const data = await response.json();
    
            // Limit the number of items to 5
            items = data.slice(0, 5);
    
            // Call the function to display the data
            displayData(items);
        } catch (error) {
            // Handle errors, for example, display an error message
            handleErrorMessage(error.message);
        }
    }
    
    // Display items in the UI
    function displayData(data) {
        dataList.innerHTML = "";
        data.forEach(item => {
            const listItem = createListItem(item);
            dataList.appendChild(listItem);

            const editButton = listItem.querySelector(".edit-btn");
            const deleteButton = listItem.querySelector(".delete-btn");

            editButton.addEventListener("click", () => {
                editItem(item);
            });

            deleteButton.addEventListener("click", () => {
                deleteItem(item);
            });
        });
    }

    // Create a list item for an item
    function createListItem(item) {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <span class="item-text">${item.title}</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>`;
        return listItem;
    }

    // Handle error messages
    function handleErrorMessage(error) {
        errorMessage.textContent = `Error: ${error.message}`;
        errorMessage.classList.remove("hidden");
    }

    // Add a new item to the API
    function addItem(title) {
        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title
            })
        })
        .then(response => response.json())
        .then(data => {
            items.push(data);
            displayData(items);
        })
        .catch(error => {
            handleErrorMessage(error);
        });
    }

    // Edit an existing item
    function editItem(item) {
        const updatedTitle = prompt("Edit item:", item.title);
        if (updatedTitle !== null) {
            fetch(apiUrl + "/" + item.id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: updatedTitle
                })
            })
            .then(response => response.json())
            .then(data => {
                item.title = data.title;
                displayData(items);
            })
            .catch(error => {
                handleErrorMessage(error);
            });
        }
    }

    // Delete an item
    function deleteItem(item) {
        fetch(apiUrl + "/" + item.id, {
            method: "DELETE"
        })
        .then(response => {
            if (response.ok) {
                const index = items.indexOf(item);
                if (index !== -1) {
                    items.splice(index, 1);
                    displayData(items);
                }
            } else {
                throw new Error("Delete request failed.");
            }
        })
        .catch(error => {
            handleErrorMessage(error);
        });
    }

    // Event listener for form submission
    addForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const newItemTitle = newItemInput.value.trim();
        if (newItemTitle !== "") {
            addItem(newItemTitle);
            newItemInput.value = "";
        }
    });

    // Initial data fetch
    fetchData();
});
