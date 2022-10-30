var width = window.innerWidth;
var height = window.innerHeight;
const size = 3000;
const playersize = 75;
const coinsize = 37.5;
const ratio = size / 500;

function random(number1, number2){
  return Math.round(Math.random() * (number2 - number1)) + number1;
}

function checkMovement(direction, x, y){
  if(direction == "left"){
    if(x <= 0) return false;
  } if(direction == "right"){
    if(x + playersize >= size) return false;
  } if(direction == "up"){
    if(y <= 0) return false;
  } if(direction == "down"){
    if(y + playersize >= size) return false;
  } if(direction == "none"){
    return false;
  }
  return true;
}

export { width, height, size, playersize, coinsize, ratio, random, checkMovement }