document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postImageButton = document.getElementById('postImageButton');
    const postsContainer = document.getElementById('posts');
    const galleryContainer = document.getElementById('gallery');
    const localStorageKey = 'blogPosts';
    const galleryStorageKey = 'approvedPosts';

    // Load saved posts from localStorage
    function loadPosts() {
        const savedPosts = JSON.parse(localStorage.getItem(localStorageKey)) || [];
        savedPosts.forEach(post => {
            displayPost(post.name, post.email, post.image, false);
        });

        const approvedPosts = JSON.parse(localStorage.getItem(galleryStorageKey)) || [];
        approvedPosts.forEach(post => {
            displayPost(post.name, post.email, post.image, true);
        });
    }

    // Display a single post
    function displayPost(name, email, image, isApproved) {
        const container = isApproved ? galleryContainer : postsContainer;

        const postElement = document.createElement('div');
        postElement.className = 'col-md-4 mb-4';
        postElement.innerHTML = `
            <div class="card">
                <img src="${image}" class="card-img-top" alt="Poză mașină">
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                    ${email ? `<p class="card-text">${email}</p>` : ''}
                    ${!isApproved ? `
                        <button class="btn btn-success btn-sm approve-button">✔</button>
                        <button class="btn btn-danger btn-sm delete-button">✖</button>
                    ` : ''}
                </div>
            </div>
        `;
        container.appendChild(postElement);

        if (!isApproved) {
            const approveButton = postElement.querySelector('.approve-button');
            const deleteButton = postElement.querySelector('.delete-button');

            approveButton.addEventListener('click', () => {
                approvePost(name, email, image);
                postElement.remove();
            });

            deleteButton.addEventListener('click', () => {
                rejectPost(name, email, image);
                postElement.remove();
            });
        }
    }

    // Save a single post to localStorage
    function savePostToLocalStorage(name, email, image) {
        const savedPosts = JSON.parse(localStorage.getItem(localStorageKey)) || [];
        savedPosts.push({ name, email, image });
        localStorage.setItem(localStorageKey, JSON.stringify(savedPosts));
    }

    // Approve post
    function approvePost(name, email, image) {
        const approvedPosts = JSON.parse(localStorage.getItem(galleryStorageKey)) || [];
        approvedPosts.push({ name, email, image });
        localStorage.setItem(galleryStorageKey, JSON.stringify(approvedPosts));

        removePostFromLocalStorage(name, email, image, localStorageKey);
        displayPost(name, email, image, true);
    }

    // Reject post
    function rejectPost(name, email, image) {
        removePostFromLocalStorage(name, email, image, localStorageKey);
    }

    // Remove a post from localStorage
    function removePostFromLocalStorage(name, email, image, storageKey) {
        const savedPosts = JSON.parse(localStorage.getItem(storageKey)) || [];
        const updatedPosts = savedPosts.filter(
            post => post.name !== name || post.email !== email || post.image !== image
        );
        localStorage.setItem(storageKey, JSON.stringify(updatedPosts));
    }

    // Handle post submission
    postImageButton.addEventListener('click', () => {
        const name = document.getElementById('posterName').value.trim();
        const email = document.getElementById('posterEmail').value.trim();
        const imageInput = document.getElementById('carImage');

        if (!name) {
            alert('Câmpul Nume este obligatoriu.');
            return;
        }

        if (email && !validateEmail(email)) {
            alert('Adresa de email nu este validă.');
            return;
        }

        if (!imageInput.files || imageInput.files.length === 0) {
            alert('Te rog încarcă o poză.');
            return;
        }

        const file = imageInput.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const image = reader.result;
            displayPost(name, email, image, false);
            savePostToLocalStorage(name, email, image);
            postForm.reset();
        };

        reader.readAsDataURL(file);
    });

    // Validate email format
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Immediate email validation on blur
    const posterEmail = document.getElementById('posterEmail');
    posterEmail.addEventListener('blur', () => {
        const email = posterEmail.value.trim();
        const errorMessage = document.getElementById('emailErrorMessage');

        if (!email || validateEmail(email)) {
            if (errorMessage) {
                errorMessage.textContent = '';
            }
        } else {
            if (!errorMessage) {
                const errorDiv = document.createElement('div');
                errorDiv.id = 'emailErrorMessage';
                errorDiv.className = 'text-danger mt-1';
                errorDiv.textContent = 'Adresa de email nu este validă.';
                posterEmail.parentNode.appendChild(errorDiv);
            } else {
                errorMessage.textContent = 'Adresa de email nu este validă.';
            }
        }
    });

    // Load posts on page load
    loadPosts();

    
});
