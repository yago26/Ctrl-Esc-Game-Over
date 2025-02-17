// VARIÁVEIS DE CONTROLE
let jogoIniciado = false;
let jogoZerado = false;

/* VARIÁVEIS DO JOGADOR */
let jogador;
let projeteis = [];
const tamanho = 64;

/* VARIÁVEIS DOS INIMIGOS */
let inimigos = [];
let cooldown_gerarInimigos = false;
let fase = 0;

/* IMPORTAÇÕES */
// fontes
let fonte_technotribe;
let fonte_simplyRounded;
let tamanhoTitulo = 48;
let tamanhoTexto = 16;

function preload() {
  fonte_technotribe = loadFont(
    "./assets/fontes/technotribe/technotribe-regular.otf"
  );
  fonte_simplyRounded = loadFont(
    "./assets/fontes/simply-rounded/Simply-Rounded-Bold.ttf"
  );
}

function setup() {
  createCanvas(1000, 720);
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
  if (!jogoIniciado) {
    /* TELA INICIAL */
    document.querySelector("canvas").style.cursor = "default";
    push();
    // TÍTULO
    textFont(fonte_technotribe);

    fill("white");
    stroke("black");
    textSize(tamanhoTitulo);
    text("DESAFIO DE", width / 2, tamanhoTitulo * 2);

    fill("purple");
    textSize(tamanhoTitulo + 10);
    text("PROGRAMAÇÃO", width / 2, tamanhoTitulo * 3);

    // TEXTO
    textFont(fonte_simplyRounded);

    noStroke();
    fill("black");
    textSize(tamanhoTexto);
    text(
      "Pressione <ENTER> para iniciar...",
      width / 2,
      height / 2 + tamanhoTexto
    );

    if (keyIsDown(13)) {
      // CASO ENTER FOR PRESSIONADO
      jogoIniciado = true;
      document.querySelector("canvas").style.cursor = "none";
    }
    pop();
    return;
  }

  if (jogador.vida <= 0) {
    /* TELA DE MORTE */
    document.body.style.cursor = "default";
    push();

    // TÍTULO
    textFont(fonte_technotribe);
    stroke("black");
    fill("purple");
    textSize(tamanhoTitulo);
    text("GAME OVER", width / 2, height / 2 - tamanhoTitulo);

    // TEXTO
    textFont(fonte_simplyRounded);
    noStroke();
    fill("black");
    textSize(tamanhoTexto);
    text(
      "Pressione <ENTER> para reiniciar...",
      width / 2,
      height / 2 + tamanhoTexto
    );

    if (keyIsDown(13)) {
      reiniciar();
    }
    pop();
    return;
  }

  if (jogoZerado) {
    push();
    textFont(fonte_technotribe);
    text("Zerouuuu", width / 2, height / 2);
    pop();
    return;
  }

  /* BARRAS INFORMATIVAS */
  push();
  textFont(fonte_technotribe);
  textAlign(LEFT, TOP);

  rect(0, height - 100, width / 4 + 40, 100);

  // VIDA
  fill(color(162, 255, 182));
  stroke("black");
  text(`HP ${jogador.vida}/10`, 20, height - 80);

  stroke(color(162, 255, 182));
  rect(110, height - 80, map(jogador.vida, 0, 10, 0, width / 4 - 90), 20);

  // MUNIÇÃO
  fill("orange");
  stroke("black");
  text(
    `MP ${jogador.municao === 0 ? "recarregando..." : jogador.municao + "/10"}`,
    20,
    height - 40
  );

  stroke("orange");
  rect(110, height - 40, map(jogador.municao, 0, 10, 0, width / 4 - 90), 20);

  pop();

  /* FUNÇÕES BÁSICAS DO JOGADOR */
  jogador.mostrar();
  jogador.mover();

  /* GERAÇÃO DE INIMIGOS */
  if (inimigos.length === 0 && !cooldown_gerarInimigos) {
    cooldown_gerarInimigos = true;
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
          jogoZerado = true;
          break;
      }
      cooldown_gerarInimigos = false;
    }, 2500);
  }

  // TÍTULOS DAS FASES
  if (cooldown_gerarInimigos) {
    push();
    // AVISO DE SALVAMENTO DE PROGRESSO
    textFont(fonte_simplyRounded);
    textAlign(LEFT, CENTER);
    text("Salvando progresso...", 20, 20);

    // CONFIGURAÇÕES DOS TÍTULOS
    textAlign(CENTER, CENTER);
    textSize(tamanhoTitulo);
    textFont(fonte_technotribe);
    stroke("black");
    switch (fase) {
      case 0:
        fill("yellow");
        text("Fase 1/3: Atiradores", width / 2, height / 2 - tamanhoTitulo);
        break;
      case 1:
        fill("orange");
        text(
          "Fase 2/3: Atiradores e Perseguidores",
          width / 2,
          height / 2 - tamanhoTitulo
        );
        break;
      case 2:
        fill("red");
        text("Fase 3/3: Chefão Antôin", width / 2, height / 2 - tamanhoTitulo);
        break;
    }
    pop();
  }

  /* ATAQUE AO INIMIGO */
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
    if (millis() - inimigo.cronometro_ultimoAtaque >= inimigo.cooldown_atacar) {
      inimigo.atacar();
      inimigo.cronometro_ultimoAtaque = millis();
    }
  }

  /* DASH DO JOGADOR */
  if (jogador.dash.geral) {
    jogador.cooldown_dash = millis();
  }

  push();
  textSize(18);
  textFont(fonte_simplyRounded);
  text("Dash", width - 40, height - 40);
  text(
    `${
      millis() - jogador.cooldown_dash <= 10
        ? "true"
        : ((millis() - jogador.cooldown_dash) / 1000).toFixed(1) + "s"
    }`,
    width - 40,
    height - 20
  );
  push();

  if (millis() - jogador.cooldown_dash >= 500) {
    jogador.cooldown_dash = millis();
    jogador.dash.geral = true;
  }

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
  fase = fase - 1;
  inimigos = [];
  projeteis = [];
}
