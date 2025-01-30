let luanao;
let lucia;
let tela;

function setup() {
  createCanvas(1080, 720);
  tela = new Tela();
  luanao = new Personagem();
  lucia = new Inimigo(luanao);
}

function draw() {
  background(220);
  // tela e obstáculos
  tela.mostrar();
  // player
  luanao.mostrar();
  luanao.mover();
  // inimigo
  lucia.mostrar();
  lucia.mover();
}
