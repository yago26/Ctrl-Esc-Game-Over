let yago;
let tamanho = 20;
const projeteis = [];

function setup() {
  createCanvas(400, 400);
  yago = new Personagem(
    width / 2 - tamanho / 2,
    height / 2 - tamanho / 2,
    tamanho,
    5
  );
}

function draw() {
  background(220);
  textAlign(LEFT, CENTER);
  text(`Tempo: ${(millis() / 1000).toFixed(2)}`, 20, 20);
  yago.mostrar();
  yago.mover();

  for (let projetil of projeteis) {
    projetil.mostrar();
    projetil.mover();
    if (
      projetil.x < 0 ||
      projetil.x > width ||
      projetil.y < 0 ||
      projetil.y > height
    ) {
      projeteis.splice(projeteis.indexOf(projetil), 1);
    }
  }
}

function mouseClicked() {
  let x = yago.x;
  let y = yago.y;
  x += map(mouseX > width ? width : mouseX, 0, width, -5, 30);
  y += map(mouseY > height ? height : mouseY, 0, height, -5, 30);

  let origem = createVector(x, y);
  let sentido = createVector(mouseX - origem.x, mouseY - origem.y);
  sentido.setMag(tamanho / 1.5); // Ajuste o tamanho da linha (arma)

  projeteis.push(
    new Projetil(origem.x + sentido.x, origem.y + sentido.y, sentido)
  );
}
