const fs = require('fs');
const path = require('path');
const { getDb, connect } = require('./db');

const baseDir = './tiles'; // Base directory containing the zoom level directories

async function populate() {
  await connect();
  const db = getDb();
  const collection = db.collection('mapTiles');

  const zoomDirs = fs.readdirSync(baseDir, { withFileTypes: true });

  for (const zoomDir of zoomDirs) {
    if (zoomDir.isDirectory()) {
      const zoomPath = path.join(baseDir, zoomDir.name);

      const xDirs = fs.readdirSync(zoomPath, { withFileTypes: true });

      for (const xDir of xDirs) {
        if (xDir.isDirectory()) {
          const xPath = path.join(zoomPath, xDir.name);

          const yFiles = fs.readdirSync(xPath);

          for (const yFile of yFiles) {
            const [y] = yFile.split('.').slice(0, -1);

            const data = fs.readFileSync(path.join(xPath, yFile));

            await collection.updateOne(
              { zoom: zoomDir.name, x: xDir.name, y: y },
              { $set: { zoom: zoomDir.name, x: xDir.name, y: y, tile: data } },
              { upsert: true },
            );
            console.log(
              `Update node: zoom: ${zoomDir.name}, x: ${xDir.name}, y: ${y}`,
            );
          }
        }
      }
    }
  }

  console.log('Population completed');
}

// populate().catch(console.error);

module.exports = populate;
