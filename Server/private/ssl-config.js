const path = require('path');
const fs = require('fs');
    
exports.privateKey = fs.readFileSync(path.join(__dirname, './server.key')).toString();
exports.certificate = fs.readFileSync(path.join(__dirname, './server.crt')).toString();
