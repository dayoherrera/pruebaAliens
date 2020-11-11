function printMatriz(ships) {
    for (var i = 0; i < ships.length; i++) {
      var comi = "";
  
      for (var j = 0; j < ships[i].length; j++) {
        comi += ships[i][j] + " ";
      }
  
      console.log(comi);
    }
}

const fs = require("fs");

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }

 // console.log('in: \n', data.toString());
  getDatos(data.toString());
});

function getDatos(data) {

    const lines = data.split("\r\n");
    var firstShip = lines[1];
    var separe;
    var ships = [];
  
    separe = firstShip.split(" ");
  
    var sizeX = parseInt(separe[0]);
    var scale = parseFloat(separe[2]);
    var cont = 0;
  
    for (var i = 2; i < lines.length; i++) {
        cont++;
    
        if (cont == sizeX + 1) {
            // imprime cabeceras
      
            ships = validateCharacter(ships);
      
              destroyShip(ships);
            
            console.log("\n");
            separe = lines[i].split(" ");
      
            sizeX = parseInt(separe[0]);
            scale = parseFloat(separe[2]);
            cont = 0;
            ships = [];
          } else {
            ships.push(lines[i]);
      
            if (i == lines.length - 1) {
              ships = validateCharacter(ships);
                destroyShip(ships);
            }
          }
    }
  }

function validateCharacter(ships) {
    var matriz = [];
  
    for (var i = 0; i < ships.length; i++) {

      var shipLines = ships[i].split(" ");
      var validControlCenters = [];
  
      for (var j = 0; j < shipLines.length; j++) {
        if (shipLines[j].match(/[a-zA-Z]/gi)) {
          validControlCenters.push(shipLines[j]);
        } else {
          // validControlCenters.push("-");
          validControlCenters.push(' ');
        }
      }
  
      matriz.push(validControlCenters);
    }
  
    return matriz;
}

function destroyShip(ships){
    printMatriz(ships);

    
}