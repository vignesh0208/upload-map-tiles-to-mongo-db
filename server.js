const express = require('express');
const cors = require('cors');
const { getDb, connect } = require('./db');
const populate = require('./populate');

const app = express();
const port = 3000;

app.use(
  cors({
    origin: 'http://localhost:3001', // Replace with your frontend URL
    methods: ['GET', 'POST'],
  }),
);

app.get('/:z/:x/:y.png', async (req, res) => {
  const { z, x, y } = req.params;

  const db = getDb();
  const collection = db.collection('mapTiles');

  try {
    const tile = await collection.findOne({ zoom: z, x: x, y: y });

    if (!tile) {
      res.status(404).send('Tile not found');
      return;
    }

    res.header('Content-Type', 'image/png');
    res.send(tile.tile.buffer);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
  await connect();

  await populate();
});
