
// node
const fspack = require('fs');
const fs = fspack.promises;
const path = require('path');
// express
const Express = require('express');
const express = Express();
const { createProxyMiddleware } = require('http-proxy-middleware');
// socket.io
const WebSocket = require('ws');
// serial
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

/*=============== GLOBALS ===============*/
/*=============== GLOBALS ===============*/
/*=============== GLOBALS ===============*/
/*=============== GLOBALS ===============*/
/*=============== GLOBALS ===============*/
/*=============== GLOBALS ===============*/
/*=============== GLOBALS ===============*/
/*=============== GLOBALS ===============*/
/*=============== GLOBALS ===============*/
/*=============== GLOBALS ===============*/
/*=============== GLOBALS ===============*/
/*=============== GLOBALS ===============*/
/*=============== GLOBALS ===============*/
/*=============== GLOBALS ===============*/

// Sensor
var closestSensor = 0;
const closestSensorPosition = [null, -11000, -11000+4400, -11000+8800, 11000-8800, 11000-4400, 11000];

// Motor
var motorReady = false;
var posX = 0;
var posY = 0;

// Face Jeeliz
var detected = false;
var moveX = 0;
var moveY = 0;
var faceIdleTimeout;
var faceIdleCount = 0;

/*=============== Crucial Performance Parameters ===============*/

var motor_interval = 200;
var faceToStep = 500;


/*=============== HTTP ===============*/
/*=============== HTTP ===============*/
/*=============== HTTP ===============*/
/*=============== HTTP ===============*/
/*=============== HTTP ===============*/
/*=============== HTTP ===============*/
/*=============== HTTP ===============*/
/*=============== HTTP ===============*/
/*=============== HTTP ===============*/
/*=============== HTTP ===============*/
/*=============== HTTP ===============*/
/*=============== HTTP ===============*/
/*=============== HTTP ===============*/
/*=============== HTTP ===============*/
/*=============== HTTP ===============*/

/*=============== Express : Settings ===============*/

// parse body
const parseBody = (req,res,next)=>{
    let data = '';
    req.on('data',(chunk)=>{
        data+=chunk;
    });
    req.on('end',()=>{
        req.rawBody = data;
        req.jsonBody = JSON.parse(data);
        next();
    });
};


// public redirect
express.get('/assets/*', function (req, res) {
    const loc = req.url.replace('\/assets\/','')
    res.sendFile(path.resolve(
        `./public/${loc}`
    ));
});

// routers
const router = Express.Router();
express.use('/',router);
router.use('/public',Express.static(path.join(path.resolve(),'public')));
router.use('/home', (req,res)=>{ 
    res.sendFile(path.join(__dirname,'public/dist/index.html'));
});

// listen
express.listen(50000,()=>{console.log('[mvw-jeeliz]',50000);});


/*=============== GET : Landing URL ===============*/
router.get('/',(req,res)=>{
    res.redirect('/home')
})
// Send    : script => measure width,height => POST to /measure
// Recieve : width,height
// Request : GET /watch?width&height
router.get('/movingWindow',(req,res)=>{
    res.send(`
    <script>
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                var status = xhr.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    var responseJSON = JSON.parse(xhr.responseText);
                    window.location='/movingWindow/watch?width='+responseJSON.width+'&height='+responseJSON.height
                }
            }
        };
        xhr.open("POST", "/movingWindow/measure", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            width: window.innerWidth,
            height: window.innerHeight
        }));
    </script>
    `);
});

/*=============== POST : device width/height ===============*/

router.post('/movingWindow/measure',parseBody,(req,res)=>{
    res.send(req.jsonBody);
});

/*=============== GET : Contents File ===============*/

router.get('/movingWindow/watch',async (req,res)=>{

    

    let jeelizHTML = await fs.readFile(path.join(path.resolve(),'jeeliz.html'),'utf-8');
    jeelizHTML = jeelizHTML
    .replace('$CANVAS_WIDTH',req.query.width.toString()+'px')
    .replace('$CANVAS_HEIGHT',req.query.height.toString()+'px')
    ;

    const ua = [
        "Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1",
        // "Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"
    ]
    if( ua.includes(req.headers['user-agent']) && req.headers['x-forwarded-for'] === '192.168.0.1' ){
        jeelizHTML = jeelizHTML
        .replace('const exhibition = false;','const exhibition = true;')
        .replace('<!--moreAboutQuote-->','Rotate Your Head and Walk Around')
        .replace('<!--moreAboutButton-->','<button id="qrOpen" class="roundedButton"> About This Work <img src="../public/images/qr.png" alt="qr code"> </button>')
        ;
    }else{
        jeelizHTML = jeelizHTML
        .replace('<!--moreAboutQuote-->','Rotate Your Head<br>and Swipe')
        .replace('<!--moreAboutButton-->','<a id="webOpen" href="/home">  About This Work </a>')
        ;
    }
    res.send(jeelizHTML);
});

/*=============== WEBSOCKET ===============*/
/*=============== WEBSOCKET ===============*/
/*=============== WEBSOCKET ===============*/
/*=============== WEBSOCKET ===============*/
/*=============== WEBSOCKET ===============*/
/*=============== WEBSOCKET ===============*/
/*=============== WEBSOCKET ===============*/
/*=============== WEBSOCKET ===============*/
/*=============== WEBSOCKET ===============*/
/*=============== WEBSOCKET ===============*/
/*=============== WEBSOCKET ===============*/
/*=============== WEBSOCKET ===============*/
/*=============== WEBSOCKET ===============*/
/*=============== WEBSOCKET ===============*/

let socketClients = {};
let socketClientCount = 0;
const wss = new WebSocket.Server({ port:50001 });
wss.on('connection', function connection(ws) {

    ws.id = socketClientCount;
    socketClients[ws.id] = ws;
    socketClientCount++;

    console.log('client conn',ws.id);

    onConnection(ws.id);

    ws.on('message', function incoming(message) {

        message = JSON.parse(message)

        /*=============== Recieve face coords, set MoveX/Y state ===============*/
        if(message.detected==true){
            detected = true;
            clearInterval(faceIdleTimeout);
            faceIdleCount = 0;
            moveX = convertFaceToSteps(message.x);
            moveY = convertFaceToSteps(message.y);
            console.log('from client',moveX,moveY);
        } 
        if(message.detected==false && faceIdleCount==0){
            console.log("Lost");
            detected = false;
            faceIdleTimeout = setInterval(toSensor, 7500); // Sensor routine
            faceIdleCount++;
        }
    });
    ws.on('close', function () {
        console.log('client disconnect',ws.id);
        socketClientCount--;
        delete socketClients[ws.id];
    })
});

/*=============== ARDUINO ===============*/
/*=============== ARDUINO ===============*/
/*=============== ARDUINO ===============*/
/*=============== ARDUINO ===============*/
/*=============== ARDUINO ===============*/
/*=============== ARDUINO ===============*/
/*=============== ARDUINO ===============*/
/*=============== ARDUINO ===============*/
/*=============== ARDUINO ===============*/
/*=============== ARDUINO ===============*/
/*=============== ARDUINO ===============*/
/*=============== ARDUINO ===============*/
/*=============== ARDUINO ===============*/
/*=============== ARDUINO ===============*/
/*=============== ARDUINO ===============*/

/*=============== Sensor : Conntection & Incoming Data ===============*/

const port_sensor = new SerialPort('/dev/cu.usbmodem144301', { baudRate: 115200 });
const parser_sensor = port_sensor.pipe(new Readline({ delimiter: '\n' }));// Read the port data
port_sensor.on("open", () => {
    console.log('serial: port_sensor open');
});
parser_sensor.on('data', data =>{
    // console.log('serial: port_sensor data',closestSensor);
    closestSensor = parseInt(data[0]);
});

/*=============== Motor : Connection ===============*/
    
const port_motor = new SerialPort('/dev/cu.usbmodem144201', { baudRate: 115200 });
const parser_motor = port_motor.pipe(new Readline({ delimiter: '\n' }));// Read the port data
port_motor.on("open", () => {
    console.log('serial: port_motor open');
});


/*=============== Motor : Incoming Data ===============*/

parser_motor.on('data', data =>{

    if(data=="ready\r"){
        motorReady = true;
        console.log("motor ready");
    }
    if(data.split(',').length == 2 ){
        posX = parseInt(data.split(',')[0]);
        posY = parseInt(data.split(',')[1]);
    }

    for (let index = 0; index < socketClientCount; index++) {
        socketClients[index].send((-posX).toString()+','+(posY).toString());
        console.log(`Send target to client ${index} : ${posX},${posY}`);
    }
    
});


/*=============== Motor : Send Steps ===============*/

const sendStepsToMotor = (x=0,y=0) =>{
    if(Math.abs(posX)+Math.abs(x) > 11000) { // if X is over limit (11000)
        if(posX<0 && x<0){
            x = -11000-posX;
        }
        if(posX>0 && x>0){
            x = 11000-posX;
        }
    }
    if(Math.abs(posY)+Math.abs(y) > 12000) { // if Y is over limit (12000)
        if(posY<0 && y<0){
            y = -12000-posY;
        }
        if(posY>0 && y>0){
            y = 12000-posY;
        }
    }
    port_motor.write(x.toString()+','+y.toString()+'\n', (err) => {
        console.log("Send Steps to Motor :",x,y);
        if (err) {
          return console.log('Error on write: ', err.message);
        }
    });
}

setInterval(() => {
    // console.log(motorReady, detected);
    if(motorReady && detected){
        detected = false;
        sendStepsToMotor(-moveX,moveY);
        moveX = 0;
        moveY = 0;
    }
}, motor_interval);


  
/*=============== Helper : Face-Coords(1.0) to Motor-Steps ===============*/

const convertFaceToSteps = (face = 0.0) => {
    faceAbs = Math.abs(face);
    let move = 0;
    if(faceAbs < 0.3) {
        move = 0;
    } else if(faceAbs >= 0.3 && faceAbs < 0.425) {
        move = faceToStep;
    } else if(faceAbs >= 0.425 && faceAbs < 0.55) {
        move = faceToStep*2;
    } else if(faceAbs >= 0.55 && faceAbs < 0.7) {
        move = faceToStep*6;
    } else if(faceAbs >= 0.7 && faceAbs <= 1) {
        move = faceToStep*8;
    }

    if(face<0){
        move *= -1;
    }
    return move
}

/*=============== Helper : (fn) sensor routine ===============*/

const toSensor = () => {
    console.log("to sensor :\n",closestSensor,closestSensorPosition[closestSensor],posX);
    if(closestSensorPosition[closestSensor] < posX){ // to closestSensor
        moveX = - closestSensorPosition[closestSensor] + posX;
    }
    else if(closestSensorPosition[closestSensor] > posX){ // to closestSensor
        moveX = - closestSensorPosition[closestSensor] + posX;
    } 
    else {
        moveX = 0;
    }
    moveY = -posY;  // to center
    detected = true;
}



/*=============== Testing - threejs file ===============*/

router.get('/contentsTest',(req,res)=>{
    res.sendFile(path.join(path.resolve(),'contentsTest.html'));
    // res.sendFile(path.join(path.resolve(),'example.html'));
});



/*=============== Testing - send client position ===============*/

let sendClientTarget = (clientId,target) => {
    const client = socketClients[clientId];
    console.log(`target to client ${clientId} : ${target}`);
    client.send(target.toString()+','+target.toString());
}

let onConnection = (clientId) => { // in wss onconnection
    const block = 4400;
    // setTimeout(() => sendClientTarget(clientId, block+1000), 5000);
    // setTimeout(() => sendClientTarget(clientId, block-1000), 10000);
    // setTimeout(() => sendClientTarget(clientId, 0), 15000);

    // setTimeout(() => sendClientTarget(clientId, 11000), 10000);
    // setTimeout(() => sendClientTarget(clientId, 6600), 25000);
    // setTimeout(() => sendClientTarget(clientId, 2200), 30000);
    // setTimeout(() => sendClientTarget(clientId, -2200), 35000);
    // setTimeout(() => sendClientTarget(clientId, -6600), 40000);
    // setTimeout(() => sendClientTarget(clientId, -11000), 45000);
}
