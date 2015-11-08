function pongCamera(position, direction, upVector) {
    this.position = position;
    this.direction = direction;
    this.upVector = upVector;

    this.matrix = mat4.create();
    mat4.lookAt(this.matrix, this.position, this.direction, this.upVector);

}