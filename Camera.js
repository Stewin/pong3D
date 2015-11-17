function Camera() {

    //Parameter für Position und richtung der Kamera
    this.position = 0;
    this.direction = 0;
    this.upVector = 0;

    //Parameter für Frustum der Kamera
    this.left = 0;
    this.right = 0;
    this.bottom = 0;
    this.top = 0;
    this.near = 0;
    this.far = 0;

    //ID für die Kameramatrix im Shader
    this.cameraMatrixShaderId=null;

    //Matrix für Position und ausrichtung der Kamera
    this.translationMatrix = mat4.create();

    //Projektionsmatrix
    this.projectionMatrix = mat4.create();

    //Resulting Camera Matrix. (Projektion * Translation)
    this.cameraMatrix=mat4.create();

    this.setFrustum = function(left,right,bottom,top,near,far){
        this.left=left;
        this.right=right;
        this.bottom=bottom;
        this.top=top;
        this.near=near;
        this.far=far;

        mat4.frustum(this.projectionMatrix, this.left, this.right, this.bottom, this.top, this.near, this.far);
        mat4.multiply(this.cameraMatrix, this.projectionMatrix, this.translationMatrix);
        gl.uniformMatrix4fv(this.cameraMatrixShaderId, false, this.cameraMatrix);
    }

    this.setPosition = function(position,direction,upVector){
        this.position=position;
        this.direction=direction;
        this.upVector=upVector;

        mat4.lookAt(this.translationMatrix, this.position, this.direction, this.upVector);
        mat4.multiply(this.cameraMatrix, this.projectionMatrix, this.translationMatrix);
        gl.uniformMatrix4fv(this.cameraMatrixShaderId, false, this.cameraMatrix);
    }

    this.setCameraMatrixShaderId = function(cameraMatrixShaderId){
        this.cameraMatrixShaderId = cameraMatrixShaderId;
        gl.uniformMatrix4fv(this.cameraMatrixShaderId, false, this.cameraMatrix);
    }







}