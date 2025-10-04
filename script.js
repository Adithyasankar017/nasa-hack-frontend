document.addEventListener('DOMContentLoaded', () => {
    const exoplanetList = document.getElementById('exoplanet-list');
    const searchInput = document.getElementById('searchInput');
    const filterMethod = document.getElementById('filterMethod');
    let allExoplanets = []; // Store the full list of exoplanets

    // NASA Exoplanet Archive API URL (This fetches a larger, more useful list of confirmed exoplanets)
    const apiUrl = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,discoverymethod,disc_year,pl_bmasse,pl_rade,pl_orbper+from+exoplanet+where+default_flag+=+1&format=json';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allExoplanets = data; // Save the fetched data to the variable
            displayExoplanets(allExoplanets); // Display all planets initially
        })
        .catch(error => {
            exoplanetList.innerHTML = `<p>Error loading data: ${error.message}</p>`;
            console.error('Fetch error:', error);
        });

    // Event Listeners for searching and filtering
    searchInput.addEventListener('input', filterAndDisplay);
    filterMethod.addEventListener('change', filterAndDisplay);

    function filterAndDisplay() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedMethod = filterMethod.value;

        const filteredExoplanets = allExoplanets.filter(planet => {
            // Ensure planet.pl_name and planet.discoverymethod exist before calling methods
            const planetName = planet.pl_name ? planet.pl_name.toLowerCase() : '';
            const planetDiscoveryMethod = planet.discoverymethod || '';

            // Check if planet name contains the search term
            const matchesSearch = planetName.includes(searchTerm);
            
            // Check if the discovery method matches the filter
            const matchesFilter = selectedMethod === '' || planetDiscoveryMethod === selectedMethod;

            return matchesSearch && matchesFilter;
        });

        displayExoplanets(filteredExoplanets);
    }

    function displayExoplanets(exoplanets) {
        exoplanetList.innerHTML = ''; // Clear the existing list

        if (exoplanets.length === 0) {
            exoplanetList.innerHTML = '<p>No exoplanets found matching your criteria.</p>';
            return;
        }

        exoplanets.forEach(planet => {
            const card = document.createElement('div');
            card.className = 'exoplanet-card';

            // Use optional chaining or explicit checks for potentially missing data
            const mass = planet.pl_bmasse ? `${planet.pl_bmasse.toFixed(2)} Earth masses` : 'N/A';
            const radius = planet.pl_rade ? `${planet.pl_rade.toFixed(2)} Earth radii` : 'N/A';
            const period = planet.pl_orbper ? `${planet.pl_orbper.toFixed(2)} days` : 'N/A';

            card.innerHTML = `
                <h2>${planet.pl_name || 'Unnamed Exoplanet'}</h2>
                <p><strong>Discovery Method:</strong> ${planet.discoverymethod || 'N/A'}</p>
                <p><strong>Discovery Year:</strong> ${planet.disc_year || 'N/A'}</p>
                <p><strong>Mass:</strong> ${mass}</p>
                <p><strong>Radius:</strong> ${radius}</p>
                <p><strong>Orbital Period:</strong> ${period}</p>
            `;

            exoplanetList.appendChild(card);
        });
    }
});