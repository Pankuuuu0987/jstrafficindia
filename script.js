document.addEventListener('DOMContentLoaded', function() {
    // Initialize map centered on India
    const map = L.map('map').setView([20.5937, 78.9629], 5);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add city markers
    for (let city in indiaCities) {
        L.marker([indiaCities[city].lat, indiaCities[city].lng])
            .bindPopup(indiaCities[city].name)
            .addTo(map);
    }
    
    // Event listeners
    document.getElementById('calculate').addEventListener('click', calculateRoutes);
    document.getElementById('simulate-traffic').addEventListener('click', simulateTraffic);
    
    // Variables to store route layers
    let routeLayers = [];
    
    function calculateRoutes() {
        const startPoints = Array.from(document.getElementById('start-points').selectedOptions)
            .map(option => option.value);
        const destination = document.getElementById('destination').value;
        const algorithm = document.getElementById('algorithm').value;
        
        if (startPoints.length === 0) {
            alert('Please select at least one starting point');
            return;
        }
        
        // Clear previous routes
        clearRoutes();
        
        const resultsContainer = document.getElementById('route-results');
        resultsContainer.innerHTML = '';
        
        let bestRoute = null;
        let bestDistance = Infinity;
        const allRoutes = [];
        
        // Calculate routes for each starting point
        startPoints.forEach(start => {
            let result;
            if (algorithm === 'dijkstra') {
                result = dijkstra(indiaRoadNetwork, start, destination);
            } else {
                result = astar(indiaRoadNetwork, start, destination, heuristic);
            }
            
            allRoutes.push(result);
            
            // Check if this is the best route so far
            if (result.distance < bestDistance) {
                bestDistance = result.distance;
                bestRoute = result;
            }
            
            // Display route on map
            displayRoute(start, destination, result.path, result.distance, result === bestRoute);
            
            // Display route in results
            displayRouteResult(start, destination, result, result === bestRoute);
        });
        
        // Zoom to fit all routes
        fitMapToRoutes(allRoutes);
    }
    
    function displayRoute(start, destination, path, distance, isBest) {
        if (path.length === 0) return;
        
        const routeCoordinates = path.map(city => [indiaCities[city].lat, indiaCities[city].lng]);
        
        const routePolyline = L.polyline(routeCoordinates, {
            color: isBest ? '#2ecc71' : '#3498db',
            weight: 5,
            opacity: 0.7,
            dashArray: isBest ? '' : '5, 5'
        }).addTo(map);
        
        // Add start and end markers
        const startMarker = L.circleMarker([indiaCities[start].lat, indiaCities[start].lng], {
            radius: 8,
            fillColor: "#3498db",
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
        
        const endMarker = L.circleMarker([indiaCities[destination].lat, indiaCities[destination].lng], {
            radius: 8,
            fillColor: "#e74c3c",
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
        
        // Store layers for later removal
        routeLayers.push(routePolyline);
        routeLayers.push(startMarker);
        routeLayers.push(endMarker);
        
        // Add popup with distance
        const midpointIndex = Math.floor(path.length / 2);
        const midpoint = path[midpointIndex];
        
        L.popup()
            .setLatLng([indiaCities[midpoint].lat, indiaCities[midpoint].lng])
            .setContent(`<b>${indiaCities[start].name} to ${indiaCities[destination].name}</b><br>
                        Distance: ${distance.toFixed(1)} km<br>
                        ${isBest ? '⭐ Best Route' : ''}`)
            .openOn(map);
    }
    
    function displayRouteResult(start, destination, result, isBest) {
        const resultsContainer = document.getElementById('route-results');
        const routeCard = document.createElement('div');
        routeCard.className = `route-card ${isBest ? 'best-route' : ''}`;
        
        routeCard.innerHTML = `
            <h3>${indiaCities[start].name} → ${indiaCities[destination].name}</h3>
            <div class="route-details">
                <div>
                    <p><strong>Route:</strong> ${result.path.map(city => indiaCities[city].name).join(' → ')}</p>
                </div>
                <div class="route-stats">
                    <span class="stat">Distance: ${result.distance.toFixed(1)} km</span>
                    <span class="stat">Traffic: ${(result.traffic * 100).toFixed(0)}%</span>
                    <span class="stat">Time: ${calculateTime(result.distance, result.traffic).toFixed(1)} hrs</span>
                </div>
            </div>
            ${isBest ? '<p class="best-tag">⭐ Best Route</p>' : ''}
        `;
        
        resultsContainer.appendChild(routeCard);
    }
    
    function calculateTime(distance, traffic) {
        // Base speed: 60 km/h, reduced by traffic
        const effectiveSpeed = 60 * (1 - (traffic * 0.7)); // Traffic reduces speed by up to 70%
        return distance / effectiveSpeed;
    }
    
    function fitMapToRoutes(routes) {
        const allPoints = [];
        
        routes.forEach(route => {
            route.path.forEach(city => {
                allPoints.push([indiaCities[city].lat, indiaCities[city].lng]);
            });
        });
        
        if (allPoints.length > 0) {
            map.fitBounds(allPoints, { padding: [50, 50] });
        }
    }
    
    function clearRoutes() {
        routeLayers.forEach(layer => map.removeLayer(layer));
        routeLayers = [];
    }
    
    function simulateTraffic() {
        simulateTrafficChanges(indiaRoadNetwork);
        alert('Traffic conditions have been updated. Click "Calculate Routes" to see changes.');
    }
});