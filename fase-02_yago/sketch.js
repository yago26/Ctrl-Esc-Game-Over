let yago;
let tamanho = 32;
const projeteis = [];
let inimigos = [];
let fase = 0;
let variavelTemporarea = true;

function setup() {
  createCanvas(1080, 720);
  yago = new Personagem(
    width / 2 - tamanho / 2,
    height / 2 - tamanho / 2,
    tamanho,
    5
  );
}

function draw() {
  background(220);
  /* TELA DE MORTE */
  if (yago.vida <= 0) {
    push();
    textAlign(CENTER, CENTER);
    stroke("red");
    fill("red");
    textSize(32);
    text("Game Over", width / 2, height / 2);
    pop();
    return;
  }

  /* GERAÇÃO DE INIMIGOS */
  if (inimigos.length === 0 && variavelTemporarea) {
    variavelTemporarea = false;
    setTimeout(() => {
      fase++;
      switch (fase) {
        case 1:
          for (let i = 0; i < 8; i++) {
            inimigos.push(
              new Atirador(random(width - 32), random(height / 4), yago)
            );
          }
          break;
        case 2:
          for (let i = 0; i < 10; i++) {
            inimigos.push(
              new Atirador(random(width - 32), random(height / 4), yago)
            );
          }
          inimigos.push(
            new Guerreiro(width / 2 - width / 4, height / 3 - 48, yago)
          );
          inimigos.push(
            new Guerreiro(width / 2 + width / 4, height / 3 - 48, yago)
          );
          break;
        case 3:
          inimigos.push(new Boss());
          break;
      }
      variavelTemporarea = true;
    }, 1500);
  }

  /* FUNÇÕES BÁSICAS DO JOGADOR */
  yago.mostrar();
  yago.mover();

  for (let projetil of projeteis) {
    projetil.mostrar();
    projetil.mover();
    inimigos.forEach((inimigo) => {
      if (
        dist(inimigo.x, inimigo.y, projetil.x, projetil.y) <= inimigo.tamanho
      ) {
        inimigo.receberDano();
        if (inimigo.vida <= 0) {
          inimigos.splice(inimigos.indexOf(inimigo), 1);
        }
        projeteis.splice(projeteis.indexOf(projetil), 1);
      }
    });
    if (
      projetil.x < 0 ||
      projetil.x > width ||
      projetil.y < 0 ||
      projetil.y > height
    ) {
      projeteis.splice(projeteis.indexOf(projetil), 1);
    }
  }

  /* FUNÇÕES BÁSICAS DOS INIMIGOS */
  for (let inimigo of inimigos) {
    inimigo.mostrar();
    inimigo.mover();
    if (millis() - inimigo.periodo >= inimigo.periodoAtaque) {
      inimigo.atacar();
      inimigo.periodo = millis();
    }
  }

  /* DASH DO JOGADOR */
  if (yago.dash) {
    yago.periodo = millis();
  }

  textSize(18);
  textAlign(CENTER, CENTER);
  text("Dash", width - 40, height - 40);
  text(
    `${
      millis() - yago.periodo <= 10
        ? "true"
        : ((millis() - yago.periodo) / 1000).toFixed(1) + "s"
    }`,
    width - 40,
    height - 20
  );

  if (millis() - yago.periodo >= 500) {
    yago.periodo = millis();
    yago.dash = true;
  }

  /* BARRAS INFORMATIVAS */
  push();
  stroke(color(162, 255, 182));
  fill(color(162, 255, 182));
  rect(20, 20, map(yago.vida, 0, 5, 0, width / 4), 20);
  stroke("orange");
  fill("orange");
  rect(20, 60, map(yago.municao, 0, 10, 0, width / 4), 20);
  pop();
}

function mouseClicked() {
  /* ESQUEMA DE ATAQUE DO JOGADOR */
  if (yago.vida <= 0 || yago.municao <= 0) return;
  projeteis.push(
    new Projetil(
      yago.arma.origem.x + yago.arma.sentido.x,
      yago.arma.origem.y + yago.arma.sentido.y,
      { x: yago.arma.sentido.x / 2, y: yago.arma.sentido.y / 2 },
      "orange"
    )
  );
  yago.municao--;
}
