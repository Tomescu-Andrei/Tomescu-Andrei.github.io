document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postImageButton = document.getElementById('postImageButton');
    const postsContainer = document.getElementById('posts');
    const galleryContainer = document.getElementById('gallery');
    const localStorageKey = 'blogPosts';
    const galleryStorageKey = 'approvedPosts';

    // Funcție pentru redimensionarea imaginii
    function resizeImage(file, maxWidth, maxHeight, callback) {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    if (width > height) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    } else {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // Redimensionare și compresie
                callback(resizedDataUrl);
            };

            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    }

    // Încarcă postările din localStorage
    function loadPosts() {
        postsContainer.innerHTML = '';
        galleryContainer.innerHTML = '';

        const savedPosts = JSON.parse(localStorage.getItem(localStorageKey)) || [];
        savedPosts.forEach(post => {
            displayPost(post.name, post.email, post.image, false);
        });

        const approvedPosts = JSON.parse(localStorage.getItem(galleryStorageKey)) || [];
        approvedPosts.forEach(post => {
            displayPost(post.name, post.email, post.image, true);
        });
    }

    // Afișează o postare
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
                        <button class="btn btn-success btn-sm approve-button">✔ Aproba</button>
                        <button class="btn btn-danger btn-sm delete-button">✖ Șterge</button>
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

    // Salvează o postare în localStorage
    function savePostToLocalStorage(name, email, image) {
        const savedPosts = JSON.parse(localStorage.getItem(localStorageKey)) || [];
        savedPosts.push({ name, email, image });
        localStorage.setItem(localStorageKey, JSON.stringify(savedPosts));
    }

    // Aproba o postare
    function approvePost(name, email, image) {
        const approvedPosts = JSON.parse(localStorage.getItem(galleryStorageKey)) || [];
        approvedPosts.push({ name, email, image });
        localStorage.setItem(galleryStorageKey, JSON.stringify(approvedPosts));

        removePostFromLocalStorage(name, email, image, localStorageKey);
        displayPost(name, email, image, true);
    }

    // Respinge o postare
    function rejectPost(name, email, image) {
        removePostFromLocalStorage(name, email, image, localStorageKey);
    }

    // Șterge o postare din localStorage
    function removePostFromLocalStorage(name, email, image, storageKey) {
        const savedPosts = JSON.parse(localStorage.getItem(storageKey)) || [];
        const updatedPosts = savedPosts.filter(
            post => post.name !== name || post.email !== email || post.image !== image
        );
        localStorage.setItem(storageKey, JSON.stringify(updatedPosts));
    }

    // Gestionarea trimiterii formularului
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

        // Redimensionează imaginea înainte de a o salva
        resizeImage(file, 800, 800, (resizedImage) => {
            displayPost(name, email, resizedImage, false);
            savePostToLocalStorage(name, email, resizedImage);
            postForm.reset();
        });
    });

    // Validează formatul email-ului
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Încarcă postările la inițializare
    loadPosts();
});
