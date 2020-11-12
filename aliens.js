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

var output = [];

function getDatos(data) {

  const lines = data.split('\n');
  var firstShip = lines[1];
  var separe;
  var ships = [];

  separe = firstShip.split(' ');

  var sizeX = parseInt(separe[0]);
  var scale = parseFloat(separe[2]);
  var cont = 0;

  for (var i = 2; i < lines.length; i++) {
    cont++;

    if (cont == sizeX + 1) {

      ships = validateCharacter(ships);

      while(!showFinal(ships)){

        destroyShip(ships, scale);
      }
      console.log(output.join(' '));
      output = [];
      
      console.log('\n');
      separe = lines[i].split(' ');

      sizeX = parseInt(separe[0]);
      scale = parseFloat(separe[2]);
      cont = 0;
      ships = [];
    } else {
      
      ships.push(lines[i]);

      if (i == lines.length - 1) {
        ships = validateCharacter(ships);

        while(!showFinal(ships)){
          destroyShip(ships, scale);
        }
        console.log(output.join(' '));
        output = [];
      }
    }
  }
}

function validateCharacter(ships) {
  var matriz = [];

  for (var i = 0; i < ships.length; i++) {
    var shipLines = ships[i].split(' ');
    var validControlCenters = [];

    for (var j = 0; j < shipLines.length; j++) {
      if (shipLines[j].match(/[a-zA-Z]/gi)) {
        validControlCenters.push(shipLines[j]);
      } else {
        
        validControlCenters.push(' ');
      }
    }

    matriz.push(validControlCenters);
  }

  return matriz;
}

function destroyShip(ships, scale) {

  var centerControl = []; //buscando los centro de control y guardarlos en vector

  for (var i = 0; i < ships.length; i++) {
    for (var j = 0; j < ships[i].length; j++) {
      if (!centerControl.includes(ships[i][j]) && ships[i][j] != ' ') {
        centerControl.push(ships[i][j]);
      }
    }
  }
  
  var cont = 0;
  var centerControlInfo = [];
  var centerControlPosition = [];
  var letterToDestroy = [];
  var maxMinLetter = [];
  var maxX;
  var maxY;

  for (var k = 0; k < centerControl.length; k++) {
    //for de centro de control

    cont = 0;
    maxX = -1;
    maxY = -1;
    minX = 1000;
    minY = 1000;
    
    centerControlInfo = [];

    for (var i = 0; i < ships.length; i++) {
      for (var j = 0; j < ships[i].length; j++) {
        if (centerControl[k] == ships[i][j]) {
          cont++;

          if (i > maxX) {
            maxX = i;
          }

          if (j > maxY) {
            maxY = j;
          }

          if (i < minX) {
            minX = i;
          }

          if (j < minY) {
            minY = j;
          }

          centerControlInfo.push({
            posx: i,
            posy: j
          });
        }
      }
    }

    maxMinLetter.push({
      maxXL: maxX,
      maxYL: maxY,
      minXL: minX,
      minYL: minY,
      contL: cont
    });

    if (cont > 1) {
      var nearesPosition = centerControlInfo[0];
      var farthesPosition = centerControlInfo[centerControlInfo.length - 1];

      var band = false; //si es un rectangulo o no hacia abajo
      var band2 = false; // si es un rectangulo o no hacia un lado

      for(var m = 0; m < centerControlInfo.length; m++){
        
        for (var u = nearesPosition.posx; u <= maxX; u++) {
          if (ships[u][centerControlInfo[m].posy] == centerControl[k]) {
            band = true;
          } else {
            band = false;
            break;
          }
        }

        for (var u = nearesPosition.posy; u <= maxY; u++) {
          if (ships[centerControlInfo[m].posx][u] == centerControl[k]) {
            band2 = true;
          } else {
            band2 = false;
            break;
          }
        }

        if(band == true && band2 == false){
          break;
        }
      }

      if (
        band == true &&
        band2 == true &&
        ships[maxX][maxY] == centerControl[k]
      ) {
        //su máximo en x y su máximo en y esté la letra

        centerControlPosition.push({
          position: centerControlInfo,
          maxX: maxX,
          maxY: maxY,
          minX: minX,
          minY: minY
        });
        //destruir la capa de esa letra
        letterToDestroy.push(centerControl[k]);
      }
    } else {
      letterToDestroy.push(centerControl[k]);
      centerControlPosition.push({
        position: centerControlInfo,
        maxX: maxX,
        maxY: maxY,
        minX: minX,
        minY: minY
      });
    }
  }

  clearLevel(letterToDestroy, ships, centerControlPosition, scale, maxMinLetter, centerControl);
}

function clearLevel(letterToDestroy, ships, centerControlPosition, scale, maxMinLetter, centerControl) {

  for (var i = 0; i < ships.length; i++) {
    for (var j = 0; j < ships[i].length; j++) {
      if (letterToDestroy.includes(ships[i][j])) {
        ships[i][j] = ' ';
      }
    }
  }

  var areaMessage = [];

  for (var i = 0; i < letterToDestroy.length; i++) {
    var pX =
      ((centerControlPosition[i].maxX + centerControlPosition[i].minX + 1) *
        scale) /
      2;
    var pY =
      ((centerControlPosition[i].maxY + centerControlPosition[i].minY + 1) *
        scale) /
      2;

    var message =
      letterToDestroy[i] + ":" + pX.toFixed(3) + "," + pY.toFixed(3);

    var totalLetterX = centerControlPosition[i].maxX - centerControlPosition[i].minX + 1;
    var totalLetterY = centerControlPosition[i].maxY - centerControlPosition[i].minY + 1;
    var totalLetter = totalLetterX * totalLetterY;
    var areaLE = totalLetter * scale;
    
    areaMessage.push({
      area: areaLE.toFixed(2),
      message: message
    });
    
  }

  areaMessage.sort(compare);
  var messages = areaMessage.map(areaM => areaM.message).join(';');
  output.push(messages);

  for (var i = 0; i < ships.length; i++) {
    for (var j = 0; j < ships[i].length; j++) {
      
      var minPos = 10000;
      var minLetter;
      var possibleLetter = [];
      var finalI;
      var finalJ;

      for(var k = 0; k < maxMinLetter.length; k++){

        if((i <= maxMinLetter[k].maxXL && i >= maxMinLetter[k].minXL) && (j <= maxMinLetter[k].maxYL && j >= maxMinLetter[k].minYL) && (ships[i][j] == ' ') && (!letterToDestroy.includes(centerControl[k]))){

          // centerControlPosition

          var totalLetterX = maxMinLetter[k].maxXL - maxMinLetter[k].minXL + 1;
          var totalLetterY = maxMinLetter[k].maxYL - maxMinLetter[k].minYL + 1;
          var totalLetter = totalLetterX * totalLetterY;
          var missingAmount = totalLetter - maxMinLetter[k].contL;

          possibleLetter.push(centerControl[k]);

          if(missingAmount < minPos){
            
            minPos = missingAmount;
            minLetter = centerControl[k];
            finalI = i;
            finalJ = j;
          }
        }
      }

      if(ships[i][j] == ' ' && minLetter){
        
        ships[finalI][finalJ] = minLetter;
      }

    }
  }

  // printMatriz(ships);
  
}

function showFinal(ships){

  var band = true;

  for (var i = 0; i < ships.length; i++) {

    for (var j = 0; j < ships[i].length; j++) {

      if (ships[i][j] != ' ') {

        band = false;
        break;
      }
    }
  }

  return band;
}

function compare(a, b) {
  
  const areaA = a.area;
  const areaB = b.area;
  const letraA = a.message[0];
  const letraB = b.message[0];

  let comparison = 0;
  if (areaA > areaB) {
    comparison = 1;
  } else if (areaA < areaB) {
    comparison = -1;
  }else if(areaA == areaB){
    
    if(letraA > letraB){

      comparison = 1;
    }else if(letraA < letraB){
      comparison = -1;
    }
  }

  return comparison;
}