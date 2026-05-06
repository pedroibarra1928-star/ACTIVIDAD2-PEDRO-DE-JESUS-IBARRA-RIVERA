const express = require('express');
const pool = require('./db');
const app = express();

// 1. CONFIGURACIÓN: Middleware para leer JSON (SIEMPRE debe ir arriba de las rutas)
app.use(express.json());

// --- RUTA INICIAL ---
app.get('/', (req, res) => {
  res.send('API funcionando');
});

// --- RUTA GET: Mostrar todos los alumnos ---
app.get('/alumnos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM alumno ORDER BY id ASC');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al consultar:', error.message);
    res.status(500).json({ error: 'Error al obtener los alumnos' });
  }
});

// --- RUTA POST: Insertar nuevo alumno ---
app.post('/alumnos', async (req, res) => {
  try {
    const { nombre, apellido, edad, correo } = req.body;

    // Validación: Comprobar que no falten datos obligatorios
    if (!nombre || !apellido || !edad || !correo) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Consulta SQL para insertar
    const consulta = 'INSERT INTO alumno (nombre, apellido, edad, correo) VALUES ($1, $2, $3, $4) RETURNING *';
    const valores = [nombre, apellido, edad, correo];

    const resultado = await pool.query(consulta, valores);

    // Respuesta exitosa
    res.status(201).json({
      mensaje: 'Alumno insertado correctamente',
      alumno: resultado.rows[0]
    });

  } catch (error) {
    console.error('Error al insertar:', error.message);

    // Manejo específico para correos duplicados (Restricción UNIQUE)
    if (error.code === '23505') {
        return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    res.status(500).json({ error: 'Error al insertar el alumno' });
  }
});

// --- ENCENDIDO DEL SERVIDOR ---
app.listen(3000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});