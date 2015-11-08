
function solidCube(dimension, position) {
    this.dimension = dimension;
    this.position = position;

    this.matrix = mat4.create();

    this.vertecies=[
        [-this.dimension[0]/2, this.dimension[0]/2, this.dimension[0]/2,-this.dimension[0]/2, -this.dimension[0]/2, this.dimension[0]/2, this.dimension[0]/2,-this.dimension[0]/2],  //X-Coords V0-V7
        [-this.dimension[1]/2,-this.dimension[1]/2,this.dimension[1]/2,this.dimension[1]/2, -this.dimension[1]/2,-this.dimension[1]/2,this.dimension[1]/2,this.dimension[1]/2], //Y-Coords V0-V7
        [this.dimension[2]/2,this.dimension[2]/2,this.dimension[2]/2,this.dimension[2]/2, -this.dimension[2]/2, -this.dimension[2]/2,-this.dimension[2]/2,-this.dimension[2]/2],  //Z V0-V7
        [1,1,1,1,1,1,1,1] //Weil homogene Koords.
    ];

    this.tris=[
        [0, 1, 2], //Vertex 0 zu Vertex 1 zu Vertex 2
        [0, 2, 3],
        [1, 5, 6],
        [1, 6, 2],
        [3, 2, 6],
        [3, 6, 7],
        [4, 0, 3],
        [4, 3, 7],
        [5, 4, 6],
        [4, 7, 6],
        [4, 5, 0],
        [5, 1, 0]
    ];

    this.colors=[
        [0,0,1,1], //Color 1
        [0,1,0,1],
        [0,1,1,1],
        [1,0,1,1],
        [1,1,0,1],
        [1,1,1,1],
        [1,0.5,0.5,1],
        [0.5,0.5,1,1]

    ];

    this.normals = mat3.create();
    mat3.normalFromMat4(this.normals, this.matrix);

    this.draw = function() {}
}