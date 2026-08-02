const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
}); 

//  Socios
// get all socios
app.get('/api/socios', (req, res) => {
    res.json({ status: 'OK' });
});

//get one socio by id
app.get('/api/socios/:id', (req, res) => {
    res.json({ status: 'OK'});
});

// insert socio
app.post('/api/socios', (req, res) => {
    res.json({ status: 'OK' });
});

//delete socio by id
app.delete('/api/socios/:id', (req, res) => {
    res.json({ status: 'OK' });
}); 

//update socio
app.put('/api/socios', (req, res) => {
    res.json({ status: 'OK' });
});      
















app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
    });