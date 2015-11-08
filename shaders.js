function initShaders() {

    //Laden der Ressourcen
    shaderProgram = loadAndCompileShaders(gl,"VSHADER_SOURCE.vShader","FSHADER_SOURCE.fShader");
}