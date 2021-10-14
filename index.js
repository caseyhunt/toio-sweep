const CUBE_ID_ARRAY = [ 0, 1, 2 ];
const SUPPORT_CUBE_NUM = CUBE_ID_ARRAY.length;

// Global Variables.
const gCubes = [ undefined, undefined, undefined ];


var xmax = 308;
var ymax = 212;
let toiox = [0];
let toioy = [0];

var slider1 = document.getElementById("slider1");
var speed1 = 0xFF;

//objects tagged with position ID tracked using a max/min value (part of a mat)
const objTrackedmm = [];

//objects tagged with standard ID
const objTracked = [];

let mat2 = false;


  const SERVICE_UUID              = '10b20100-5b3b-4571-9508-cf3efcd7bbae';
  const MOVE_CHARCTERISTICS_UUID = '10b20102-5b3b-4571-9508-cf3efcd7bbae';
  const SOUND_CHARCTERISTICS_UUID = '10b20104-5b3b-4571-9508-cf3efcd7bbae';
  const LIGHT_CHARCTERISTICS_UUID = '10b20103-5b3b-4571-9508-cf3efcd7bbae';
  const POSITION_CHARACTERISTICS_UUID = '10b20101-5b3b-4571-9508-cf3efcd7bbae';

  const connectNewCube = () => {

      const cube = {
          device:undefined,
          sever:undefined,
          service:undefined,
          soundChar:undefined,
          moveChar:undefined,
          lightChar:undefined,
          posChar: undefined

      };

      // Scan only toio Core Cubes
      const options = {
          filters: [
              { services: [ SERVICE_UUID ] },
          ],
      }

      navigator.bluetooth.requestDevice( options ).then( device => {
          cube.device = device;
          if( cube === gCubes[0] ){
              turnOnLightCian( cube );

              const cubeID = 1;
              changeConnectCubeButtonStatus( cubeID, undefined, true );
          }else if( cube === gCubes[1] ){
              turnOnLightGreen( cube );
              //spinCube( cube );
              const cubeID = 2;
              changeConnectCubeButtonStatus( cubeID, undefined, true );
          }
          changeConnectCubeButtonStatus( undefined, cube, false );
          return device.gatt.connect();
      }).then( server => {
          cube.server = server;
          return server.getPrimaryService( SERVICE_UUID );
      }).then(service => {
          cube.service = service;
          return cube.service.getCharacteristic( MOVE_CHARCTERISTICS_UUID );
      }).then( characteristic => {
          cube.moveChar = characteristic;
          return cube.service.getCharacteristic( SOUND_CHARCTERISTICS_UUID );
      }).then( characteristic => {
          cube.soundChar = characteristic;
          return cube.service.getCharacteristic( LIGHT_CHARCTERISTICS_UUID );
      }).then( characteristic => {
          cube.lightChar = characteristic;
          return cube.service.getCharacteristic( POSITION_CHARACTERISTICS_UUID );
      }).then( characteristic => {
          cube.posChar = characteristic;
          if( cube === gCubes[0] ){
            turnOnLightCian( cube );
            //spinCube( cube );
            enableMoveButtons();
          }else if( cube === gCubes[1] ){
            turnOnLightGreen( cube );
          }else{
            turnOnLightRed( cube );
          }
      });

      return cube;
  }



  // Cube Commands
  // -- Light Commands
  var myCharacteristic;
  const turnOffLight = ( cube ) => {

      const CMD_TURN_OFF = 0x01;
      const buf = new Uint8Array([ CMD_TURN_OFF ]);
      if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
          cube.lightChar.writeValue( buf );

      }

  }


  const turnOnLightGreen = ( cube ) => {

      // Green light
      const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0x00, 0xFF, 0xFF]);

      if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
          cube.lightChar.writeValue( buf );
          console.log('green');
      }

  }

  const turnOnLightCian = ( cube ) => {

      // Cian light
    const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0x00, 0xFF, 0xFF ]);
      if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
          cube.lightChar.writeValue( buf );
          console.log('cyan');

      }

  }

  const turnOnLightRed = ( cube ) => {

      // Red light
      const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0xFF, 0x00, 0x00 ]);
      if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
          cube.lightChar.writeValue( buf );
      }

  }


  const spinCube = ( cube ) => {

      // Green light
      const buf = new Uint8Array([ 0x02, 0x01, 0x01, 0x64, 0x02, 0x02, 0x14, 0x64 ]);
      if( ( cube !== undefined ) && ( cube.moveChar !== undefined ) ){
          cube.moveChar.writeValue( buf );
          console.log('spin');
      }

  }

  const changeButtonStatus = ( btID, enabled ) => {
      document.getElementById( btID ).disabled = !enabled;
  }


  const changeConnectCubeButtonStatus = ( idButton, cube, enabled ) => {

      if( idButton ){
          changeButtonStatus( 'btConnectCube' + ( idButton + 1 ), enabled );
      }else{
          if( gCubes[0] === cube ){
              changeButtonStatus( 'btConnectCube1', enabled );
          }else if( gCubes[1] === cube ){
              changeButtonStatus( 'btConnectCube2', enabled );
          }else{
              changeButtonStatus( 'btConnectCube3', enabled );
          }
      }

  }

  const enableMoveButtons = () => {
    changeButtonStatus( 'btMoveFW', true );
    changeButtonStatus( 'btMoveB', true );
    changeButtonStatus( 'btMoveL', true );
    changeButtonStatus( 'btMoveR', true );
  }


  const cubeMove = ( moveID, cubeno,speed ) => {
      const cube = gCubes[cubeno];
      var buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x64, 0x02, 0x01, 0x64]);
      // forward

      //enforce max speed
      speed =0xF;
      turnspeed = 0xA;
      console.log(speed);
      if(moveID==1){
      buf = new Uint8Array([ 0x01, 0x01, 0x01, speed, 0x02, 0x01, speed]);
    }else if (moveID==2){
      buf = new Uint8Array([ 0x01, 0x01, 0x02, speed, 0x02, 0x02, speed]);
    }else if (moveID==3){
      buf = new Uint8Array([ 0x01, 0x01, 0x02, 0x14, 0x02, 0x01, turnspeed]);
    }else if (moveID==4){
      buf = new Uint8Array([ 0x01, 0x01, 0x01, turnspeed, 0x02, 0x02, 0x14]);
    }else if (moveID==5){
      buf = new Uint8Array([ 0x02, 0x01, 0x01, speed, 0x02, 0x01, speed, 0x50]);
    }
      if( ( cube !== undefined ) && ( cube.moveChar !== undefined ) ){
          cube.moveChar.writeValue( buf );
          console.log('move');
      }

  }

  const cubeStop = () =>{
      const cube = gCubes[0];
      const buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x00, 0x02, 0x01, 0x00]);
      if( ( cube !== undefined ) && ( cube.moveChar !== undefined ) ){
          setTimeout(() => {cube.moveChar.writeValue( buf )},100);
          console.log('stop');
      }
  }

  function onStartButtonClick() {
    const buf1 = new Uint8Array([ 0x18, 0x00, 0x01, 0x01 ]);
    gCubes[0].posChar.writeValue(buf1);
    //posCharacteristic = gCubes[0].posChar.readValue();
    //console.log(posCharacteristic);
    return gCubes[0].posChar.startNotifications().then(_ => {
      console.log('> Notifications started');
      gCubes[0].posChar.addEventListener('characteristicvaluechanged',
          handleNotifications);
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}

function handleNotifications(event) {
  // let value = event.target.value;
  // console.log(value);

  let value = event.target.value;
//  console.log(value);
  //console.log(value.getInt16(1, true));
let a = [];
for (let i = 0; i < value.byteLength; i++) {
  a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
}

 console.log(a);
let movex = [];
movex[0] = [parseInt(0x02), parseInt(0x57)];
//max in hex
movex[1] = [parseInt(0x01), parseInt(0x74)];
//min,max in int
movex[2] = [parseInt(movex[0][0].toString()+movex[0][1].toString()), parseInt(movex[1][0].toString() + movex[1][1].toString())];
let movey = [];
movey[0] = [parseInt(0x00), parseInt(0xe0)];
movey[1] = [parseInt(0x00),parseInt(0x46)];
movey[2] = [parseInt(toString(movey[0][0]) + toString(movey[0][1])), parseInt(toString(movey[1][0]) + toString(movey[1][1]))];
var xzero = movex[2][0];
console.log(movex[0][0].toString()+movex[0][1].toString());
var yzero = movey[1][1];
var xmax = movex[2][1];
var ymax = movey[2][0];

if (toiox[0] != undefined){
toiox[1] = toiox[0];
toioy[1] = toioy[0];
}

toiox[0] = parseInt(parseInt(a[2]).toString() + parseInt(a[1]).toString())-xzero;
toiox[0] = parseInt(parseInt(a[4]).toString() + parseInt(a[3]).toString())-yzero;
//toiox[0] = value.getInt16(1, true);
toioy[0] = value.getInt16(3, true)-yzero;

var xpos = (value.getInt16(1, true)-xzero).toString();
var ypos = (value.getInt16(3, true)-yzero).toString();
var angle = value.getInt16(5, true).toString();
//console.log("x: ", xpos, "y: ", ypos, "angle: ", angle);
document.getElementById("xpos").innerHTML = "x position: " + xpos;
document.getElementById("ypos").innerHTML = "y position: " + ypos;
document.getElementById("angle").innerHTML = "angle (degrees): " + angle;

drawToio();
//console.log('> ' + a.join(' '));

}

function readTwoSensor() {
  if(gCubes[1]!=undefined){
  const buf1 = new Uint8Array([ 0x18, 0x00, 0x01, 0x01 ]);
  gCubes[1].posChar.writeValue(buf1);
  //posCharacteristic = gCubes[0].posChar.readValue();
  //console.log(posCharacteristic);
  return gCubes[1].posChar.startNotifications().then(_ => {
    console.log('> Notifications started');
    gCubes[1].posChar.addEventListener('characteristicvaluechanged',
        twoSenseNotifications);
})
.catch(error => {
  console.log('Argh! ' + error);
})
};
}

function twoSenseNotifications(event) {
// let value = event.target.value;
// console.log(value);

let value = event.target.value;
//  console.log(value);
//console.log(value.getInt16(1, true));
let a = [];

for (let i = 0; i < value.byteLength; i++) {
a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
}

console.log(a);

//uncomment this line to see the raw data coming in from bluetooth
// console.log(a);

//in the case of position ID
if(a[0]==0x00){
  //to do: add conditional for position ID to change HTML according to the object
}
//in the case of standard ID
else if(a[0]==0x02){
  //to do: add object id and all the other stuff :D
}

//also confirm that bottom toio can read position while also sensing object
//last, print out the x,y position of the object while displaying the object name in HTML

//console.log('> ' + a.join(' '));

}

function drawToio(){
  if(toiox[1] != toiox[0] || toioy[1] != toioy[0]){
    console.log("toio moving");

    var ypos = (toioy[0]/ymax)*600;
    var xpos = (toiox[0]/xmax)*840;
    document.getElementById("toio").style.left = (ypos).toString() + "px";
    document.getElementById('toio').style.top = (xpos).toString() + "px";
    console.log("moving to: x: " + xpos + " y: " + ypos);
  }
}

function getMousePos(){
  const rect = event.target.getBoundingClientRect();
  var x = (event.clientX - rect.left)/600;
  var y = (event.clientY- rect.top)/840;
  console.log("mouse click x : " + x + " y : " + y);
  var xmove = parseInt((200 * x) +51);
  var ymove = parseInt((290 * y) + 40);
  console.log("x: " + xmove + " y: "+ ymove);
  xmove = xmove.toString(16);
  ymove = ymove.toString(16);
  if(xmove.length ==3){
    xmove = "0" + xmove;
  }else if (xmove.length == 2){
    xmove = "00" + xmove;
  }

  if(ymove.length ==3){
    ymove = "0" + ymove;
  }else if (ymove.length == 2){
    ymove = "00" + ymove;
  }

  let xgo = [xmove.slice(2,4), xmove.slice(0,2)];
  let ygo = [ymove.slice(2,4), ymove.slice(0,2)];
  xgo[0] = "0x" + xgo[0];
  xgo[1] = "0x" + xgo[1];
  ygo[0] = "0x" + ygo[0];
  ygo[1] = "0x" + ygo[1];
  xmove = "0x" + xmove.toString(16);
  ymove = "0x" + ymove.toString(16);



  console.log("x: " + xmove.toString(16) + " y: "+ ymove.toString(16));

   if (gCubes[0] != undefined){

       console.log("move cube to position");
       // console.log("x: " + xmove.toString(16) + " y: "+ ymove.toString(16));
       cube = gCubes[0];
       var buf = new ArrayBuffer(10)
       var a8 = new Uint8Array(buf);
       var buf1 = new Uint8Array([ 0x03, 0x00, 0x05, 0x00, 0x50, 0x00, 0x00]);
       var buf4 = new Uint8Array([0x03,0x00,0x05,0x00,0x50,0x00, 0x00,ygo[0], ygo[1],xgo[0],xgo[1],0x5a,0x00]);
       buf4 = new Uint8Array([0x03, 0x00, 0x05, 0x02, 0x1e, 0x00, 0x00, 0x31, 0x00, 0xbd, 0x02, 0x5a, 0x00]);
       //'0x41', '0x01', '0xbd', '0x02'
       buf5= new Uint8Array([0x04, 0x00, 0x05, 0x02, 0x1e, 0x00, 0x00, 0x01, 0x31, 0x00, 0xbd, 0x02, 0x5a, 0x00, 0x41, 0x01, 0xbd, 0x02, 0x5a, 0x00]);
      console.log(buf4);

        //cube.moveChar.writeValue(buf4);
        cube.moveChar.writeValue(buf5);




}
}

function lightControl(on){
  console.log(on);
  cube = gCubes[1];
if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
  if(on == true){
    const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0xFF, 0xFF, 0xFF]);
    cube.lightChar.writeValue( buf );
    console.log('light on');
}
else{
  const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00]);
  cube.lightChar.writeValue( buf );
  console.log('light off');
}
}
}


let counter = 0;

function sweep(){
  let xstart = 63;
  let xend = 155;
  let ystart = 2187;
  let value = 0xbd;
  console.log(parseInt(0x37));
  console.log(parseInt(0x00));
  console.log(parseInt(0xbb));
  console.log(parseInt(0x02));
  console.log(value.toString(16));


  if (gCubes[0] != undefined){
      counter = 0;
      console.log("sweep");
      // console.log("x: " + xmove.toString(16) + " y: "+ ymove.toString(16));
      cube = gCubes[0];

      //to do: add initial position as mat center if assembly is not at position 0,0
      if(mat2==true){
        //[0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x3e, 0x00, 0xc5, 0x02, 0x67, 0x01];
        buf5 =new Uint8Array([0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x3e, 0x00, 0xc5, 0x02, 0x67, 0x01]);
      }else{
      buf5= new Uint8Array([0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x57, 0x02, 0xe0, 0x00, 0x67, 0x01]);
    }

       //cube.moveChar.writeValue(buf4);
       console.log("mat two " + mat2);
       cube.moveChar.writeValue(buf5);
       return gCubes[0].moveChar.startNotifications().then(_ => {
         console.log('> Notifications started');
         gCubes[0].moveChar.addEventListener('characteristicvaluechanged',
             handleNotifications1);
     })
     .catch(error => {
       console.log('Argh! ' + error);
     });
}
}



var next = true;
let b = [];


//when you receive a position notification from cube 0
function handleNotifications1(event) {
  // let value = event.target.value;
  // console.log(value);
  console.log("handlenotifications1");
  let value = event.target.value;
//  console.log(value);
  //console.log(value.getInt16(1, true));
let b = [];
// Convert raw data bytes to hex values just for the sake of showing something.
// In the "real" world, you'd use data.getUint8, data.getUint16 or even
// TextDecoder to process raw data bytes.
for (let i = 0; i < value.byteLength; i++) {
  b.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
}

console.log(b);

cube = gCubes[0];

if(counter<25){
sweepNext(counter);
}
}


function sweepNext(c){
//   buf5= new Uint8Array([0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00, 0x6b, 0x02, 0xdb, 0x00, 0x5a, 0x00]);
//
//    //cube.moveChar.writeValue(buf4);
//    cube.moveChar.writeValue(buf5);
  console.log("sweepnext");
  console.log(c);
// motor control with target destination, control id value, timeout, movement type (0x00 move while rotating, 0x02 rotate then move), max speed, constant speed, reserved, x coord1, xcoord0, ycoord1,ycoord0, angle1, angle0
let movex = [];
  let movey = [];
if(mat2 == true){
  movex[0] = [parseInt(0x00), parseInt(0x3e)];
  //'0x1c', '0x01', '0xc4', '0x02'
  movex[1] = [parseInt(0x01), parseInt(0x25)];
  movex[2] = [parseInt(movex[0][0].toString() + movex[0][1].toString()), toString(movex[1][0]) + toString(movex[1][1])];
  movey[0] = [parseInt(0x02), parseInt(0xc4)];
  //'0x56', '0x03'
  movey[1] = [parseInt(0x03),parseInt(0x56)];
  movey[2] = [parseInt(movey[0][0].toString() + movey[0][1].toString()), parseInt(movey[1][0].toString() + movey[1][1].toString())];
}else{
movex[0] = [parseInt(0x02), parseInt(0x54)];
movex[1] = [parseInt(0x01), parseInt(0x7e)];
movex[2] = [parseInt(movex[0][0].toString() + movex[0][1].toString()), toString(movex[1][0]) + toString(movex[1][1])];
movey[0] = [parseInt(0x00), parseInt(0xe0)];
movey[1] = [parseInt(0x00),parseInt(0x47)];
movey[2] = [toString(movey[0][0]) + toString(movey[0][1]), toString(movey[1][0]) + toString(movey[1][1])];
}
let numSweep = 10;
let sweep = [];
let move2 = [];
  console.log(movey[0][1]);
  console.log('move y');
  console.log(movey[2][1]);
  console.log(movey[2][0]);
  console.log(movey[2][0]-movey[2][1]);
for(i=0;i<=numSweep;i++){
  let moveby;
  if(mat2==true){

    moveby = movey[2][0]-movey[2][1];
    moveby = moveby/numSweep;
    console.log(moveby);
    moveby1 = parseInt(moveby);
    moveby2 = parseInt(moveby);
    moveby = movey[2][0] + (i*moveby);

    console.log(moveby);
    if(moveby>=3000){
    move2[0] = parseInt(moveby.toString().slice(0,2));
    // console.log(move2[0]);
    move2[0] = "0x03";
    move2[1] = parseInt(moveby.toString().slice(1,moveby.length));

    move2[1] = "0x"+move2[1].toString(16);
  }else if(moveby>=2000){
    if(moveby <= 2225){
      console.log("less than 2225");
    move2[0] = parseInt(moveby.toString().slice(0,2));
    // console.log(move2[0]);
    move2[0] = "0x02";
    move2[1] = parseInt(moveby.toString().slice(1,moveby.length));

    move2[1] = "0x"+move2[1].toString(16);
  }else if(moveby >2225){
    console.log("greater than 2225");
    move2[0] = parseInt(moveby.toString().slice(0,2));
    // console.log(move2[0]);
    //move2[0] = "0x02";
    move2[1] = parseInt(moveby.toString().slice(2,moveby.length));

    move2[1] = "0x"+move2[1].toString(16);
  }
  }

  moveby1 = moveby + (moveby1);
  console.log(moveby1);
  if(moveby1>=3000){

    move2[2] = "0x03";
    move2[3] = parseInt(moveby1.toString().slice(1,moveby1.length));
    move2[3] = "0x" + move2[3].toString(16);
  } else if(moveby1<3000){
      if(moveby1 <= 2225){
      move2[2] = "0x02";
      move2[3] = parseInt(moveby1.toString().slice(1,moveby1.length));
      move2[3] = "0x" + move2[3].toString(16);
    }else if(moveby1 >2225){
      move2[2] = parseInt(moveby1.toString().slice(0,2));
      // console.log(move2[0]);
      //move2[0] = "0x02";
      move2[3] = parseInt(moveby1.toString().slice(2,moveby1.length));

      move2[3] = "0x"+move2[1].toString(16);
    }
    }


    // sweep.push([0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x28, 0x01, 0xbf, 0x02, 0x5a, 0x00]);
    // sweep.push([0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x2c, 0x01, 0xda, 0x02, 0x5a, 0x00]);
    //parseInt(moveby1.toString().slice(1,moveby1.length));
    // if(move2[3].toString(16).length<2){
    //   move2[3] = "0"+move2[3].toString();
    // }
    console.log(move2);
  }else{
    moveby = movey[0][1]-movey[1][1];
    moveby = moveby/numSweep;
    moveby1 = parseInt(moveby);
    moveby2 = parseInt(moveby);
  moveby = movey[0][1]-(i*moveby);
  moveby1 = moveby - (moveby1);
}
  console.log(moveby.toString(16));
  moveby = "0x" + parseInt(moveby).toString(16);
  moveby1 = "0x" + parseInt(moveby1).toString(16);
  moveby2 = "0x" + moveby2.toString(16);
  console.log("move by 1 " + moveby1);
    if(i%2 == 0 && i!=numSweep){
      console.log("even: " + moveby + " " + moveby1);
  //sweep.push([0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,movex[0][1], movex[0][0], moveby, 0x00, 0x00, 0x00]);
  if(mat2 == true){
    sweep.push([0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,movex[1][1], movex[1][0], move2[1], move2[0], 0x5a, 0x00]);
    sweep.push([0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,movex[1][1], movex[1][0], move2[3], move2[2], 0x00, 0x00]);
  }else{
  sweep.push([0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,movex[1][1], movex[1][0], parseInt(moveby), 0x00, 0x5a, 0x00]);
  sweep.push([0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,movex[1][1], movex[1][0], parseInt(moveby1), 0x00, 0x00, 0x00]);
}}
  else if(i%2 !=0 && i!=numSweep){
      if(mat2 == true){
    console.log("odd: " + moveby + " " + moveby1);
  // sweep.push([0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x3e, movex[0][0], move2[1], move2[0], 0x00, 0xb4, 0x00]);
  // sweep.push([0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x3e, movex[0][0], move2[3], move2[2], 0x00, 0x00]);
}else{
  sweep.push([0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,movex[0][1], movex[0][0], parseInt(moveby), 0x00, 0xb4, 0x00]);
  sweep.push([0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,movex[0][1], movex[0][0], parseInt(moveby1), 0x00, 0x00, 0x00]);

}

}else if(i == numSweep){
  sweep.push([0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,movex[0][1], movex[0][0], parseInt(moveby), 0x00, 0xb4, 0x00]);
}

}

console.log(sweep);


// let sweep = [[0x03, 0x00, 0xA, 0x00, 0xF, 0x00, 0x00,0x74, 0x01, 0xe0, 0x00, 0x67, 0x01], [0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x77, 0x01, 0xc8, 0x00, 0x00, 0x00],  [0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x57, 0x02, 0xc5, 0x00, 0x00, 0x00], [0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x57, 0x02, 0xbb, 0x00, 0xb4, 0x00], [0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x74, 0x01, 0xbb, 0x00, 0xb4, 0x00],
//  [0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x74, 0x01, 0xa0, 0x00, 0x0f, 0x01], [0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x57, 0x02,  0xa0, 0x00, 0x00, 0x00], [0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x57, 0x02, 0x91, 0x00, 0xb4, 0x00],[0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x57, 0x02,0x91, 0x00, 0xb4, 0x00], [0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x74, 0x01, 0x91, 0x00, 0xb4, 0x00], [0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x74, 0x01, 0x82, 0x00, 0x0f, 0x01],[0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x57, 0x02,  0x82, 0x00, 0x00, 0x00], [0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x57, 0x02, 0x73, 0x00, 0xb4, 0x00], [0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x57, 0x02,0x64, 0x00, 0xb4, 0x00],[0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x74, 0x01, 0x64, 0x00, 0xb4, 0x00], [0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x74, 0x01, 0x55, 0x00, 0x0f, 0x01], [0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x57, 0x02,  0x55, 0x00, 0x00, 0x00], [0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x57, 0x02, 0x46, 0x00, 0xb4, 0x00], [0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x74, 0x01, 0x46, 0x00, 0xb4, 0x00], [0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x74, 0x01,0x3c, 0x00, 0x0f, 0x01], [0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x57, 0x02,  0x3c, 0x00, 0x00, 0x00],[0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x74, 0x01, 0x3c, 0x00, 0xb4, 0x00]];
  buf5= new Uint8Array(sweep[c]);
//
//  //cube.moveChar.writeValue(buf4);
cube.moveChar.writeValue(buf5);
counter++;
// buf5= new Uint8Array([0x03, 0x00, 0xA, 0x00, 0xF, 0x00, 0x00,0x74, 0x01, 0xe0, 0x00, 0x57, 0x00]);
// cube.moveChar.writeValue(buf5);
 }

 function backtoStart(){
     cube = gCubes[0];
     if(mat2==true){
       buf5 =new Uint8Array([0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x3e, 0x00, 0xc5, 0x02, 0x67, 0x01]);
     }else{
     buf5= new Uint8Array([0x03, 0x00, 0xA, 0x02, 0xF, 0x00, 0x00,0x57, 0x02, 0xe0, 0x00, 0x67, 0x01]);
   }
 //  //cube.moveChar.writeValue(buf4);
 cube.moveChar.writeValue(buf5);
 }

function cubeRotate(moveID){
 const cube = gCubes[0];
 var buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x64, 0x02, 0x01, 0x64]);
 // forward

 //enforce max speed
 speed =0xF;
 turnspeed = 0xA;
 console.log(speed);
if (moveID==0){
 buf = new Uint8Array([ 0x02, 0x01, 0x02, 0x14, 0x02, 0x01, turnspeed, 0x3E]);
}else if (moveID==1){
 buf = new Uint8Array([ 0x02, 0x01, 0x01, turnspeed, 0x02, 0x02, 0x14, 0x3E]);
}

 cube.moveChar.writeValue(buf);
}

function matTwo(){
  mat2 =! mat2;
  for(i=0;i<document.getElementsByClassName("mui-btn").length;i++){
  document.getElementsByClassName("mui-btn")[i].classList.toggle("two");
}
}


  const initialize = () => {

    // Event Listning for GUI buttons.
    for( let cubeId of CUBE_ID_ARRAY ){
        document.getElementById( 'btConnectCube' + ( cubeId + 1) ).addEventListener( 'click', async ev => {

            if( cubeId === 0 ){
                gCubes[0] = connectNewCube();
                console.log('cube 0 connected (cyan)');
            }else if( cubeId === 1 ){
                gCubes[1] = connectNewCube();
                console.log('cube 1 connected (green)');
            }else{
                gCubes[2] = connectNewCube();
                console.log('cube 3 connected (red)');
            }

          });
      }

      document.getElementById('getPos').addEventListener('mousedown', async ev => {
        onStartButtonClick();
      });

      document.getElementById('getPos').addEventListener('touchstart', async ev => {
        onStartButtonClick();
      });

      document.getElementById('getid').addEventListener('mousedown', async ev => {
        readTwoSensor()
      });

      document.getElementById('getid').addEventListener('touchstart', async ev => {
        readTwoSensor()
      });

      document.getElementById("mat2").addEventListener('mousedown', async ev =>{
        matTwo();
      });

      document.getElementById("mat2").addEventListener('touchstart', async ev =>{
        matTwo();
      });


      document.getElementById('canvas').addEventListener('click', async ev => {
        getMousePos();
      });

      document.getElementById('canvas').addEventListener('touchstart', async ev => {
        getMousePos();
      });

      document.getElementById("on").addEventListener("click", async ev=>{
        lightControl(true);
      })

      document.getElementById("on").addEventListener("touchstart", async ev=>{
        lightControl(true);
      })


      document.getElementById("off").addEventListener("click", async ev=>{
        lightControl(false);
      })

      document.getElementById("off").addEventListener("touchstart", async ev=>{
        lightControl(false);
      })

      document.getElementById("sweep").addEventListener("click",async ev=>{
        sweep();
      })

      document.getElementById("start").addEventListener("click", async ev=>{
        backtoStart();
      })

      document.getElementById("start").addEventListener("touchstart", async ev=>{
        backtoStart();
      })
      // document.getElementById("sweep").addEventListener("touchstart",async ev=>{
      //   sweep();
      // })


            document.getElementById( 'btMoveFW' ).addEventListener( 'mousedown', async ev => {
              cubeMove( 1 ,0 , speed1);
            });
            document.getElementById( 'btMoveFW' ).addEventListener( 'touchstart', async ev => {
                cubeMove( 1,0 , speed1);
            });
            document.getElementById( 'btMoveFW' ).addEventListener( 'mouseup', async ev => {
              cubeStop();
            });
            document.getElementById( 'btMoveL' ).addEventListener( 'mousedown', async ev => {
                      cubeMove( 3, 0 , speed1);
            });
            document.getElementById( 'btMoveL' ).addEventListener( 'touchstart', async ev => {
                 cubeMove( 3, 0 ,speed1 );
            });
            document.getElementById( 'btMoveL' ).addEventListener( 'touchend', async ev => {
                cubeStop();
            });
            document.getElementById( 'btMoveL' ).addEventListener( 'mouseup', async ev => {
              cubeStop();
            });
            document.getElementById( 'btMoveR' ).addEventListener( 'mousedown', async ev => {
                    cubeMove( 4,0 , speed1);
            });
            document.getElementById( 'btMoveR' ).addEventListener( 'touchstart', async ev => {
                 cubeMove( 4,0 , speed1);
            });
            document.getElementById( 'btMoveR' ).addEventListener( 'touchend', async ev => {
                cubeStop();
            });
            document.getElementById( 'btMoveR' ).addEventListener( 'mouseup', async ev => {
              cubeStop();});

              document.getElementById('btMoveL90').addEventListener('mousedown', async ev => {
                cubeRotate(0);
              });

              document.getElementById('btMoveL90').addEventListener('touchstart', async ev => {
                cubeRotate(0);
              });

              document.getElementById('btMoveR90').addEventListener('click', async ev => {
                cubeRotate(1);
              });

              document.getElementById('btMoveR90').addEventListener('touchstart', async ev => {
                cubeRotate(1);
              });

}




  initialize();
