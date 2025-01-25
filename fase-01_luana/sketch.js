let luanao;

function setup() {
  createCanvas(windowWidth, 400);
  luanao = new Personagem(20, height - 20, 5);
}

function draw() {
  background(220);
  luanao.mostrar();
  luanao.mover();
}
