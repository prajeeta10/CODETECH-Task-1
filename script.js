const API_URL = 'http://localhost:3000/api/items';

// DOM Elements
const itemsList = document.getElementById('items-list');
const itemForm = document.getElementById('item-form');
const itemIdInput = document.getElementById('item-id');
const itemNameInput = document.getElementById('item-name');
const itemDescriptionInput = document.getElementById('item-description');

// Fetch and display items
async function fetchItems() {
    const response = await fetch(API_URL);
    const items = await response.json();
    itemsList.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${item.name}</strong>
            <p>${item.description}</p>
            <div class="actions">
                <button class="edit" onclick="editItem(${item.id})">Edit</button>
                <button onclick="deleteItem(${item.id})">Delete</button>
            </div>
        `;
        itemsList.appendChild(li);
    });
}

// Add or update an item
itemForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = itemIdInput.value.trim(); // Get the ID (if it exists)
    const name = itemNameInput.value.trim();
    const description = itemDescriptionInput.value.trim();

    const item = { name, description };

    if (id) {
        // Update an existing item
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });
    } else {
        // Create a new item
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });
    }

    // Reset the form and clear the ID field
    itemForm.reset();
    itemIdInput.value = ''; // Clear the ID to prepare for new entries
    fetchItems();
});


// Delete an item
async function deleteItem(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchItems();
}

// Edit an item
function editItem(id) {
    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(item => {
            itemIdInput.value = item.id;
            itemNameInput.value = item.name;
            itemDescriptionInput.value = item.description;
        });
}

// Initial fetch
fetchItems();
