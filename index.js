const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();

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
    res.send({nodeLocations: points})
})

app.post('/optimal_path', (req, res) => {
    data = req.body

    startPointId = data.startPointId
    endpointId = data.endPointId
    modelName = data.modelName

    console.log(data)

    estimatedTime = Math.floor(Math.random() * 30)
    endPoint = startPointId.toString();
    startPoint = endpointId.toString();
    path = [startPoint, Math.floor(Math.random() * 20).toString(), Math.floor(Math.random() * 20).toString(), Math.floor(Math.random() * 20).toString(), endPoint]
    output = {path, estimatedTime, endPoint, startPoint}
    res.send(output)
});

const PORT = 8081
app.listen(PORT, () => console.log('Secure server on port ' + PORT))