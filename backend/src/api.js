// Zona de importaciones
const express = require('express');
const cors = require('cors');
const app = express();

// Importo las funciones de validación
const { esDniValido, esTelefonoValido, esMailValido } = require('./utils/validaciones');

// Zona de configuración
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Zona de Rutas

const { 
    getAllSocios,
    getOneSocio,
    createSocio,
    deleteSocio,
    updateSocio,
} = require('./scripts/socios.js');

const { 
    getAllProfesores,
    getOneProfesor,
    createProfesor,
    updateProfesor,
    deleteProfesor,
} = require('./scripts/profesores.js');   

const { 
    getAllEjercicios,
    getOneEjercicio,
    createEjercicio,
    updateEjercicio,
    deleteEjercicio,
} = require('./scripts/ejercicios.js');
    
const { 
    getAllClases,
    getOneClase,
    createClase,
    updateClase,
    deleteClase,
} = require('./scripts/clases.js');

const {
    getAllRutinas,
    getOneRutina,
    createRutina,
    updateRutina,
    deleteRutina,
} = require('./scripts/rutinas.js');
 
const {
    getAllDetalleRutina,
    getDetallesByRutina,
    createDetalleRutina,
    updateDetalleRutina,
    deleteDetalleRutina,
} = require('./scripts/detalleRutina.js');
 
const {
    getAllReportes,
    getOneReporte,
    createReporte,
    updateReporte,
    deleteReporte,
} = require('./scripts/reporte.js');
 
const {
    getAllDetalleReporte,
    getDetallesByReporte,
    createDetalleReporte,
    updateDetalleReporte,
    deleteDetalleReporte,
} = require('./scripts/detalleReporte.js');
 
const {
    getAllSocioClase,
    getOneSocioClase,
    createSocioClase,
    updateSocioClase,
    deleteSocioClase,
} = require('./scripts/socioClase.js');

// Health route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
}); 

//  Socios

// get all socios
app.get('/api/socios', async (req, res) => {
    try {
        const socios = await getAllSocios(); 
        res.json(socios); 
    } catch (err) {
        res.status(500).send(err.message);
    }
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
        return res.status(400).json({ error: 'El DNI debe tener 7 u 8 dígitos' });
    }
    try {
        const profesor = await createProfesor(req.body.nombre, req.body.apellido, req.body.dni, req.body.mail, req.body.telefono);        
        if (profesor.error === 'duplicate_dni') {
            return res.status(409).json({ error: 'Ya existe un profesor con ese DNI' });
        }
        res.status(201).json(profesor);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create profesor' });
    }
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

// Rutinas

app.get('/api/rutinas', async (req, res) => {
  const rutinas = await getAllRutinas();
  res.json(rutinas);
});
 
app.get('/api/rutinas/:id', async (req, res) => {
  const rutina = await getOneRutina(req.params.id);
  if (!rutina) {
    return res.status(404).json({ error: 'Rutina id: ' + req.params.id + ' not found' });
  }
  res.json(rutina);
});
 
// detalle de una rutina puntual (dias, ejercicios, series, etc.)
app.get('/api/rutinas/:id/detalles', async (req, res) => {
  const detalles = await getDetallesByRutina(req.params.id);
  res.json(detalles);
});
 
app.post('/api/rutinas', async (req, res) => {
  if (!req.body.id_socio || !req.body.id_profesor || !req.body.nombre) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
 
  const rutina = await createRutina(
    req.body.id_socio,
    req.body.id_profesor,
    req.body.nombre,
    req.body.fecha_inicio,
    req.body.fecha_fin,
    req.body.fecha_modificacion,
    req.body.estado
  );
 
  if (rutina && rutina.error === 'foreign_key') {
    return res.status(400).json({ error: 'El id_socio o id_profesor indicado no existe' });
  }
  if (!rutina) {
    return res.status(500).json({ error: 'Failed to create rutina' });
  }
  res.status(201).json(rutina);
});
 
app.put('/api/rutinas/:id', async (req, res) => {
  if (!req.body.id_socio || !req.body.id_profesor || !req.body.nombre) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
 
  const rutina = await updateRutina(
    req.params.id,
    req.body.id_socio,
    req.body.id_profesor,
    req.body.nombre,
    req.body.fecha_inicio,
    req.body.fecha_fin,
    req.body.fecha_modificacion,
    req.body.estado
  );
 
  if (rutina && rutina.error === 'foreign_key') {
    return res.status(400).json({ error: 'El id_socio o id_profesor indicado no existe' });
  }
  if (!rutina) {
    return res.status(404).json({ error: 'Rutina id: ' + req.params.id + ' not found' });
  }
  res.json(rutina);
});
 
app.delete('/api/rutinas/:id', async (req, res) => {
  const resultado = await deleteRutina(req.params.id);
 
  if (resultado.error === 'not_found') {
    return res.status(404).json({ error: 'Rutina id: ' + req.params.id + ' not found' });
  }
  if (resultado.error === 'foreign_key') {
    return res.status(409).json({ error: 'No se puede eliminar: la rutina tiene detalles o reportes asociados' });
  }
 
  res.json({ status: 'OK', id: resultado.id_rutina });
});

// Detalle Rutina
// (CRUD directo por id_detalle, ademas del GET anidado de arriba)

app.get('/api/detalle-rutina', async (req, res) => {
  const detalles = await getAllDetalleRutina();
  res.json(detalles);
});
 
app.post('/api/detalle-rutina', async (req, res) => {
  if (!req.body.id_rutina || !req.body.id_ejercicio || req.body.dia == null || req.body.orden == null || !req.body.series || !req.body.repeticiones_desde || !req.body.repeticiones_hasta) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
 
  const detalle = await createDetalleRutina(
    req.body.id_rutina,
    req.body.id_ejercicio,
    req.body.dia,
    req.body.orden,
    req.body.series,
    req.body.repeticiones_desde,
    req.body.repeticiones_hasta,
    req.body.descanso
  );
 
  if (detalle && detalle.error === 'foreign_key') {
    return res.status(400).json({ error: 'El id_rutina o id_ejercicio indicado no existe' });
  }
  if (!detalle) {
    return res.status(500).json({ error: 'Failed to create detalle de rutina' });
  }
  res.status(201).json(detalle);
});
 
app.put('/api/detalle-rutina/:id', async (req, res) => {
  if (!req.body.id_rutina || !req.body.id_ejercicio || req.body.dia == null || req.body.orden == null || !req.body.series || !req.body.repeticiones_desde || !req.body.repeticiones_hasta) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
 
  const detalle = await updateDetalleRutina(
    req.params.id,
    req.body.id_rutina,
    req.body.id_ejercicio,
    req.body.dia,
    req.body.orden,
    req.body.series,
    req.body.repeticiones_desde,
    req.body.repeticiones_hasta,
    req.body.descanso
  );
 
  if (detalle && detalle.error === 'foreign_key') {
    return res.status(400).json({ error: 'El id_rutina o id_ejercicio indicado no existe' });
  }
  if (!detalle) {
    return res.status(404).json({ error: 'Detalle id: ' + req.params.id + ' not found' });
  }
  res.json(detalle);
});
 
app.delete('/api/detalle-rutina/:id', async (req, res) => {
  const resultado = await deleteDetalleRutina(req.params.id);
 
  if (resultado.error === 'not_found') {
    return res.status(404).json({ error: 'Detalle id: ' + req.params.id + ' not found' });
  }
  if (resultado.error === 'foreign_key') {
    return res.status(409).json({ error: 'No se puede eliminar este detalle' });
  }
 
  res.json({ status: 'OK', id: resultado.id_detalle });
});

// Reportes

app.get('/api/reportes', async (req, res) => {
  const reportes = await getAllReportes();
  res.json(reportes);
});
 
app.get('/api/reportes/:id', async (req, res) => {
  const reporte = await getOneReporte(req.params.id);
  if (!reporte) {
    return res.status(404).json({ error: 'Reporte id: ' + req.params.id + ' not found' });
  }
  res.json(reporte);
});
 
// detalle de un reporte puntual (ejercicios realizados, series, peso, etc.)
app.get('/api/reportes/:id/detalles', async (req, res) => {
  const detalles = await getDetallesByReporte(req.params.id);
  res.json(detalles);
});
 
app.post('/api/reportes', async (req, res) => {
  if (!req.body.id_rutina || !req.body.id_socio || req.body.dia == null || !req.body.fecha_asistencia) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
 
  const reporte = await createReporte(
    req.body.id_rutina,
    req.body.id_socio,
    req.body.dia,
    req.body.fecha_asistencia
  );
 
  if (reporte && reporte.error === 'foreign_key') {
    return res.status(400).json({ error: 'El id_rutina o id_socio indicado no existe' });
  }
  if (!reporte) {
    return res.status(500).json({ error: 'Failed to create reporte' });
  }
  res.status(201).json(reporte);
});
 
app.put('/api/reportes/:id', async (req, res) => {
  if (!req.body.id_rutina || !req.body.id_socio || req.body.dia == null || !req.body.fecha_asistencia) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
 
  const reporte = await updateReporte(
    req.params.id,
    req.body.id_rutina,
    req.body.id_socio,
    req.body.dia,
    req.body.fecha_asistencia
  );
 
  if (reporte && reporte.error === 'foreign_key') {
    return res.status(400).json({ error: 'El id_rutina o id_socio indicado no existe' });
  }
  if (!reporte) {
    return res.status(404).json({ error: 'Reporte id: ' + req.params.id + ' not found' });
  }
  res.json(reporte);
});
 
app.delete('/api/reportes/:id', async (req, res) => {
  const resultado = await deleteReporte(req.params.id);
 
  if (resultado.error === 'not_found') {
    return res.status(404).json({ error: 'Reporte id: ' + req.params.id + ' not found' });
  }
  if (resultado.error === 'foreign_key') {
    return res.status(409).json({ error: 'No se puede eliminar: el reporte tiene detalles asociados' });
  }
 
  res.json({ status: 'OK', id: resultado.id_reporte });
});

// Detalle de reporte

app.get('/api/detalle-reporte', async (req, res) => {
  const detalles = await getAllDetalleReporte();
  res.json(detalles);
});
 
app.post('/api/detalle-reporte', async (req, res) => {
  if (!req.body.id_reporte || !req.body.id_ejercicio) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
 
  const detalle = await createDetalleReporte(
    req.body.id_reporte,
    req.body.id_ejercicio,
    req.body.series_realizadas,
    req.body.repeticiones_realizadas,
    req.body.peso_utilizado,
    req.body.observaciones
  );
 
  if (detalle && detalle.error === 'foreign_key') {
    return res.status(400).json({ error: 'El id_reporte o id_ejercicio indicado no existe' });
  }
  if (!detalle) {
    return res.status(500).json({ error: 'Failed to create detalle de reporte' });
  }
  res.status(201).json(detalle);
});
 
app.put('/api/detalle-reporte/:id', async (req, res) => {
  if (!req.body.id_reporte || !req.body.id_ejercicio) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
 
  const detalle = await updateDetalleReporte(
    req.params.id,
    req.body.id_reporte,
    req.body.id_ejercicio,
    req.body.series_realizadas,
    req.body.repeticiones_realizadas,
    req.body.peso_utilizado,
    req.body.observaciones
  );
 
  if (detalle && detalle.error === 'foreign_key') {
    return res.status(400).json({ error: 'El id_reporte o id_ejercicio indicado no existe' });
  }
  if (!detalle) {
    return res.status(404).json({ error: 'Detalle id: ' + req.params.id + ' not found' });
  }
  res.json(detalle);
});
 
app.delete('/api/detalle-reporte/:id', async (req, res) => {
  const resultado = await deleteDetalleReporte(req.params.id);
 
  if (resultado.error === 'not_found') {
    return res.status(404).json({ error: 'Detalle id: ' + req.params.id + ' not found' });
  }
  if (resultado.error === 'foreign_key') {
    return res.status(409).json({ error: 'No se puede eliminar este detalle' });
  }
 
  res.json({ status: 'OK', id: resultado.id_detalle });
});

// Socio-Clase (Inscripción de socios a clases)

app.get('/api/socio-clase', async (req, res) => {
  const inscripciones = await getAllSocioClase();
  res.json(inscripciones);
});
 
app.get('/api/socio-clase/:id', async (req, res) => {
  const inscripcion = await getOneSocioClase(req.params.id);
  if (!inscripcion) {
    return res.status(404).json({ error: 'Inscripcion id: ' + req.params.id + ' not found' });
  }
  res.json(inscripcion);
});
 
app.post('/api/socio-clase', async (req, res) => {
  if (!req.body.id_socio || !req.body.id_clase) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
 
  const inscripcion = await createSocioClase(
    req.body.id_socio,
    req.body.id_clase,
    req.body.fecha_inscripcion,
    req.body.fecha_baja,
    req.body.estado
  );
 
  if (inscripcion && inscripcion.error === 'foreign_key') {
    return res.status(400).json({ error: 'El id_socio o id_clase indicado no existe' });
  }
  if (!inscripcion) {
    return res.status(500).json({ error: 'Failed to create inscripcion' });
  }
  res.status(201).json(inscripcion);
});
 
app.put('/api/socio-clase/:id', async (req, res) => {
  if (!req.body.id_socio || !req.body.id_clase) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
 
  const inscripcion = await updateSocioClase(
    req.params.id,
    req.body.id_socio,
    req.body.id_clase,
    req.body.fecha_inscripcion,
    req.body.fecha_baja,
    req.body.estado
  );
 
  if (inscripcion && inscripcion.error === 'foreign_key') {
    return res.status(400).json({ error: 'El id_socio o id_clase indicado no existe' });
  }
  if (!inscripcion) {
    return res.status(404).json({ error: 'Inscripcion id: ' + req.params.id + ' not found' });
  }
  res.json(inscripcion);
});
 
app.delete('/api/socio-clase/:id', async (req, res) => {
  const resultado = await deleteSocioClase(req.params.id);
 
  if (resultado.error === 'not_found') {
    return res.status(404).json({ error: 'Inscripcion id: ' + req.params.id + ' not found' });
  }
  if (resultado.error === 'foreign_key') {
    return res.status(409).json({ error: 'No se puede eliminar esta inscripcion' });
  }
 
  res.json({ status: 'OK', id: resultado.id_usuario_clase });
});

