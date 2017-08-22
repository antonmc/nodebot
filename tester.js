var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('conversation/medicine.json', 'utf8'));

var fs = require('fs');
var obj;
fs.readFile('conversation/medicine.json', 'utf8', function(err, data) {
  if (err)
    throw err;
  var medicines = JSON.parse(data);

  medicines.forEach(function(medicine) {
    console.log(medicine.label)

  })

});
