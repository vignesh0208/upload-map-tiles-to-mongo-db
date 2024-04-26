const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'seekers';

let db;

async function connect() {
  const client = new MongoClient(url, { useUnifiedTopology: true });

  try {
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

function getDb() {
  return db;
}

module.exports = {
  connect,
  getDb,
};
