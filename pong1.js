var canvas;
var gl;
var aVertexPositionId;
var aVertexColorId;
var uProjectionMatrixId;
var uNormalMatrixId;
var aVertexNormalId;
var lastTimestamp = 0;
var intervall = 30;


var Camera;
var playField;
var playBall;
var paddlePlayer1;
var paddlePlayer2;


//ID der Uniformvariabel im Shader.
var uModelViewMatrixId;

function startup() {
    canvas = document.getElementById("gameCanvas");
    gl = createGLContext(canvas);
    initGL();
    drawAnimated(1000);
}

function createGLContext(canvas) {
    //get the gl drawing context
    var context = canvas.getContext("webgl");
    if (!context) {
        alert("Failed to create GL-context");
    }
    //wrap the context to a debug context to get error-messages
    return WebGLDebugUtils.makeDebugContext(context);
}

function initGL() {
    initShaders();
    setupAttributes();

    document.addEventListener("keydown", keyDown, false);

    setUpCamera();
    setUpObjects();
}

function draw() {
    //Background
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Face Culling Enable
    gl.frontFace(gl.CCW); //defineshowthefrontfaceisdrawn
    gl.cullFace(gl.BACK); //defineswhichfaceshouldbeculled
    gl.enable(gl.CULL_FACE); //enablesculling


    playField.draw();

    movePlayball();
    moveKIPaddle();

    playBall.draw();

    paddlePlayer1.draw();
    //paddlePlayer2.draw();
}

function setupAttributes() {
    //Holt die Positionen der Attribute und Uniforms aus dem Shader.
    aVertexPositionId = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    aVertexColorId = gl.getAttribLocation(shaderProgram, "aVertexColor");
    uModelViewMatrixId = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    uProjectionMatrixId = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
    uNormalMatrixId = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
    aVertexNormalId = gl.getAttribLocation(shaderProgram, "aVertexNormal");
}


function drawAnimated(timeStamp) {

    //calculatetimesincelastcall
    if (timeStamp - lastTimestamp > intervall) {
        lastTimestamp = timeStamp;
        //moveorchangeobjects

        draw();
    }
    //requestthenextframe
    window.requestAnimationFrame(drawAnimated);
}

function setUpCamera() {

    Camera = new Camera();
    Camera.setPosition([0, 1.5, 2], [0, 0, 0], [0, 5, 0]);
    Camera.setFrustum(-2, 2, -2, 2, 1.5, 10);
    Camera.setCameraMatrixShaderId(uProjectionMatrixId);
}

function setUpObjects() {
    playField = new SolidCube();
    playField.scale(1, 0.1, 2);

    playBall = new SolidSphere([1.0, 1.0, 0, 1], 15, 15);
    playBall.scale(0.1, 0.1, 0.1);

    paddlePlayer1 = new SolidCube();
    paddlePlayer1.scale(0.5, 0.1, 0.1);
    paddlePlayer1.moveAlong(0, 0, 1 / paddlePlayer1.dimension[2]);

    paddlePlayer2 = new SolidCube();
    //paddlePlayer2.scale(0.5,0.1,0.1);
    //paddlePlayer2.moveAlong(0,0,-4);
}

//Verschiebt den Ball auf dem Feld
function movePlayball() {
    //Ball verschiebung

    //Links und rechts.
    if ((playBall.position[0] + playBall.dimension[0] / 2) * playBall.dimension[0] >= playField.dimension[0] / 2)  //Wenn der Ball am rechten Rand ist...
    {
        //Dann aendere die Richtung
        playBall.velocityX = playBall.velocityX * -1;
    }
    if ((playBall.position[0] - playBall.dimension[0] / 2) * playBall.dimension[0] <= -playField.dimension[0] / 2) {
        playBall.velocityX = Math.abs(playBall.velocityX);
    }

    //Oben und unten abprallen
    if ((playBall.position[2] - playBall.dimension[2] / 2) * playBall.dimension[2] >= playField.dimension[2] / 2) {
        playBall.velocityZ = playBall.velocityZ * -1;
    }
    if ((playBall.position[2] + playBall.dimension[2] / 2) * playBall.dimension[2] <= -playField.dimension[2] / 2) {
        playBall.velocityZ = Math.abs(playBall.velocityZ);
    }

    //Transformiere Ballposition
    playBall.moveAlong(playBall.velocityX, 0, playBall.velocityZ);


    ////Wenn Ball rechts drausen
    //if(playBall.position[0] >= playField.dimension[0]/2){
    //    pointsPlayer1++;
    //    mat4.identity(ball.matrix);
    //    playBall.position = [0,0];
    //    playBall.velocityX= -1 * ball.velocityX;
    //    pointsElement.textContent = "Points: "+pointsPlayer1 + " - " + pointsPlayer2;
    //}
    //
    ////Wenn Ball links drausen
    //if(playBall.position[0] <= -playField.dimension[0]/2){
    //    pointsPlayer2++;
    //    mat4.identity(ball.matrix);
    //    playBall.position = [0,0];
    //    playBall.velocityX=Math.abs(ball.velocityX);
    //    pointsElement.textContent = "Points: "+pointsPlayer1 + " - " + pointsPlayer2;
    //}
}

//Padle verschiebung des KI-Padles
function moveKIPaddle() {

    var currentPaddleVelocity = paddlePlayer2.velocityX;

    //Padle rechts Ball
    if (paddlePlayer2.position[0] > playBall.position[0] + 0.2) {
        currentPaddleVelocity = -paddlePlayer2.velocityX;
    }
    //Paddle links Ball
    else if (paddlePlayer2.position[0] < playBall.position[0] - 0.2) {
        currentPaddleVelocity = paddlePlayer2.velocityX;
    } else {
        currentPaddleVelocity = 0;
    }

    paddlePlayer2.moveAlong(currentPaddleVelocity, 0, 0);
}

//Bewegung des Spieler Padles.
function keyDown(einEvent) {

    //KeyCodes
    //left = 37
    //up = 38
    //right = 39
    //down = 40


    switch (einEvent.keyCode) {

        ////cursor up
        //case 38:
        //    paddlePlayer1.moveAlong(0,paddlePlayer1.velocityY,0);
        //    break;
        //
        ////cursor down
        //case 40:
        //    paddlePlayer1.moveAlong(0,-paddlePlayer1.velocityY,0);
        //    break;

        //cursor left
        case 37:
            if ((paddlePlayer1.position[0]-paddlePlayer1.dimension[0])*paddlePlayer1.dimension[0] >= -playField.dimension[0]/2) {
                paddlePlayer1.moveAlong(-paddlePlayer1.velocityX, 0, 0);
            }
            break;

        //cursor right
        case 39:
            if ((paddlePlayer1.position[0]+paddlePlayer1.dimension[0])*paddlePlayer1.dimension[0] <= playField.dimension[0]/2) {
                paddlePlayer1.moveAlong(paddlePlayer1.velocityX, 0, 0);
            }
            break;

        default:
            break;
    }
}