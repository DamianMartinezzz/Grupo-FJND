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
    getAllProfesores,
    getOneProfesor,
    createProfesor,
    updateProfesor,
    deleteProfesor,
    getAllEjercicios,
    getOneEjercicio,
    createEjercicio,
    updateEjercicio,
    deleteEjercicio,
    getAllClases,
    getOneClase,
    createClase,
    updateClase,
    deleteClase,
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

// Profesores

// get all profesores
app.get('/api/profesores', async (req, res) => {
  const profesores = await getAllProfesores();
  res.json(profesores);
});

// get one profesor by id
app.get('/api/profesores/:id', async (req, res) => {
  const profesor = await getOneProfesor(req.params.id);
  if (!profesor) {
    return res.status(404).json({ error: 'Profesor id: ' + req.params.id + ' not found' });
  }
  res.json(profesor);
});

// insert profesor
app.post('/api/profesores', async (req, res) => {
  if (!req.body.nombre || !req.body.apellido || !req.body.dni) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!esDniValido(req.body.dni)) {
    return res.status(400).json({ error: 'El DNI debe tener 7 u 8 dígitos numéricos' });
  }

  if (req.body.telefono && !esTelefonoValido(req.body.telefono)) {
    return res.status(400).json({ error: 'El teléfono debe tener exactamente 10 dígitos numéricos' });
  }

  if (req.body.mail && !esMailValido(req.body.mail)) {
    return res.status(400).json({ error: 'El mail no tiene un formato válido' });
  }

  const profesor = await createProfesor(req.body.nombre, req.body.apellido, req.body.dni, req.body.mail, req.body.telefono);

  if (profesor && profesor.error === 'duplicate_dni') {
    return res.status(409).json({ error: 'Ya existe un profesor con ese DNI' });
  }
  if (!profesor) {
    return res.status(500).json({ error: 'Failed to create profesor' });
  }
  res.status(201).json(profesor);
});

// update profesor
app.put('/api/profesores/:id', async (req, res) => {
  if (!req.body.nombre || !req.body.apellido || !req.body.dni) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!esDniValido(req.body.dni)) {
    return res.status(400).json({ error: 'El DNI debe tener 7 u 8 dígitos numéricos' });
  }

  if (req.body.telefono && !esTelefonoValido(req.body.telefono)) {
    return res.status(400).json({ error: 'El teléfono debe tener exactamente 10 dígitos numéricos' });
  }

  if (req.body.mail && !esMailValido(req.body.mail)) {
    return res.status(400).json({ error: 'El mail no tiene un formato válido' });
  }

  const profesor = await updateProfesor(req.params.id, req.body.nombre, req.body.apellido, req.body.dni, req.body.mail, req.body.telefono);

  if (profesor.error === 'duplicate_dni') {
    return res.status(409).json({ error: 'Ya existe un profesor con ese DNI' });
  }
  if (profesor.error === 'not_found') {
    return res.status(404).json({ error: 'Profesor id: ' + req.params.id + ' not found' });
  }
  res.json(profesor);
});

// delete profesor
app.delete('/api/profesores/:id', async (req, res) => {
  const resultado = await deleteProfesor(req.params.id);

  if (resultado.error === 'not_found') {
    return res.status(404).json({ error: 'Profesor id: ' + req.params.id + ' not found' });
  }
  if (resultado.error === 'foreign_key') {
    return res.status(409).json({ error: 'No se puede eliminar: el profesor tiene rutinas o clases asociadas' });
  }

  res.json({ status: 'OK', id: resultado.idprofesor });
});

// Ejercicios

app.get('/api/ejercicios', async (req, res) => {
  const ejercicios = await getAllEjercicios();
  res.json(ejercicios);
});

app.get('/api/ejercicios/:id', async (req, res) => {
  const ejercicio = await getOneEjercicio(req.params.id);
  if (!ejercicio) {
    return res.status(404).json({ error: 'Ejercicio id: ' + req.params.id + ' not found' });
  }
  res.json(ejercicio);
});

app.post('/api/ejercicios', async (req, res) => {
  if (!req.body.nombre) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const ejercicio = await createEjercicio(req.body.nombre, req.body.grupo_muscular, req.body.descripcion);

  if (!ejercicio) {
    return res.status(500).json({ error: 'Failed to create ejercicio' });
  }
  res.status(201).json(ejercicio);
});

app.put('/api/ejercicios/:id', async (req, res) => {
  if (!req.body.nombre) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const ejercicio = await updateEjercicio(req.params.id, req.body.nombre, req.body.grupo_muscular, req.body.descripcion);

  if (ejercicio.error === 'not_found') {
    return res.status(404).json({ error: 'Ejercicio id: ' + req.params.id + ' not found' });
  }
  res.json(ejercicio);
});

app.delete('/api/ejercicios/:id', async (req, res) => {
  const resultado = await deleteEjercicio(req.params.id);

  if (resultado.error === 'not_found') {
    return res.status(404).json({ error: 'Ejercicio id: ' + req.params.id + ' not found' });
  }
  if (resultado.error === 'foreign_key') {
    return res.status(409).json({ error: 'No se puede eliminar: el ejercicio está usado en rutinas o reportes' });
  }

  res.json({ status: 'OK', id: resultado.id_ejercicio });
});

// Clases

app.get('/api/clases', async (req, res) => {
  const clases = await getAllClases();
  res.json(clases);
});

app.get('/api/clases/:id', async (req, res) => {
  const clase = await getOneClase(req.params.id);
  if (!clase) {
    return res.status(404).json({ error: 'Clase id: ' + req.params.id + ' not found' });
  }
  res.json(clase);
});

app.post('/api/clases', async (req, res) => {
  if (!req.body.id_profesor || !req.body.nombre) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const clase = await createClase(
    req.body.id_profesor,
    req.body.nombre,
    req.body.descripcion,
    req.body.dia_semana,
    req.body.hora_inicio,
    req.body.hora_fin,
    req.body.cupo_maximo,
    req.body.estado
  );

  if (clase && clase.error === 'invalid_profesor') {
    return res.status(400).json({ error: 'El id_profesor indicado no existe' });
  }
  if (!clase) {
    return res.status(500).json({ error: 'Failed to create clase' });
  }
  res.status(201).json(clase);
});

app.put('/api/clases/:id', async (req, res) => {
  if (!req.body.id_profesor || !req.body.nombre) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const clase = await updateClase(
    req.params.id,
    req.body.id_profesor,
    req.body.nombre,
    req.body.descripcion,
    req.body.dia_semana,
    req.body.hora_inicio,
    req.body.hora_fin,
    req.body.cupo_maximo,
    req.body.estado
  );

  if (clase.error === 'invalid_profesor') {
    return res.status(400).json({ error: 'El id_profesor indicado no existe' });
  }
  if (clase.error === 'not_found') {
    return res.status(404).json({ error: 'Clase id: ' + req.params.id + ' not found' });
  }
  res.json(clase);
});

app.delete('/api/clases/:id', async (req, res) => {
  const resultado = await deleteClase(req.params.id);

  if (resultado.error === 'not_found') {
    return res.status(404).json({ error: 'Clase id: ' + req.params.id + ' not found' });
  }
  if (resultado.error === 'foreign_key') {
    return res.status(409).json({ error: 'No se puede eliminar: la clase tiene socios inscriptos' });
  }

  res.json({ status: 'OK', id: resultado.id_clase });
});



app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
    });

