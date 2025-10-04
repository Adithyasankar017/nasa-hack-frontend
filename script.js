document.addEventListener('DOMContentLoaded', () => {
    const exoplanetList = document.getElementById('exoplanet-list');
    const searchInput = document.getElementById('searchInput');
    const filterMethod = document.getElementById('filterMethod');
    const modal = document.getElementById('planet-modal');
    const modalDetails = document.getElementById('modal-details');
    const closeBtn = document.querySelector('.close-btn');
    let allExoplanets = [];

    const apiUrl = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+exoplanet+where+default_flag+=+1&format=json';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allExoplanets = data;
            displayExoplanets(allExoplanets);
        })
        .catch(error => {
            exoplanetList.innerHTML = `<p>Error loading data: ${error.message}</p>`;
            console.error('Fetch error:', error);
        });

    searchInput.addEventListener('input', filterAndDisplay);
    filterMethod.addEventListener('change', filterAndDisplay);
    
    // Close modal when close button is clicked
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    // Close modal when user clicks outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    function filterAndDisplay() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedMethod = filterMethod.value;

        const filteredExoplanets = allExoplanets.filter(planet => {
            const planetName = planet.pl_name ? planet.pl_name.toLowerCase() : '';
            const planetDiscoveryMethod = planet.discoverymethod || '';
            const matchesSearch = planetName.includes(searchTerm);
            const matchesFilter = selectedMethod === '' || planetDiscoveryMethod === selectedMethod;
            return matchesSearch && matchesFilter;
        });

        displayExoplanets(filteredExoplanets);
    }

    // Updated function to create clickable cards
    function displayExoplanets(exoplanets) {
        exoplanetList.innerHTML = ''; 

        if (exoplanets.length === 0) {
            exoplanetList.innerHTML = '<p>No exoplanets found matching your criteria.</p>';
            return;
        }

        exoplanets.forEach(planet => {
            const card = document.createElement('div');
            card.className = 'exoplanet-card';
            card.setAttribute('data-pl-name', planet.pl_name);

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

            // Add click event listener to each card
            card.addEventListener('click', () => showPlanetDetails(planet));
            
            exoplanetList.appendChild(card);
        });
    }

    // New function to populate and show the modal
    function showPlanetDetails(planet) {
        // Populate modal with detailed information
        modalDetails.innerHTML = `
            <h2>${planet.pl_name || 'Unnamed Exoplanet'}</h2>
            <p><strong>Discovery Method:</strong> ${planet.discoverymethod || 'N/A'}</p>
            <p><strong>Discovery Year:</strong> ${planet.disc_year || 'N/A'}</p>
            <p><strong>Host Star Name:</strong> ${planet.hostname || 'N/A'}</p>
            <p><strong>Number of Planets in System:</strong> ${planet.sy_pnum || 'N/A'}</p>
            <p><strong>Orbital Period (days):</strong> ${planet.pl_orbper ? planet.pl_orbper.toFixed(2) : 'N/A'}</p>
            <p><strong>Planet Mass (Earth masses):</strong> ${planet.pl_bmasse ? planet.pl_bmasse.toFixed(2) : 'N/A'}</p>
            <p><strong>Planet Radius (Earth radii):</strong> ${planet.pl_rade ? planet.pl_rade.toFixed(2) : 'N/A'}</p>
            <p><strong>Equilibrium Temperature (K):</strong> ${planet.pl_eqt ? planet.pl_eqt.toFixed(2) : 'N/A'}</p>
            <p><strong>Discovery Site:</strong> ${planet.pl_discsite || 'N/A'}</p>
            <p><strong>Discovery Facility:</strong> ${planet.pl_facility || 'N/A'}</p>
            `;
        
        // Display the modal
        modal.style.display = "block";
    }
});