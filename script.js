document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = "https://www.carqueryapi.com/api/0.3/?callback=?";
    const carMake = document.getElementById('carMake');
    const carYear = document.getElementById('carYear');
    const carBody = document.getElementById('carBody');
    const fetchModelsButton = document.getElementById('fetchModelsButton');
    const carModels = document.getElementById('carModels');

    // Obține modelele auto în funcție de parametrii selectați
    function fetchModels(make, year, body) {
        carModels.innerHTML = ""; // Curăță lista de modele

        // Construiește parametrii cererii
        const params = { cmd: "getModels", make, year, sold_in_us: 1 };
        if (body) {
            params.body = body;
        }

        // Trimite cererea către API
        $.getJSON(apiUrl, params, (data) => {
            if (data && data.Models) {
                data.Models.forEach(model => {
                    const modelElement = document.createElement('div');
                    modelElement.className = 'col-md-4 mb-4';
                    modelElement.innerHTML = `
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${model.model_name}</h5>
                                <p class="card-text">Ani de producție: ${model.model_years || "N/A"}</p>
                            </div>
                        </div>
                    `;
                    carModels.appendChild(modelElement);
                });
            } else {
                alert("Nu s-au găsit modele pentru parametrii selectați.");
            }
        }).fail(() => {
            alert("Eroare la obținerea modelelor. Verifică conexiunea sau API-ul.");
        });
    }

    // Eveniment pentru butonul de căutare
    fetchModelsButton.addEventListener('click', () => {
        const make = carMake.value.trim();
        const year = carYear.value.trim();
        const body = carBody.value.trim();

        if (!make || !year) {
            alert("Te rog completează câmpurile Marcă și An.");
            return;
        }

        fetchModels(make, year, body);
    });
});
