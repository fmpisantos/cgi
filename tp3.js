var gl;

var canvas;

// GLSL programs
var program;

// Render Mode
var WIREFRAME=1;
var FILLED=2;
var renderMode = WIREFRAME;

var projection;
var modelView;
var view;

var dx;
var dy=0;
var dz;

var rx=1;
var ry=1;
var rz=1;
var angleOfRotarion=Math.PI+Math.PI/2;
var raio=3;

var velocidadeY=0;
var velocidadeX=0;
var velocidadeZ=0;

var gravidade=-0.0005;

var YELLOW = [1,1,0];
var BLUE = [0,0,1];
var RED = [1,0,0];
var GREY = [0.5,0.5,0.5];
var WHITE = [1,1,1];
var BLACK = [0,0,0];

matrixStack = [];

function pushMatrix()
{
    matrixStack.push(mat4(modelView[0], modelView[1], modelView[2], modelView[3]));
}

function popMatrix()
{
    modelView = matrixStack.pop();
}

function multTranslation(t) {
    modelView = mult(modelView, translate(t));
}

function multRotX(angle) {
    modelView = mult(modelView, rotateX(angle));
}

function multRotY(angle) {
    modelView = mult(modelView, rotateY(angle));
}

function multRotZ(angle) {
    modelView = mult(modelView, rotateZ(angle));
}

function multMatrix(m) {
    modelView = mult(modelView, m);
}
function multScale(s) {
    modelView = mult(modelView, scalem(s));
}

function initialize() {
    gl.clearColor(1, 1, 1, 1.0);
    canvas.width=window.innerHeight-22;
    canvas.height=window.innerHeight-22;
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, "vertex-shader-2", "fragment-shader-2");

    cubeInit(gl);
    sphereInit(gl);
    cylinderInit(gl);

    setupProjection();

    //Posicionar o helicopetro
    angleOfRotarion-=Math.PI/180;
    dx=raio*Math.cos(angleOfRotarion);
    dz=-raio*Math.sin(angleOfRotarion);

    setupView();
}

function setupProjection() {
    //projection = perspective(60, 1, 0.1, 100);
    projection = ortho(-4,4,-3,3,0.1,100);
}

function setupView() {
    view = lookAt([0,0,5], [0,0,0], [0,1,0]);
    modelView = mat4(view[0], view[1], view[2], view[3]);
    changeProjection();
}

function changeProjection(){
    var a=42;
    var b=7;

    //var t=Math.atan(Math.sqrt(Math.tan(a*Math.PI/180)/Math.tan(b*Math.PI/180)))-Math.PI/2;
    //var g=Math.asin(Math.sqrt(Math.tan(a*Math.PI/180)*Math.tan(b*Math.PI/180)));
    var t=parseFloat(document.getElementById("axiometricaA").value);
    var g=parseFloat(document.getElementById("axiometricaB").value);

    multRotX(g*180/Math.PI);
    multRotY(t*180/Math.PI);

}

function setMaterialColor(color) {
    var uColor = gl.getUniformLocation(program, "color");
    gl.uniform3fv(uColor, color);
}

function sendMatrices()
{
    // Send the current model view matrix
    var mView = gl.getUniformLocation(program, "mView");
    gl.uniformMatrix4fv(mView, false, flatten(view));

    // Send the normals transformation matrix
    var mViewVectors = gl.getUniformLocation(program, "mViewVectors");
    gl.uniformMatrix4fv(mViewVectors, false, flatten(normalMatrix(view, false)));

    // Send the current model view matrix
    var mModelView = gl.getUniformLocation(program, "mModelView");
    gl.uniformMatrix4fv(mModelView, false, flatten(modelView));

    // Send the normals transformation matrix
    var mNormals = gl.getUniformLocation(program, "mNormals");
    gl.uniformMatrix4fv(mNormals, false, flatten(normalMatrix(modelView, false)));
}

function draw_sphere(color)
{
    setMaterialColor(color);
    sendMatrices();
    sphereDrawFilled(gl, program);
}

function draw_cube(color)
{
    setMaterialColor(color);
    sendMatrices();
    cubeDrawFilled(gl, program);
}

function draw_cylinder(color)
{
    setMaterialColor(color);
    sendMatrices();
    cylinderDrawFilled(gl, program);
}

function draw_scene()
{
var d = (new Date()).getTime();
if(dy<0){
  dy=0;
}else if(dy>2){
  dy=2;
}
//cena
  pushMatrix();
  //helicopetro
  pushMatrix();
    multTranslation([dx,dy,dz]);
    multRotX(rx);
    multRotY(ry);
    multRotZ(rz);
    multScale([0.2,0.2,0.2]);
    //Centro
    pushMatrix();
      multScale([2,1,2]);
      draw_sphere(BLACK);
    popMatrix();
    //ligacao cauda
    pushMatrix();
      multTranslation([1.5,0.30,0]);
      multScale([2,0.3,0.3]);
      draw_sphere(BLACK);
    popMatrix();
    //patas
    pushMatrix();
    multTranslation([0.0,-0.9,0]);
    multScale([1.5,0.1,0.1]);
    //Pata ESQ
    pushMatrix();
      multTranslation([0,0,5]);
      draw_cylinder(BLACK);
    popMatrix();
    //Pata DTO
    pushMatrix();
      multTranslation([0,0,-5]);
      draw_cylinder(BLACK);
    popMatrix();
    popMatrix();
    //pes
    pushMatrix();
      //Pe ESQ
      pushMatrix();
      multRotX(30);
      multScale([0.1,0.7,0.1]);
        pushMatrix();
          multTranslation([4,-0.7,0.0]);
          multRotZ(40);
          draw_cube(WHITE);
        popMatrix();
        pushMatrix();
        multTranslation([-4,-0.7,0.0]);
          multRotZ(-40);
          draw_cube(WHITE);
        popMatrix();
      popMatrix();

      //Pe DTO
      pushMatrix();
      multRotX(-30);
      multScale([0.1,0.7,0.1]);
        pushMatrix();
          multTranslation([4,-0.7,0.0]);
          multRotZ(40);
          draw_cube(WHITE);
        popMatrix();
        pushMatrix();
          multTranslation([-4,-0.7,0.0]);
          multRotZ(-40);
          draw_cube(WHITE);
        popMatrix();
      popMatrix();
      popMatrix();

      //cauda
      pushMatrix();
        multTranslation([2.4,0.36,0.1]);
        pushMatrix();
          multRotZ(75);
          multScale([0.3,0.1,0.1]);
          draw_sphere(BLACK);
        popMatrix();
      //Cilindro no meio da helice da cauda
        pushMatrix();
          multRotZ(d/5);
          pushMatrix();
            multRotX(90);
            multScale([0.05,0.3,0.05]);
            draw_cylinder(WHITE);
          popMatrix();
            //Helice cauda
          pushMatrix();
            multScale([0.3,0.1,0.1]);
            pushMatrix();
              multTranslation([-0.5,0,1]);
              draw_sphere(WHITE);
            popMatrix();
            pushMatrix();
              multTranslation([0.5,0,1]);
              draw_sphere(WHITE);
            popMatrix();
          popMatrix();
        popMatrix();
      popMatrix();
      //Helices de Cima
      pushMatrix();
          multRotY(d/5);
          multTranslation([0,0.6,0]);
          //Cilindro do meio
          pushMatrix();
            multScale([0.1,0.3,0.1]);
            draw_cylinder(BLACK);
          popMatrix();
          //Helices
          pushMatrix();
          multScale([2,0.1,0.1]);
          //Helice
          pushMatrix();
            multTranslation([-0.5,0,0]);
            draw_sphere(WHITE);
          popMatrix();
          //Helice
          pushMatrix();
            multTranslation([0.5,0,0]);
            draw_sphere(WHITE);
          popMatrix();
          popMatrix()
      popMatrix();
    popMatrix();
  popMatrix();

  //chao
    pushMatrix();
    multTranslation([0,-0.75,0]);
    multScale([7,1,7]);
    //Circulo no chao
    pushMatrix();
    multTranslation([0,0.01,0]);
    draw_cylinder(RED);
    popMatrix();
    pushMatrix();
    multTranslation([0,0.011,0]);
    multScale([0.8,1,0.8]);
    draw_cylinder(WHITE);
    popMatrix();
    //H no chao
    //Perna Vertical do H lado esq
    pushMatrix();
      multTranslation([-0.15,0.1,0]);
      multScale([0.1,1,0.6]);
      draw_cube(BLACK);
    popMatrix();
    //Perna Vertical do H lado dto
    pushMatrix();
      multTranslation([0.15,0.1,0]);
      multScale([0.1,1,0.6]);
      draw_cube(BLACK);
    popMatrix();
    //Perna Horizontal do H
    pushMatrix();
      multTranslation([0,0.1,0]);
      multScale([0.4,1,0.1]);
      draw_cube(BLACK);
    popMatrix();
    //Chao
    pushMatrix();
    draw_cube(WHITE);
    popMatrix();
    popMatrix();
  popMatrix();
}

document.addEventListener("keydown", keyDownTextField, false);

function keyDownTextField(e) {
  var keyCode = e.keyCode;
  switch(keyCode){
      case 38:
      dy+=0.1;
      break;
      case 87:
      dy+=0.1;
      break;
      case 40:
      dy-=0.1;
      break;
      case 83:
      dy-=0.1;
      break;
      case 37:
      if(dy>0){
      angleOfRotarion-=Math.PI/180;
      dx=raio*Math.cos(angleOfRotarion);
      dz=-raio*Math.sin(angleOfRotarion);
      ry=(angleOfRotarion+Math.PI/2)*180/Math.PI;
    }
      break;
      case 65:
      if(dy>0){
      angleOfRotarion-=Math.PI/180;
      dx=raio*Math.cos(angleOfRotarion);
      dz=-raio*Math.sin(angleOfRotarion);
      ry=(angleOfRotarion+Math.PI/2)*180/Math.PI;
    }
  }
}


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);

    setupView();

    // Send the current projection matrix
    var mProjection = gl.getUniformLocation(program, "mProjection");
    gl.uniformMatrix4fv(mProjection, false, flatten(projection));

    draw_scene();

    if(velocidadeY<0)
    velocidadeY+=0.01;
    else if(velocidadeY>0)
    velocidadeY-=0.01;

    dy+=gravidade;

    requestAnimFrame(render);
}


window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");
    canvas.width=window.innerHeight-22;
    canvas.height=window.innerHeight-22;
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }

    initialize();

    render();
}
