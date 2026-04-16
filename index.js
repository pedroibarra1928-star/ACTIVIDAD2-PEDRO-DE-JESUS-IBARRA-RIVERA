const express = require('express');
const pool = require('./db'); // Importamos la conexión
const app = express();

app.get('/', (req, res) => {
  res.send('API funcionando y lista para conectar');
});

pool.connect()
  .then(() => {
    console.log('✅ Conexión exitosa a PostgreSQL');
  })
  .catch((err) => {
    console.error('❌ Error de conexión', err);
  });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});