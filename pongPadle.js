/**
 * Created by Stefan on 09.10.2015.
 */

function pongPadle(dimension, position, velocityY, color) {
    this.dimension = dimension;
    this.position = position;
    this.velocityY = velocityY;
    this.color=color;
    this.matrix = mat4.create();

    this.vertecies=[[this.position[0]-this.dimension[0]/2, this.position[0]+this.dimension[0]/2, this.position[0]+this.dimension[0]/2,this.position[0]-this.dimension[0]/2],
        [this.position[1]-this.dimension[1]/2,this.position[1]-this.dimension[1]/2,this.position[1]+this.dimension[1]/2,this.position[1]+this.dimension[1]/2],
        [0,0,0,0],[1,1,1,1]];
}