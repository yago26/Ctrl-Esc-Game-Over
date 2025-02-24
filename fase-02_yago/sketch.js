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

/* SONS */
let trilhaSonora;
let somBossAntoin;
let somEstrondo;

/* OUTROS */
let tamanhoBarra = 20;

function preload() {
  fonte_technotribe = loadFont(
    "./assets/fontes/technotribe/technotribe-regular.otf"
  );
  fonte_simplyRounded = loadFont(
    "./assets/fontes/simply-rounded/Simply-Rounded-Bold.ttf"
  );
  trilhaSonora = loadSound("./assets/audios/geral/trilha-sonora.mp3");
  trilhaSonora.setVolume(0.1);
  somBossAntoin = loadSound("./assets/audios/inimigos/som-antoin.mp3");
  somBossAntoin.setVolume(0.3);
  somEstrondo = loadSound("./assets/audios/inimigos/som-estrondo.mp3");
  somEstrondo.setVolume(0.025);
}

let canvas;

function setup() {
  createCanvas(1000, 720);
  canvas = document.querySelector("canvas");
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
    canvas.style.cursor = "default";
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

    line(
      width / 2 - width / 4,
      height / 2 - height / 4.5,
      width / 2 + width / 4,
      height / 2 - height / 4.5
    );

    // TEXTO
    textFont(fonte_simplyRounded);

    fill("lightgray");
    stroke("lightgray");
    textSize(tamanhoTexto);
    text("Ctrl + Esc: Game Over", width / 2, height / 2 - height / 5);

    stroke("black");
    textSize(tamanhoTexto);
    text("© Copyright YJ, Yago Jordas", width / 2, height - tamanhoTexto * 2);

    noStroke();
    fill("black");
    textSize(tamanhoTexto + 2);
    text(
      "Pressione <ENTER> para iniciar...",
      width / 2,
      height / 2 + tamanhoTexto
    );

    if (keyIsDown(13)) {
      // CASO ENTER FOR PRESSIONADO
      jogoIniciado = true;
      canvas.style.cursor = "none";
      trilhaSonora.loop();
    }
    pop();
    return;
  }

  if (jogoZerado) {
    /* TELA DE VITÓRIA */
    push();
    textSize(tamanhoTitulo);
    textFont(fonte_technotribe);
    text("Zerouuuu", width / 2, height / 2);
    pop();
    setTimeout(() => {
      window.location = "../fase-03_apollo/index.html";
    }, 5000);
    return;
  }

  // TREMOR ATAQUE ESPECIAL BOSS
  if (inimigos[0] && jogador.vida >= 0) {
    if (inimigos[0].hasOwnProperty("ataquesEspeciais")) {
      if (inimigos[0].ataquesEspeciais.geral) {
        let deslocamentoX = random(-8, 8);
        let deslocamentoY = random(-8, 8);
        translate(deslocamentoX, deslocamentoY);
        somEstrondo.play();
      }
    }
  }

  if (jogador.vida > 0) {
    /* BARRAS INFORMATIVAS */
    push();
    textAlign(CENTER, CENTER);
    textFont(fonte_technotribe);
    textAlign(LEFT, TOP);

    translate(0, tamanhoBarra);

    // VIDA
    textSize(tamanhoTexto);
    fill(color(162, 255, 182));
    stroke("black");
    text(`HP`, width - tamanhoBarra * 2, height / 2);
    textSize(tamanhoTexto - 4);
    text(
      `${jogador.vida}/10`,
      width - tamanhoBarra * (jogador.vida < 10 ? 2 : 2.25),
      height / 2 + tamanhoBarra
    );

    stroke(color(162, 255, 182));
    rect(
      width - tamanhoBarra * 2,
      height / 2 + tamanhoBarra * 3,
      tamanhoBarra,
      map(jogador.vida, 0, 10, 0, height / 4)
    );

    // MUNIÇÃO
    textSize(tamanhoTexto);
    fill("orange");
    stroke("black");
    text(`MP`, width - tamanhoBarra * 4.25, height / 2);
    textSize(tamanhoTexto - 4);
    text(
      `${jogador.municao === 0 ? "..." : jogador.municao + "/10"}`,
      width - tamanhoBarra * (jogador.municao < 10 ? 4.25 : 4.5),
      height / 2 + tamanhoBarra
    );

    stroke("orange");
    rect(
      width - tamanhoBarra * 4,
      height / 2 + tamanhoBarra * 3,
      tamanhoBarra,
      map(jogador.municao, 0, 10, 0, height / 4)
    );

    pop();

    /* DASH DO JOGADOR */
    if (jogador.dash.geral) {
      jogador.cooldown_dash = millis();
    }

    push();
    textSize(18);
    textFont(fonte_simplyRounded);
    text("Dash", width - tamanhoBarra * 2.5, height - tamanhoBarra * 3);
    text(
      `${
        millis() - jogador.cooldown_dash <= 10
          ? "true"
          : ((millis() - jogador.cooldown_dash) / 1000).toFixed(1) + "s"
      }`,
      width - tamanhoBarra * 2.5,
      height - tamanhoBarra * 2
    );
    push();

    if (millis() - jogador.cooldown_dash >= 500) {
      jogador.cooldown_dash = millis();
      jogador.dash.geral = true;
    }
  }

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
            new Perseguidor(width / 2 - width / 4, height / 3 - 48, jogador)
          );
          inimigos.push(new Perseguidor(width / 2, height / 3 - 48, jogador));
          inimigos.push(
            new Perseguidor(width / 2 + width / 4, height / 3 - 48, jogador)
          );
          break;
        case 3:
          inimigos.push(new Boss(width / 2, height / 2, jogador));
          somBossAntoin.loop();
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
  let inimigosRemover;
  let projeteisRemover = [];
  for (let projetil of projeteis) {
    projetil.mostrar();
    projetil.mover();
    inimigosRemover = [];
    inimigos.forEach((inimigo) => {
      if (
        colisaoCirculoRetangulo(
          projetil.x,
          projetil.y,
          projetil.raio,
          inimigo.x + (inimigo.tamanho - inimigo.tamanhoColisao.w) / 2,
          inimigo.y,
          inimigo.tamanhoColisao.w,
          inimigo.tamanhoColisao.h
        )
      ) {
        inimigo.receberDano();
        if (inimigo.vida <= 0) {
          inimigosRemover.push(inimigo);
          if (inimigo.hasOwnProperty("ataquesEspeciais")) {
            somBossAntoin.stop();
          }
        }
        projeteisRemover.push(projetil);
      }
    });
    // Remover inimigos após a iteração
    for (let inimigo of inimigosRemover) {
      inimigos.splice(inimigos.indexOf(inimigo), 1);
    }
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

  if (jogador.vida > 0) {
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

  if (jogador.vida <= 0) {
    /* TELA DE MORTE */
    if (jogador.vida === 0) {
      jogador.audios.perdeu.play();
      jogador.vida--;
    }
    trilhaSonora.stop();
    somBossAntoin.stop();

    canvas.style.cursor = "default";
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
      canvas.style.cursor = "none";
      trilhaSonora.loop();
    }
    pop();
  }
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
  jogador.audios.projetil.play();
  jogador.municao--;
}

function keyPressed() {
  if (keyIsDown(SHIFT)) {
    if (keyIsDown(49)) {
      inimigos = [];
      fase = 0;
    }
    if (keyIsDown(50)) {
      inimigos = [];
      fase = 1;
    }
    if (keyIsDown(51)) {
      inimigos = [];
      fase = 2;
    }
    if (keyIsDown(52)) {
      inimigos = [];
      fase = 3;
    }
    if (keyIsDown(53)) {
      window.location = "../fase-03_apollo/index.html";
    }
  }
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

function colisaoCirculoRetangulo(
  circuloPosX,
  circuloPosY,
  circuloRaio,
  retanguloPosX,
  retanguloPosY,
  retanguloLargura,
  retanguloAltura
) {
  // Encontrar o ponto mais próximo do círculo dentro do retângulo
  let closestX = constrain(
    circuloPosX,
    retanguloPosX,
    retanguloPosX + retanguloLargura
  );
  let closestY = constrain(
    circuloPosY,
    retanguloPosY,
    retanguloPosY + retanguloAltura
  );

  // Calcular a distância entre o ponto mais próximo e o centro do círculo
  let distancia = dist(circuloPosX, circuloPosY, closestX, closestY);

  // Se a distância for menor ou igual ao raio, há colisão
  return distancia <= circuloRaio;
}
