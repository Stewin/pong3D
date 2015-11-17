function SolidCube() {
    this.dimension = [1,1,1];
    this.position = [0,0,0];
    this.colors=0;

    this.velocityX=0.3;
    this.velocityY=0.3;
    this.velocityZ=0.3;

    //Translationsmatrix
    this.translationMatrix = mat4.create();

    //Normalenmatrix
    this.normalMatrix = mat4.create();

    //Buffers
    this.bufferVertices=gl.createBuffer();
    this.bufferNormals = gl.createBuffer();
    this.bufferIndices = gl.createBuffer();
    this.bufferColors = gl.createBuffer();

    this.vertices = [
        //X, Y, Z

        //Front
        -this.dimension[0] / 2, -this.dimension[1] / 2, this.dimension[2] / 2, //V0
        this.dimension[0] / 2, -this.dimension[1] / 2, this.dimension[2] / 2, //V1
        this.dimension[0] / 2, this.dimension[1] / 2, this.dimension[2] / 2, //V2
        -this.dimension[0] / 2, this.dimension[1] / 2, this.dimension[2] / 2, //V3

        //Back
        -this.dimension[0] / 2, -this.dimension[1] / 2, -this.dimension[2] / 2, //V4
        this.dimension[0] / 2, -this.dimension[1] / 2, -this.dimension[2] / 2, //V5
        this.dimension[0] / 2, this.dimension[1] / 2, -this.dimension[2] / 2, //V6
        -this.dimension[0] / 2, this.dimension[1] / 2, -this.dimension[2] / 2, //V7

        //Left
        -this.dimension[0] / 2, -this.dimension[1] / 2, this.dimension[2] / 2, //V8 = V0
        -this.dimension[0] / 2, this.dimension[1] / 2, this.dimension[2] / 2, //V9 = V3
        -this.dimension[0] / 2, -this.dimension[1] / 2, -this.dimension[2] / 2, //V10 = V4
        -this.dimension[0] / 2, this.dimension[1] / 2, -this.dimension[2] / 2, //V11 = V7

        //Right
        this.dimension[0] / 2, -this.dimension[1] / 2, this.dimension[2] / 2, //V12 = V1
        this.dimension[0] / 2, this.dimension[1] / 2, this.dimension[2] / 2, //V13 = V2
        this.dimension[0] / 2, -this.dimension[1] / 2, -this.dimension[2] / 2, //V14 = V5
        this.dimension[0] / 2, this.dimension[1] / 2, -this.dimension[2] / 2, //V15 = V6

        //Top
        this.dimension[0] / 2, this.dimension[1] / 2, this.dimension[2] / 2, //V16 = V2
        -this.dimension[0] / 2, this.dimension[1] / 2, this.dimension[2] / 2, //V17 = V3
        this.dimension[0] / 2, this.dimension[1] / 2, -this.dimension[2] / 2, //V18 = V6
        -this.dimension[0] / 2, this.dimension[1] / 2, -this.dimension[2] / 2, //V19 = V7

        //Bottom
        -this.dimension[0] / 2, -this.dimension[1] / 2, this.dimension[2] / 2, //V20 = V0
        this.dimension[0] / 2, -this.dimension[1] / 2, this.dimension[2] / 2, //V21 = V1
        -this.dimension[0] / 2, -this.dimension[1] / 2, -this.dimension[2] / 2, //V22 = V4
        this.dimension[0] / 2, -this.dimension[1] / 2, -this.dimension[2] / 2 //V23 = V5
    ];

    //Triangle
    this.tris = [
        //Front
        0, 1, 2, //Vertex 0 zu Vertex 1 zu Vertex 2
        0, 2, 3,

        //Back
        4, 7, 6,
        4, 6, 5,

        //Left
        8, 9, 11,
        8, 11, 10,

        //Right
        12,14,15,
        12,15,13,

        //Top
        16, 18, 19,
        16, 19, 17,

        //Bottom
        20, 22, 23,
        20, 23, 21
    ];

    //Normalen
    this.vertexNormals = [
        // vorne
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,

        // hinten
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,

        // links
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,

        // rechts
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,

        // oben
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,

        // unten
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0
    ];


    //Bindet die Buffer und zeichnet den Würfel
    this.draw = function () {

        gl.uniformMatrix4fv(uModelViewMatrixId, false, this.translationMatrix);

        //Binden des Array_Buffers für Koordinaten

        //Binden des Array_Buffers für Koordinaten
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0); //3 = Anzahl Adressen fuer Koordinaten;
        gl.enableVertexAttribArray(aVertexPositionId);


        //Color
        this.colors=defineSolidCubeColors();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferColors);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(aVertexColorId, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aVertexColorId);

        //Binden des Buffers für die Normalen
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferNormals);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexNormals), gl.STATIC_DRAW);
        gl.vertexAttribPointer(aVertexNormalId, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aVertexNormalId);

        //Recalculate Normals
        mat4.invert(this.normalMatrix, this.translationMatrix);
        mat4.transpose(this.normalMatrix, this.normalMatrix);
        gl.uniformMatrix4fv(uNormalMatrixId, false, this.normalMatrix);


        //Binden des Element_Array_Buffers
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferIndices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.tris), gl.STATIC_DRAW);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);


        gl.disableVertexAttribArray(aVertexPositionId);
        gl.disableVertexAttribArray(aVertexNormalId);
        gl.disableVertexAttribArray(aVertexColorId);
    }

    this.moveAlong = function (x, y, z) {
        this.position[0]+=x;
        this.position[1]+=y;
        this.position[2]+=z;
        mat4.translate(this.translationMatrix, this.translationMatrix, [x, y, z, 1]);
    }

    this.rotate = function (angle, axis) {
        mat4.rotate(this.translationMatrix, this.translationMatrix, angle, axis);
    }

    this.scale = function (x, y, z) {

        this.dimension[0]*=x;
        this.dimension[1]*=y;
        this.dimension[2]*=z;
        mat4.scale(this.translationMatrix, this.translationMatrix, [x, y, z, 1]);
    }

    function defineSolidCubeColors() {

        var colors;

        var backColor = [1.0, 0.0, 0.0],
            frontColor = [0.0, 0.0, 1.0],
            rightColor = [0.0, 1.0, 0.0],
            leftColor = [1.0, 1.0, 0.0],
            topColor = [1.0, 1.0, 1.0],
            bottomColor = [0.0, 1.0, 1.0];

        // make 4 entries, one for each vertex
        var backSide    = backColor.concat(backColor, backColor, backColor);
        var frontSide   = frontColor.concat(frontColor, frontColor, frontColor);
        var rightSide   = rightColor.concat(rightColor, rightColor, rightColor);
        var leftSide    = leftColor.concat(leftColor, leftColor, leftColor);
        var topSide     = topColor.concat(topColor, topColor, topColor);
        var bottomSide  = bottomColor.concat(bottomColor, bottomColor, bottomColor);

        colors = backSide.concat(frontSide, rightSide, leftSide, topSide, bottomSide);
        return colors;
    }
}