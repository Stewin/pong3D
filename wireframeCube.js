
function wireframeCube(dimension, position) {
    this.dimension = dimension;
    this.position = position;

    this.matrix = mat4.create();

    this.vertecies=[
        [-this.dimension[0]/2, this.dimension[0]/2, this.dimension[0]/2,-this.dimension[0]/2, -this.dimension[0]/2, this.dimension[0]/2, this.dimension[0]/2,-this.dimension[0]/2],  //X-Coords V0-V7
        [-this.dimension[1]/2,-this.dimension[1]/2,this.dimension[1]/2,this.dimension[1]/2, -this.dimension[1]/2,-this.dimension[1]/2,this.dimension[1]/2,this.dimension[1]/2], //Y-Coords V0-V7
        [this.dimension[2]/2,this.dimension[2]/2,this.dimension[2]/2,this.dimension[2]/2, -this.dimension[2]/2, -this.dimension[2]/2,-this.dimension[2]/2,-this.dimension[2]/2],  //Z V0-V7

        [1,1,1,1,1,1,1,1] //Weil homogene Koords.
    ];

    this.edges=[

    ];
}