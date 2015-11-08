/**
 * Created by Stefan on 09.10.2015.
 */

function pongBall(dimension, position, velocityX, velocityY, color) {
    this.dimension = dimension;
    this.position = position;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.matrix = mat4.create();
    this.color=color;
    //this.angle = 45;

    this.vertecies=[
        //[-this.dimension/2, -Math.cos(angle)*this.dimension/2, 0, Math.cos(angle)*this.dimension/2, this.dimension/2, Math.cos(angle)*this.dimension/2, 0, -Math.cos(angle)*this.dimension/2], //X
        [-this.dimension/2, this.dimension/2, this.dimension/2,-this.dimension/2],  //X
        [-this.dimension/2,-this.dimension/2,this.dimension/2,this.dimension/2], //Y
        //[0, -Math.sin(angle)*this.dimension/2, -this.dimension/2, -Math.sin(angle)*this.dimension/2, 0, Math.sin(angle)*this.dimension/2, this.dimension/2, Math.sin(angle)*this.dimension/2], //Y
        [0,0,0,0],  //Z
        [1,1,1,1]]; //Weil homogene Koords.
}