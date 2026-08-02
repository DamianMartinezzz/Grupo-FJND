const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const { 
    getAllSocios,
    getOneSocio,
    createSocio,
    deleteSocio,
    updateSocio,
} = require('./scripts/gimnasio.js');

function esTelefonoValido(telefono) {
  return /^\d{10}$/.test(telefono); // exactamente 10 dígitos numéricos
}

function esMailValido(mail) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
}

function esDniValido(dni) {
  return /^\d{7,8}$/.test(dni); // solo números (7 u 8 dígitos)
}

// Health route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
}); 

//  Socios
// get all socios
app.get('/api/socios', async (req, res) => {
    const socios = await getAllSocios();
    res.json(socios);
});

//get one socio by id
app.get('/api/socios/:id', async (req, res) => {
    const socio = await getOneSocio(req.params.id);
    if (!socio) {
        return res.status(404).json({ error: 'Socio not found' });
    }
    res.json(socio);
});

// insert socio
/* 
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"nombre":"Juan","apellido":"Perez","dni":"12345678","mail":"juan@example.com","telefono":"123456789"}' \
  http://localhost:3000/api/socios
*/
app.post('/api/socios', async (req, res) => {
  
    if(!req.body.nombre || !req.body.apellido || !req.body.dni || !req.body.mail || !req.body.telefono) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (!esTelefonoValido(req.body.telefono)) {
        return res.status(400).json({ error: 'El teléfono debe tener exactamente 10 dígitos numéricos' });
    }
    
    if (!esMailValido(req.body.mail)) {
    return res.status(400).json({ error: 'El mail no tiene un formato válido' });
    }

    if (!esDniValido(req.body.dni)) {
    return res.status(400).json({ error: 'El dni no tiene un formato válido' });
    }

    const socio = await createSocio(req.body.nombre, req.body.apellido, req.body.dni, req.body.mail, req.body.telefono);
    
    if (socio && socio.error === 'duplicate_dni') {
    return res.status(409).json({ error: 'Ya existe un socio con ese DNI' });
    }

    if(!socio) {
        return res.status(500).json({ error: 'Failed to create socio' });
    }
    res.json(socio);
});

//delete socio by id
/* 
curl --request DELETE http://localhost:3000/api/socios/id 
*/

app.delete('/api/socios/:id', async (req, res) => {
    const socio = await deleteSocio(req.params.id);

    if (socio.error === 'not_found') {
        return res.status(404).json({ error: 'Socio id: ' + req.params.id + ' not found' });
    }

    if (socio.error === 'foreign_key') {
        return res.status(409).json({ error: 'No se puede eliminar: el socio tiene rutinas, reportes o inscripciones a clases asociadas' });
    }

    res.json({ status: 'OK', id: socio.id_socio });
});

//update socio
app.put('/api/socios/:id', async (req, res) => {
  if (!req.body.nombre || !req.body.apellido || !req.body.dni || !req.body.mail || !req.body.telefono) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

    if (!esTelefonoValido(req.body.telefono)) {
    return res.status(400).json({ error: 'El teléfono debe tener exactamente 10 dígitos numéricos' });
  }

    if (!esMailValido(req.body.mail)) {
    return res.status(400).json({ error: 'El mail no tiene un formato válido' });
  }

    if (!esMailValido(req.body.mail)) {
    return res.status(400).json({ error: 'El mail no tiene un formato válido' });
  }

  const socio = await updateSocio(req.params.id, req.body.nombre, req.body.apellido, req.body.dni, req.body.mail, req.body.telefono);

  if (!socio) {
    return res.status(404).json({ error: 'Socio id: ' + req.params.id + ' not found' });
  }

  res.json(socio);
});

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
    });

