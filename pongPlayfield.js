/**
 * Created by Stefan on 09.10.2015.
 */

function pongPlayfield(dimension, fieldColor, midlineColor) {
    this.dimension = dimension;
    this.fieldColor = fieldColor;
    this.midlineColor = midlineColor;
    this.camMatrix = mat4.create();

    //Kamera transformation
    //left, right, bottom, top, near, far Coordinates
    mat4.ortho(this.camMatrix, -this.dimension[0]/2, this.dimension[0]/2, -this.dimension[1]/2, this.dimension[1]/2, -1, 100);
}