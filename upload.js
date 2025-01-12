document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postImageButton = document.getElementById('postImageButton');
    const postsContainer = document.getElementById('posts');

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
            const postElement = document.createElement('div');
            postElement.className = 'col-md-4 mb-4';
            postElement.innerHTML = `
                <div class="card">
                    <img src="${reader.result}" class="card-img-top" alt="Poză mașină">
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                        ${email ? `<p class="card-text">${email}</p>` : ''}
                    </div>
                </div>
            `;
            postsContainer.appendChild(postElement);
        };

        reader.readAsDataURL(file);

        // Resetare formular
        postForm.reset();
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});
