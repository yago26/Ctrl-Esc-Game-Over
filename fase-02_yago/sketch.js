// VARIÁVEIS
let iniciar = false;
let jogador;
const tamanho = 64;
let projeteis = [];
let inimigos = [];
let fase = 0;
let cooldown_gerarInimigos = true;

function setup() {
  createCanvas(1080, 720);
  jogador = new Jogador(
    width / 2 - tamanho / 2,
    height / 2 - tamanho / 2,
    tamanho,
    5
  );
  noSmooth();
  textAlign(CENTER, CENTER);
}

function draw() {
  background(245);
  if (!iniciar) {
    push();
    fill("purple");
    stroke("purple");
    strokeWeight(2);
    textSize(32);
    text("...", width / 2, height / 2);

    fill("black");
    noStroke();
    textSize(16);
    text("Pressione <ENTER> para iniciar...", width / 2, height / 2 + 40);
    if (keyIsDown(13)) {
      iniciar = true;
    }
    pop();
    return;
  }

  if (jogador.vida <= 0) {
    /* TELA DE MORTE */
    document.body.style.cursor = "default";
    push();
    fill(220);
    noStroke();
    rect(width / 4, height / 4, width / 2, height / 2 + 40);
    fill("purple");
    stroke("purple");
    strokeWeight(2);
    textSize(32);
    text("Game Over", width / 2, height / 2);

    fill("black");
    noStroke();
    textSize(16);
    text("Pressione <ENTER> para reiniciar...", width / 2, height / 2 + 40);
    if (keyIsDown(13)) {
      reiniciar();
    }
    pop();
    return;
  }

  /* MANIPULAÇÃO DA DISPOSIÇÃO DO CURSOR */
  document.body.style.cursor =
    mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height
      ? "none"
      : "default";

  /* FUNÇÕES BÁSICAS DO JOGADOR */
  jogador.mostrar();
  jogador.mover();

  /* GERAÇÃO DE INIMIGOS */
  if (inimigos.length === 0 && cooldown_gerarInimigos) {
    cooldown_gerarInimigos = false;
    setTimeout(() => {
      jogador.vida = 10;
      jogador.municao = 10;
      fase++;
      switch (fase) {
        case 1:
          for (let i = 0; i < 8; i++) {
            inimigos.push(
              new Atirador(random(width - 32), random(height / 4), jogador)
            );
          }
          break;
        case 2:
          for (let i = 0; i < 5; i++) {
            inimigos.push(
              new Atirador(random(width - 32), random(height / 4), jogador)
            );
          }
          inimigos.push(
            new Guerreiro(width / 2 - width / 4, height / 3 - 48, jogador)
          );
          inimigos.push(
            new Guerreiro(width / 2 + width / 4, height / 3 - 48, jogador)
          );
          break;
        case 3:
          inimigos.push(new Boss(width / 2, height / 2, jogador));
          break;
        default:
      }
      cooldown_gerarInimigos = true;
    }, 1500);
  }

  let projeteisRemover = [];
  for (let projetil of projeteis) {
    projetil.mostrar();
    projetil.mover();
    inimigos.forEach((inimigo) => {
      if (
        dist(inimigo.x + 24, inimigo.y + 32, projetil.x, projetil.y) <=
        inimigo.tamanho + 8 /* raio da bala */
      ) {
        inimigo.receberDano();
        if (inimigo.vida <= 0) {
          inimigos.splice(inimigos.indexOf(inimigo), 1);
        }
        projeteisRemover.push(projetil);
      }
    });
    if (
      projetil.x < 0 ||
      projetil.x > width ||
      projetil.y < 0 ||
      projetil.y > height
    ) {
      projeteisRemover.push(projetil);
    }
  }

  // Remover projéteis após a iteração
  for (let projetil of projeteisRemover) {
    projeteis.splice(projeteis.indexOf(projetil), 1);
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
  if (jogador.dash) {
    jogador.periodo = millis();
  }

  textSize(18);
  text("Dash", width - 40, height - 40);
  text(
    `${
      millis() - jogador.periodo <= 10
        ? "true"
        : ((millis() - jogador.periodo) / 1000).toFixed(1) + "s"
    }`,
    width - 40,
    height - 20
  );

  if (millis() - jogador.periodo >= 500) {
    jogador.periodo = millis();
    jogador.dash = true;
  }

  /* BARRAS INFORMATIVAS */
  push();
  // VIDA
  stroke(color(162, 255, 182));
  fill(color(162, 255, 182));
  rect(20, height - 80, map(jogador.vida, 0, 10, 0, width / 4), 20);
  // MUNIÇÃO
  stroke("orange");
  fill("orange");
  rect(20, height - 40, map(jogador.municao, 0, 10, 0, width / 4), 20);
  pop();

  /* MIRA */
  push();
  fill(255, 50, 50);
  stroke(255, 50, 50);
  // Bolinha central
  circle(mouseX, mouseY, 5);

  noFill();
  strokeWeight(3);
  stroke("purple");
  // Bolinha externa
  circle(mouseX, mouseY, 25);
  // linhas horizontais
  line(mouseX - 20, mouseY, mouseX - 8, mouseY);
  line(mouseX + 20, mouseY, mouseX + 8, mouseY);
  // linhas verticais
  line(mouseX, mouseY - 20, mouseX, mouseY - 8);
  line(mouseX, mouseY + 20, mouseX, mouseY + 8);
  pop();
}

function mouseClicked() {
  /* ESQUEMA DE ATAQUE DO JOGADOR */
  if (jogador.vida <= 0 || jogador.municao <= 0) return;
  projeteis.push(
    new Projetil(
      jogador.arma.origem.x + jogador.arma.sentido.x,
      jogador.arma.origem.y + jogador.arma.sentido.y,
      { x: jogador.arma.sentido.x / 2, y: jogador.arma.sentido.y / 2 },
      "orange"
    )
  );
  jogador.municao--;
}

function reiniciar() {
  jogador = jogador = new Jogador(
    width / 2 - tamanho / 2,
    height / 2 - tamanho / 2,
    tamanho,
    5
  );
  fase = 0;
  inimigos = [];
  projeteis = [];
}
