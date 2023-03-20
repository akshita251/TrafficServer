const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();

const fs = require("fs");
const csv = require("csv-parser");

points = [
    [18.99406, 73.11475],
    [19.0007, 73.12988],
    [18.97477, 73.12422],
    [18.96325, 73.14253],
    [18.96617, 73.12603],
    [18.98325, 73.10079],
    [18.9926, 73.09575],
    [18.98592, 73.11976],
    [18.96445, 73.13103],
    [18.96811, 73.13158],
    [18.96074, 73.16549],
    [18.95606, 73.16165],
    [18.95882, 73.15944],
    [19.02687, 73.09386],
    [19.02373, 73.10593],
    [18.98311, 73.08086],
    [19.00048, 73.03367],
    [19.04384, 73.02726],
    [19.03163, 73.10533],
    [19.01862, 73.0283]
]

//middleswares
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Verson:1.0')
})

app.get('/data_points', (req, res) => {
    res.send({ nodeLocations: points })
})

app.post('/optimal_path', (req, res) => {
    data = req.body

    startPointId = data.startPointId
    endpointId = data.endPointId
    modelName = data.modelName

    console.log(data.endPointId)

    // console.log(data)

    const dijkstra = (graph, startNode, endNode) => {
        // Initialize the distance and visited arrays
        const distances = new Array(graph.length).fill(Infinity);
        const visited = new Array(graph.length).fill(false);

        // Set the distance to the start node as 0
        distances[startNode] = 0;

        // Find the shortest path to all nodes
        for (let i = 0; i < graph.length - 1; i++) {
            // Find the node with the smallest distance
            let smallestDistance = Infinity;
            let smallestIndex = -1;
            for (let j = 0; j < graph.length; j++) {
                if (!visited[j] && distances[j] < smallestDistance) {
                    smallestDistance = distances[j];
                    smallestIndex = j;
                }
            }

            // Mark the node as visited
            visited[smallestIndex] = true;

            // Update the distances of the neighboring nodes
            for (let j = 0; j < graph.length; j++) {
                if (graph[smallestIndex][j] !== 0 && !visited[j]) {
                    const distance = graph[smallestIndex][j];
                    const totalDistance = distances[smallestIndex] + distance;
                    if (totalDistance < distances[j]) {
                        distances[j] = totalDistance;
                    }
                }
            }
        }

        // Construct the path array by tracing back from the end node to the start node
        const path = [];
        let currentNode = endNode;
        while (currentNode !== startNode) {
            path.unshift(currentNode);
            for (let i = 0; i < graph.length; i++) {
                if (graph[i][currentNode] !== 0 && distances[i] + graph[i][currentNode] === distances[currentNode]) {
                    currentNode = i;
                    break;
                }
            }
        }
        path.unshift(startNode);

        // Return the distance and path arrays
        return { distance: distances[endNode], path };
    };

    // Define the name of the CSV file
    const filename = "graph.csv";

    // Create an empty array to store the graph data
    let graph = [];

    // Read the CSV file using the csv-parser package
    fs.createReadStream(filename)
        .pipe(csv())
        .on("data", (row) => {
            // Parse the row data and add it to the graph array
            let rowValues = Object.values(row);
            let rowIntValues = rowValues.map((value) => parseInt(value));
            graph.push(rowIntValues);
        })
        .on("end", () => {
            // Log the adjacency matrix representation of the graph
            console.log("Graph:");
            // console.log(graph);

            const { distance, path } = dijkstra(graph, startPointId, data.endPointId);
            console.log(`Shortest distance: ${distance}`);
            console.log(`Shortest path: ${path.join(' -> ')}`);

            console.log(path)

            const stringPath = path.map((integer) => integer.toString());
            estimatedTime = Math.floor(Math.random() * 30)
            endPoint = startPointId.toString();
            startPoint = endpointId.toString();
            output = { stringPath, estimatedTime, endPoint, startPoint }
            res.send(output)
        });

  
});

const PORT = 8081
app.listen(PORT, () => console.log('Secure server on port ' + PORT))