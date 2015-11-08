var canvas;
var gl;
var aVertexPositionId;
var aVertexColorId;
var uColorPositionId;
var uProjectionMatrixId;
var uNormalMatrixId;
var uniColorId;
var vertexBuffer;
var edgeBuffer;
var lastTimestamp = 0;
var intervall = 30;

var cameraMatrix;

var pointsElement;
var pointsPlayer1 = 0;
var pointsPlayer2 = 0;

//PlayField
var playField = new pongPlayfield([20, 20, 0], [0, 0, 0, 1], [0, 1, 0, 1]);

//Playball
var ball = new pongBall(0.6, [0, 0, 0], 0.5, 0.30, [0, 0.8, 0, 1]);

//Padles / Players
var padlePlayer1 = new pongPadle([0.3, 4, 0], [-playField.dimension[0] / 2 + 0.1 * playField.dimension[0] / 2, 0, 0], 0.35, [0, 0.8, 0, 1]);
var padlePlayer2 = new pongPadle([0.3, 4, 0], [playField.dimension[0] / 2 - 0.1 * playField.dimension[0] / 2, 0, 0], 0.26, [0, 0.8, 0, 1]);

var pongCamera = new pongCamera([0,2, 2], [0, -.1, 0], [0, 5, 0]);

var solidCube = new solidCube([1, 1, 1], [0, 0, 0]);

var solidSphere;


//ID der Uniformvariabel im Shader.
var uModelViewMatrixId;

var resultBallTransformationMatrix;
var resultPadle1Transformationmatrix;
var resultPadle2Transformationmatrix;
var rad = 0;


function startup() {
    canvas = document.getElementById("gameCanvas");
    gl = createGLContext(canvas);
    initGL();
    drawAnimated(1000);
    pointsElement = document.getElementById("points");
    pointsElement.textContent = "Points: " + pointsPlayer1 + " - " + pointsPlayer2;
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
    setupBuffer();

    moveCamera();
}

function draw() {
    gl.clearColor(playField.fieldColor[0], playField.fieldColor[1], playField.fieldColor[2], playField.fieldColor[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    transformCube();
    var resultCubeTransforamtionMatrix = mat4.create();
    mat4.rotate(resultCubeTransforamtionMatrix, resultCubeTransforamtionMatrix, rad, [0, 1, 0]);

    gl.uniformMatrix4fv(uModelViewMatrixId, false, resultCubeTransforamtionMatrix);

    //Angabe welcher (von der beiden) Buffern verwendet wird
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //Hier wird gesagt wie der Buffer interpretiert werden soll.
    //Welche Adressen als Vertecies verwendet werden sollen...
    gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 28, 0); //3 = Anzahl Adressen für Koordinaten; 12 (3)*4= Zusammengehörende Adressen (Koords + Farbe); 0=Beginn des ersten.
    gl.enableVertexAttribArray(aVertexPositionId);

    //...und welche für die Farbe
    //gl.vertexAttribPointer(uColorPositionId, 4, gl.FLOAT, false, 28, 12); //4 = Anzahl Adressen für Farbe; 24 (3+4)*4= Zusammengehörende Adressen (Koords + Farbe); 8=Beginn des ersten (0-11 sind Koords).
    //gl.enableVertexAttribArray(uColorPositionId);

    //Face Culling
    gl.frontFace(gl.CCW); //defineshowthefrontfaceisdrawn
    gl.cullFace(gl.BACK); //defineswhichfaceshouldbeculled
    gl.enable(gl.CULL_FACE); //enablesculling

    //Zeichnen der Tris im Element_Array_Buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, edgeBuffer);
    //gl.disableVertexAttribArray(uColorPositionId);

    //Erste Seite
    gl.uniform4f(uniColorId, 1,0,1,1);
    gl.drawElements(gl.TRIANGLES, 2*3, gl.UNSIGNED_SHORT, 0); //Count: 2 * 3 Verticies für 2 Dreiecke

    //Zweite Seite
    gl.uniform4f(uniColorId, 0,0,1,1);
    gl.drawElements(gl.TRIANGLES, 2*3, gl.UNSIGNED_SHORT, 2*2*3); //Count: 2 * 3 Verticies für 2 Dreiecke, Offset: 2*3 Vertecies auslassen von erster Seite und mal 2 weil UNSIGNED_SHORT=2 Byte

    //Dritte Seite
    gl.uniform4f(uniColorId, 0,1,0,1);
    gl.drawElements(gl.TRIANGLES, 2*3, gl.UNSIGNED_SHORT, 2*4*3);

    //Vierte Seite
    gl.uniform4f(uniColorId, 1,1,0,1);
    gl.drawElements(gl.TRIANGLES, 2*3, gl.UNSIGNED_SHORT, 2*6*3);

    //Fünfte Seite
    gl.uniform4f(uniColorId, 0,1,1,1);
    gl.drawElements(gl.TRIANGLES, 2*3, gl.UNSIGNED_SHORT, 2*8*3);

    //Sechste Seite
    gl.uniform4f(uniColorId, 1,0,0,1);
    gl.drawElements(gl.TRIANGLES, 2*3, gl.UNSIGNED_SHORT, 2*10*3);


    //solidSphere = defineSphere(gl,25,25);
    //var normals = mat3.create();
    //mat3.normalFromMat4(solidSphere);
    //gl.uniformMatrix3fv(uNormalMatrixId, false, normals);
    //drawSphere(gl, solidSphere, aVertexPositionId, aVertexColorId, 1, [0.0,0.5,0.2]);
}

function setupAttributes() {
    //Holt die Positionen der Attribute und Uniforms aus dem Shader.
    aVertexPositionId = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    aVertexColorId = gl.getAttribLocation(shaderProgram, "aVertexColor");
    uColorPositionId = gl.getAttribLocation(shaderProgram, "av4VertexFarbe");
    uModelViewMatrixId = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    uProjectionMatrixId = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
    uniColorId = gl.getUniformLocation(shaderProgram, "uniColor");
    uNormalMatrixId = gl.getUniformLocation(shaderProgram,"uNormalMatrix");
}

function setupBuffer() {


    //Creates Identity Matrices.
    resultBallTransformationMatrix = mat4.create();
    resultPadle1Transformationmatrix = mat4.create();
    resultPadle2Transformationmatrix = mat4.create();


    mat4.translate(ball.matrix, ball.matrix, [ball.velocityX, ball.velocityY, 0, 1]);
    ball.position[0] += ball.velocityX;
    ball.position[1] += ball.velocityY;


    //Es gibt 2 Buffer in WebGL. Den Array und den Elementbuffer.
    //Mit bind wird gesagt welcher vertexBuffer jeweils verwendet werden soll.
    var vertices = [

        //X, Y, Z
        solidCube.vertecies[0][0], solidCube.vertecies[1][0], solidCube.vertecies[2][0], solidCube.colors[0][0], solidCube.colors[0][1], solidCube.colors[0][2], solidCube.colors[0][3],
        solidCube.vertecies[0][1], solidCube.vertecies[1][1], solidCube.vertecies[2][1], solidCube.colors[1][0], solidCube.colors[1][1], solidCube.colors[1][2], solidCube.colors[1][3],
        solidCube.vertecies[0][2], solidCube.vertecies[1][2], solidCube.vertecies[2][2], solidCube.colors[2][0], solidCube.colors[2][1], solidCube.colors[2][2], solidCube.colors[2][3],
        solidCube.vertecies[0][3], solidCube.vertecies[1][3], solidCube.vertecies[2][3], solidCube.colors[3][0], solidCube.colors[3][1], solidCube.colors[3][2], solidCube.colors[3][3],

        solidCube.vertecies[0][4], solidCube.vertecies[1][4], solidCube.vertecies[2][4], solidCube.colors[4][0], solidCube.colors[4][1], solidCube.colors[4][2], solidCube.colors[4][3],
        solidCube.vertecies[0][5], solidCube.vertecies[1][5], solidCube.vertecies[2][5], solidCube.colors[5][0], solidCube.colors[5][1], solidCube.colors[5][2], solidCube.colors[5][3],
        solidCube.vertecies[0][6], solidCube.vertecies[1][6], solidCube.vertecies[2][6], solidCube.colors[6][0], solidCube.colors[6][1], solidCube.colors[6][2], solidCube.colors[6][3],
        solidCube.vertecies[0][7], solidCube.vertecies[1][7], solidCube.vertecies[2][7], solidCube.colors[7][0], solidCube.colors[7][1], solidCube.colors[7][2], solidCube.colors[7][3],
    ];
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    //Setup für die Elemente (Kanten um Vertecies mehrmals zu benützen) Hierzu wird der Element_Array_Buffer verwendet
    var vertexIndices = [
        solidCube.tris[0][0], solidCube.tris[0][1], solidCube.tris[0][2],  //Triangle 1
        solidCube.tris[1][0], solidCube.tris[1][1], solidCube.tris[1][2],
        solidCube.tris[2][0], solidCube.tris[2][1], solidCube.tris[2][2],
        solidCube.tris[3][0], solidCube.tris[3][1], solidCube.tris[3][2],
        solidCube.tris[4][0], solidCube.tris[4][1], solidCube.tris[4][2],
        solidCube.tris[5][0], solidCube.tris[5][1], solidCube.tris[5][2],
        solidCube.tris[6][0], solidCube.tris[6][1], solidCube.tris[6][2],
        solidCube.tris[7][0], solidCube.tris[7][1], solidCube.tris[7][2],
        solidCube.tris[8][0], solidCube.tris[8][1], solidCube.tris[8][2],
        solidCube.tris[9][0], solidCube.tris[9][1], solidCube.tris[9][2],
        solidCube.tris[10][0], solidCube.tris[10][1], solidCube.tris[10][2],
        solidCube.tris[11][0], solidCube.tris[11][1], solidCube.tris[11][2]
    ];
    edgeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, edgeBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices),
        gl.STATIC_DRAW);
}

function move() {
    mat4.multiply(resultPadle1Transformationmatrix, playField.camMatrix, padlePlayer1.matrix);
}

function drawAnimated(timeStamp) {

    //calculatetimesincelastcall
    if (timeStamp - lastTimestamp > intervall) {
        lastTimestamp = timeStamp;
        //moveorchangeobjects
        move();
        draw();
    }
    //requestthenextframe
    window.requestAnimationFrame(drawAnimated);
}

function moveCamera() {

    //Projektionsmatrix
    var projektionMatrix = mat4.create();
    //mat4.ortho(projektionMatrix, -2,2,-2,2,-5, 5);
    mat4.frustum(projektionMatrix, -2, 2, -2, 2, 1.5, 10);

    cameraMatrix = mat4.create();
    mat4.multiply(cameraMatrix, projektionMatrix, pongCamera.matrix);

    //Übergibt Matrix an Shader
    gl.uniformMatrix4fv(uProjectionMatrixId, false, cameraMatrix);
}

function transformCube() {
    rad += 0.01;
}