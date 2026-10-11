(function () {
    const makeSelect = document.getElementById("makeSelect");
    const makeFilter = document.getElementById("makeFilter");
    const yearSelect = document.getElementById("yearSelect");
    const typeSelect = document.getElementById("typeSelect");
    const searchBtn = document.getElementById("searchBtn");
    const statusText = document.getElementById("statusText");
    const modelList = document.getElementById("modelList");

    let allMakes = [];

    function fillYears() {
        const current = new Date().getFullYear();
        for (let y = current; y >= 1996; y--) {
            const opt = document.createElement("option");
            opt.value = y;
            opt.textContent = y;
            yearSelect.appendChild(opt);
        }
    }

    function renderMakes(list) {
        makeSelect.innerHTML = "";
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "-- select make --";
        makeSelect.appendChild(placeholder);

        list.forEach(function (m) {
            const opt = document.createElement("option");
            opt.value = m.make_ID;
            opt.textContent = m.make_Name;
            makeSelect.appendChild(opt);
        });
    }

    function updateSearchButton() {
        const ok = makeSelect.value && yearSelect.value && typeSelect.value;
        searchBtn.disabled = !ok;
    }

    async function loadMakes() {
        statusText.textContent = "Loading makes...";
        try {
            const res = await fetch("/api/vehicles/makes");
            allMakes = await res.json();
            renderMakes(allMakes);
            statusText.textContent = "";
        } catch (e) {
            statusText.textContent = "Could not load makes.";
        }
    }

    async function loadTypes(makeId) {
        typeSelect.disabled = true;
        typeSelect.innerHTML = "<option value=\"\">Loading...</option>";
        try {
            const res = await fetch("/api/vehicles/types/" + makeId);
            const types = await res.json();
            typeSelect.innerHTML = "";
            if (!types.length) {
                typeSelect.innerHTML = "<option value=\"\">No types for this make</option>";
            } else {
                types.forEach(function (t) {
                    const opt = document.createElement("option");
                    opt.value = t.vehicleTypeName;
                    opt.textContent = t.vehicleTypeName;
                    typeSelect.appendChild(opt);
                });
                typeSelect.disabled = false;
            }
        } catch (e) {
            typeSelect.innerHTML = "<option value=\"\">Error loading types</option>";
        }
        updateSearchButton();
    }

    async function searchModels() {
        const makeId = makeSelect.value;
        const year = yearSelect.value;
        const vehicleType = typeSelect.value;
        if (!makeId || !year || !vehicleType) return;

        modelList.innerHTML = "";
        statusText.textContent = "Searching...";
        searchBtn.disabled = true;

        const qs = new URLSearchParams({
            makeId: makeId,
            year: year,
            vehicleType: vehicleType
        });

        try {
            const res = await fetch("/api/vehicles/models?" + qs.toString());
            const models = await res.json();
            statusText.textContent = models.length ? models.length + " model(s) found" : "No models matched";

            models.forEach(function (m) {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.textContent = m.model_Name;
                modelList.appendChild(li);
            });
        } catch (e) {
            statusText.textContent = "Search failed.";
        }

        updateSearchButton();
    }

    makeFilter.addEventListener("input", function () {
        const q = makeFilter.value.trim().toLowerCase();
        if (!q) {
            renderMakes(allMakes);
            return;
        }
        const filtered = allMakes.filter(function (m) {
            return m.make_Name.toLowerCase().includes(q);
        });
        renderMakes(filtered);
    });

    makeSelect.addEventListener("change", function () {
        if (makeSelect.value) {
            loadTypes(makeSelect.value);
        } else {
            typeSelect.innerHTML = "<option value=\"\">Choose a make first</option>";
            typeSelect.disabled = true;
        }
        updateSearchButton();
    });

    yearSelect.addEventListener("change", updateSearchButton);
    typeSelect.addEventListener("change", updateSearchButton);
    searchBtn.addEventListener("click", searchModels);

    fillYears();
    loadMakes();
})();
