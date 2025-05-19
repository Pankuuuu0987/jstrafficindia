// Dijkstra Algorithm implementation
function dijkstra(graph, start, end) {
    const distances = {};
    const previous = {};
    const nodes = new Set();
    const path = [];
    let smallest;
    
    // Initialize distances
    for (let node in graph) {
        if (node === start) {
            distances[node] = 0;
        } else {
            distances[node] = Infinity;
        }
        nodes.add(node);
        previous[node] = null;
    }
    
    while (nodes.size) {
        // Find node with smallest distance
        smallest = null;
        for (let node of nodes) {
            if (smallest === null || distances[node] < distances[smallest]) {
                smallest = node;
            }
        }
        
        // If we've reached the end or there's no path
        if (smallest === end || distances[smallest] === Infinity) {
            break;
        }
        
        nodes.delete(smallest);
        
        // Update distances to neighbors
        for (let neighbor of graph[smallest]) {
            const alt = distances[smallest] + neighbor.distance * (1 + neighbor.traffic);
            if (alt < distances[neighbor.node]) {
                distances[neighbor.node] = alt;
                previous[neighbor.node] = smallest;
            }
        }
    }
    
    // Build path
    if (previous[end] || end === start) {
        let current = end;
        while (current) {
            path.unshift(current);
            current = previous[current];
        }
    }
    
    return {
        path: path,
        distance: distances[end],
        traffic: calculateTraffic(path, graph)
    };
}

// A* Algorithm implementation
function astar(graph, start, end, heuristic) {
    const openSet = new Set([start]);
    const cameFrom = {};
    const gScore = {};
    const fScore = {};
    
    // Initialize scores
    for (let node in graph) {
        gScore[node] = Infinity;
        fScore[node] = Infinity;
    }
    gScore[start] = 0;
    fScore[start] = heuristic(start, end);
    
    while (openSet.size > 0) {
        // Find node with lowest fScore
        let current = null;
        let lowestFScore = Infinity;
        for (let node of openSet) {
            if (fScore[node] < lowestFScore) {
                lowestFScore = fScore[node];
                current = node;
            }
        }
        
        // If we've reached the end
        if (current === end) {
            const path = reconstructPath(cameFrom, current);
            return {
                path: path,
                distance: gScore[end],
                traffic: calculateTraffic(path, graph)
            };
        }
        
        openSet.delete(current);
        
        // Check all neighbors
        for (let neighbor of graph[current]) {
            const tentativeGScore = gScore[current] + neighbor.distance * (1 + neighbor.traffic);
            
            if (tentativeGScore < gScore[neighbor.node]) {
                cameFrom[neighbor.node] = current;
                gScore[neighbor.node] = tentativeGScore;
                fScore[neighbor.node] = gScore[neighbor.node] + heuristic(neighbor.node, end);
                if (!openSet.has(neighbor.node)) {
                    openSet.add(neighbor.node);
                }
            }
        }
    }
    
    // If we get here, no path was found
    return {
        path: [],
        distance: Infinity,
        traffic: 0
    };
}

function reconstructPath(cameFrom, current) {
    const path = [current];
    while (cameFrom[current] !== undefined) {
        current = cameFrom[current];
        path.unshift(current);
    }
    return path;
}

function calculateTraffic(path, graph) {
    let totalTraffic = 0;
    let segments = 0;
    
    for (let i = 0; i < path.length - 1; i++) {
        const current = path[i];
        const next = path[i + 1];
        
        const connection = graph[current].find(conn => conn.node === next);
        if (connection) {
            totalTraffic += connection.traffic;
            segments++;
        }
    }
    
    return segments > 0 ? totalTraffic / segments : 0;
}

// Function to simulate traffic changes
function simulateTrafficChanges(graph) {
    for (let city in graph) {
        for (let connection of graph[city]) {
            // Random traffic fluctuation (between -0.2 and +0.3)
            const change = (Math.random() * 0.5) - 0.2;
            connection.traffic = Math.max(0, Math.min(1, connection.traffic + change));
        }
    }
    return graph;
}
