const Database = require('./Database.js');

const database = new Database('https://www.json-generator.com/api/json/get/bUsRkvEmHm?indent=2');
document.getElementById('request-btn').addEventListener('click', database.loadFile);

