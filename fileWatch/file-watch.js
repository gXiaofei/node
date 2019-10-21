const fs = require('fs');

fs.watch('target.txt', (type, filename) => {
  console.log(type, filename);
});

console.log('file changeing');