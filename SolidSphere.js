function SolidSphere(color, latitudeBands, longitudeBands){

    this.dimension = [1,1,1];
    this.position = [0,0,0];
    this.color=color;

    this.velocityX=0.05;
    this.velocityY=0.0;
    this.velocityZ=0.1;

    this.bufferVertices = gl.createBuffer();
    this.bufferNormals = gl.createBuffer();
    this.bufferIndices = gl.createBuffer();

    //Translationsmatrix
    this.translationMatrix = mat4.create();

    //Normalenmatrix
    this.normalMatrix = mat4.create();

    // define the vertices of the sphere
    this.vertices = [];
    this.normals = [];
    this.indices = [];

    this.numberOfTriangles = latitudeBands*longitudeBands*2;


    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;

            // texture coordinates (not used)
            // var u = 1 - (longNumber / longitudeBands);
            // var v = 1 - (latNumber / latitudeBands);

            this.vertices.push(x);
            this.vertices.push(y);
            this.vertices.push(z);

            this.normals.push(x);
            this.normals.push(y);
            this.normals.push(z);
        }
    }

    for (latNumber = 0; latNumber < latitudeBands; latNumber++) {
        for (longNumber = 0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;

            this.indices.push(first);
            this.indices.push(first + 1);
            this.indices.push(second);

            this.indices.push(second);
            this.indices.push(first + 1);
            this.indices.push(second + 1);
        }
    }

    this.draw = function(){

        gl.uniformMatrix4fv(uModelViewMatrixId, false, this.translationMatrix);

        //Vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aVertexPositionId);

        //Color
        gl.disableVertexAttribArray(aVertexColorId);
        gl.vertexAttrib3f(aVertexColorId, this.color[0], this.color[1], this.color[2]);


        //Normals
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferNormals);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
        gl.vertexAttribPointer(aVertexNormalId, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aVertexNormalId);

        mat4.invert(this.normalMatrix, this.translationMatrix);
        mat4.transpose(this.normalMatrix, this.normalMatrix);
        gl.uniformMatrix4fv(uNormalMatrixId, false, this.normalMatrix);

        //Indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferIndices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

        //Draw Tris
        gl.drawElements(gl.TRIANGLES, this.numberOfTriangles*3 ,gl.UNSIGNED_SHORT, 0);


        //CleanUp after Draw this Object
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

    this.scale=function(x,y,z){
        this.dimension[0]*=x;
        this.dimension[1]*=y;
        this.dimension[2]*=z;
        mat4.scale(this.translationMatrix,this.translationMatrix, [x,y,z,1]);
    }
}