// India city coordinates and connections (with more accurate distances)
const indiaCities = {
    mumbai: { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
    delhi: { name: "Delhi", lat: 28.7041, lng: 77.1025 },
    bangalore: { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
    hyderabad: { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
    chennai: { name: "Chennai", lat: 13.0827, lng: 80.2707 },
    kolkata: { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
    jaipur: { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
    pune: { name: "Pune", lat: 18.5204, lng: 73.8567 },
    ahmedabad: { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
    lucknow: { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
    nagpur: { name: "Nagpur", lat: 21.1458, lng: 79.0882 },
    indore: { name: "Indore", lat: 22.7196, lng: 75.8577 },
    bhopal: { name: "Bhopal", lat: 23.2599, lng: 77.4126 },
    surat: { name: "Surat", lat: 21.1702, lng: 72.8311 },
    vadodara: { name: "Vadodara", lat: 22.3072, lng: 73.1812 }
};

// Updated graph with more accurate distances  and realistic connections
const indiaRoadNetwork = {
    mumbai: [
        { node: "pune", distance: 150, traffic: 0.3 },
        { node: "surat", distance: 280, traffic: 0.4 },
        { node: "nagpur", distance: 830, traffic: 0.2 },
        { node: "delhi",distance: 1398, traffic: 0.2}
    ],
    delhi: [
        { node: "jaipur", distance: 280, traffic: 0.3 },
        { node: "lucknow", distance: 550, traffic: 0.4 },
        { node: "indore", distance: 800, traffic: 0.2 }
    ],
    bangalore: [
        { node: "chennai", distance: 350, traffic: 0.4 },
        { node: "hyderabad", distance: 570, traffic: 0.3 },
        { node: "pune", distance: 840, traffic: 0.3 }
    ],
    hyderabad: [
        { node: "bangalore", distance: 570, traffic: 0.3 },
        { node: "chennai", distance: 630, traffic: 0.4 },
        { node: "nagpur", distance: 500, traffic: 0.2 },
        { node: "bhopal", distance: 700, traffic: 0.3 }
    ],
    chennai: [
        { node: "bangalore", distance: 350, traffic: 0.4 },
        { node: "hyderabad", distance: 630, traffic: 0.4 }
    ],
    kolkata: [
        { node: "lucknow", distance: 1000, traffic: 0.3 }
    ],
    jaipur: [
        { node: "delhi", distance: 280, traffic: 0.3 },
        { node: "indore", distance: 600, traffic: 0.2 }
    ],
    pune: [
        { node: "mumbai", distance: 150, traffic: 0.3 },
        { node: "bangalore", distance: 840, traffic: 0.3 },
        { node: "hyderabad", distance: 560, traffic: 0.3 }
    ],
    ahmedabad: [
        { node: "vadodara", distance: 110, traffic: 0.3 },
        { node: "surat", distance: 260, traffic: 0.4 },
        { node: "indore", distance: 400, traffic: 0.2 }
    ],
    lucknow: [
        { node: "delhi", distance: 550, traffic: 0.4 },
        { node: "kolkata", distance: 1000, traffic: 0.3 },
        { node: "bhopal", distance: 650, traffic: 0.3 }
    ],
    nagpur: [
        { node: "mumbai", distance: 830, traffic: 0.2 },
        { node: "hyderabad", distance: 500, traffic: 0.2 },
        { node: "bhopal", distance: 390, traffic: 0.2 }
    ],
    indore: [
        { node: "delhi", distance: 800, traffic: 0.2 },
        { node: "jaipur", distance: 600, traffic: 0.2 },
        { node: "ahmedabad", distance: 400, traffic: 0.2 },
        { node: "bhopal", distance: 190, traffic: 0.3 }
    ],
    bhopal: [
        { node: "indore", distance: 190, traffic: 0.3 },
        { node: "nagpur", distance: 390, traffic: 0.2 },
        { node: "hyderabad", distance: 700, traffic: 0.3 },
        { node: "lucknow", distance: 650, traffic: 0.3 }
    ],
    surat: [
        { node: "mumbai", distance: 280, traffic: 0.4 },
        { node: "ahmedabad", distance: 260, traffic: 0.4 },
        { node: "vadodara", distance: 150, traffic: 0.3 }
    ],
    vadodara: [
        { node: "ahmedabad", distance: 110, traffic: 0.3 },
        { node: "surat", distance: 150, traffic: 0.3 }
    ]
};

//  heuristic function using Haversine formula
function heuristic(cityA, cityB) {
    const toRad = x => x * Math.PI / 180;
    const R = 6371; // Earth radius in km
    
    const lat1 = indiaCities[cityA].lat;
    const lon1 = indiaCities[cityA].lng;
    const lat2 = indiaCities[cityB].lat;
    const lon2 = indiaCities[cityB].lng;
    
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
}
