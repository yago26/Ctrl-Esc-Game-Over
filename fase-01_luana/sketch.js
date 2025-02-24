let jogador, inimigo;
let gravidade = 0.12;
let plataformas = [];
let jogoEncerrado = false;
let tempoJogoEncerrado = 0;
let jogoIniciado = false;
let projeteis = [];
let tremorAtivo = false;
let tempoTremor = 0;
let duracaoTremor = 120;
let tremorBloqueado = false;
let jogoVencido = false;

function setup() {
  let tela = createCanvas(1000, 720);
  tela.position((windowWidth - width) / 2, (windowHeight - height) / 2);
  jogador = new Personagem(100, 670);
  inimigo = new Inimigo(jogador, 50);

  plataformas.push(new Plataforma(0, 699, 1000, 20));
  plataformas.push(new Plataforma(900, 599, 100, 100, imagemPlat));
  plataformas.push(new Plataforma(0, 177.5, 860, 20));
  plataformas.push(new Plataforma(900, 260, 100, 100, imagemPlat));
  plataformas.push(new Plataforma(140, 355, 860, 20));
  plataformas.push(new Plataforma(0, 439, 100, 100, imagemPlat));
  plataformas.push(new Plataforma(0, 532.5, 860, 20));
  plataformas.push(new Plataforma(250, 265, 100, 90, imagemPlat));
  plataformas.push(new Plataforma(600, 265, 100, 90, imagemPlat));
  plataformas.push(new Plataforma(200, 80, 100, 96, imagemPlat));
  plataformas.push(new Plataforma(400, 442, 100, 90, imagemPlat));
  plataformas.push(new Plataforma(500, 87, 100, 90, imagemPlat));
  plataformas.push(new Plataforma(0, 20, 95, 155, imagemPor)); //porta

  somAmbiente.loop();
  somAmbiente.setVolume(1.0);
}

let imagemFundo;
let imagemPlat;
let imagemPor;
let imagemProj;
let somSusto;
let somAmbiente;

function preload() {
  imagemFundo = loadImage("./assets/sprites/cenario/fundo.png");
  imagemPlat = loadImage("./assets/sprites/cenario/estante.png");
  imagemPor = loadImage("./assets/sprites/cenario/porta.png");

  imagemEsquerda = loadImage("./assets/sprites/jogador/luanao-esquerda.png");
  imagemDireita = loadImage("./assets/sprites/jogador/luanao-direita.png");

  imagemInimigo = loadImage("./assets/sprites/inimigo/lucia.png");
  imagemProj = loadImage("./assets/sprites/inimigo/projetil.png");

  somSusto = loadSound("./assets/audios/grito_mujer9-86834.mp3");
  somAmbiente = loadSound("./assets/audios/horror-spooky-piano-254402.mp3");
}

function draw() {
  if (tremorAtivo && !jogoEncerrado && !tremorBloqueado) {
    let deslocamentoX = random(-5, 5);
    let deslocamentoY = random(-5, 5);
    translate(deslocamentoX, deslocamentoY);
  }

  background(imagemFundo);

  for (let p of plataformas) p.mostrar();

  let plataformaPorta = plataformas.find(
    (p) => p.x === 0 && p.y === 20 && p.largura === 95
  );
  if (plataformaPorta) {
    if (
      jogador.x + jogador.largura >=
        plataformaPorta.x + plataformaPorta.largura + 90 && // Ajuste para verificar apenas o lado direito
      jogador.x + jogador.largura <=
        plataformaPorta.x + plataformaPorta.largura + 95 && // Pequena margem de erro
      jogador.y + jogador.altura > plataformaPorta.y &&
      jogador.y < plataformaPorta.y + plataformaPorta.altura
    ) {
      jogoVencido = true;
    }
  }
  if (jogoVencido) {
    fill(255);
    textSize(30);
    textAlign(CENTER);
    text("VOCÊ VENCEU, QUE ARRASOOO!", width / 2, height / 2);
    noLoop();
    setTimeout(() => {
      window.location = "../fase-02_yago/index.html";
    }, 5000);
    return;
  }

  if (!jogoIniciado) {
    push();
    textAlign(CENTER, CENTER);
    fill("white");
    stroke("black");
    textSize(48);
    text("BATALHA", width / 2, 48 * 2);

    fill("brown");
    textSize(58);
    text("LITERÁRIA", width / 2, 48 * 3);

    fill("black");
    stroke("black");
    textSize(16);
    text("Pressione <ENTER> para iniciar...", width / 2, height / 2 + 16);

    if (keyIsDown(13)) {
      jogoIniciado = true;
    }
    pop();
    return;
  } else if (!jogoEncerrado) {
    jogador.atualizar();
    jogador.mostrar();
    inimigo.seguirJogador();
    inimigo.atualizar();
    inimigo.mostrar();
    inimigo.atirar();

    for (let proj of projeteis) {
      proj.atualizar();
      proj.mostrar();

      if (colidir(proj, jogador)) {
        if (!jogoEncerrado) {
          somSusto.play();
        }
        jogoEncerrado = true;
        tempoJogoEncerrado = millis();
        tremorAtivo = false;
      }
    }
    for (let p of plataformas) {
      if (p.x === 0 && p.y === 532.5 && p.largura === 860) {
        if (
          jogador.y + jogador.altura >= p.y &&
          jogador.y + jogador.altura <= p.y + 5 &&
          jogador.x + jogador.largura > p.x &&
          jogador.x < p.x + p.largura
        ) {
          p.largura = 1000;
          tremorAtivo = true;
          tempoTremor = frameCount;
        }
      }
    }
    for (let p of plataformas) {
      if (p.x === 400 && p.y === 442) {
        if (
          jogador.y + jogador.altura >= p.y &&
          jogador.y + jogador.altura <= p.y + 5 &&
          jogador.x + jogador.largura > p.x &&
          jogador.x < p.x + p.largura
        ) {
          tremorBloqueado = true;
          tremorAtivo = false;
        }
      }
    }
    // Parar o tremor após 2 segundos
    if (tremorAtivo && frameCount - tempoTremor > duracaoTremor) {
      tremorAtivo = false;
    }
  } else {
    fill(255);
    textSize(30);
    textAlign(CENTER);
    text("Luciona te destruiu!", width / 2, height / 2);
    if (millis() - tempoJogoEncerrado > 1000 && !somSusto.isPlaying()) {
      somSusto.play();
    }
    if (millis() - tempoJogoEncerrado > 1000) {
      reiniciarJogo();
    }
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW || keyCode === 65) {
    jogador.mover(-3);
  }
  if (keyCode === RIGHT_ARROW || keyCode === 68) {
    jogador.mover(3);
  }

  if (keyCode === UP_ARROW || keyCode === 87) jogador.pular();
}

function keyReleased() {
  if (
    keyCode === LEFT_ARROW ||
    keyCode === 65 ||
    keyCode === RIGHT_ARROW ||
    keyCode === 68
  )
    jogador.parar();
}

function colidir(a, b) {
  return (
    a.x < b.x + b.largura &&
    a.x + a.largura > b.x &&
    a.y < b.y + b.altura &&
    a.y + a.altura > b.y
  );
}

function reiniciarJogo() {
  jogoEncerrado = false;
  jogoIniciado = true;
  jogador = new Personagem(100, 670);
  inimigo = new Inimigo(jogador, 50);
  projeteis = [];
  tremorAtivo = false;
  tremorBloqueado = false;

  somAmbiente.play();
  setTimeout(() => {
    somSusto.stop(); // Para o som após 2 segundos
  }, 2000);

  for (let p of plataformas) {
    if (p.x === 0 && p.y === 532.5) {
      p.largura = 860;
    }
  }
}
