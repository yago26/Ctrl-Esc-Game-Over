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
let somSusto;
let somAmbiente;

function preload() {
  imagemFundo = loadImage("pixil-frame-0 (4).png");
  imagemPlat = loadImage("plat0.png");
  imagemPor = loadImage("porta.png")

  imagemEsquerda = loadImage("pixil-frame-0.png");
  imagemDireita = loadImage("luanao.png");

  imagemInimigo = loadImage("lucia.png");
  imagemProj = loadImage("projetil.png");

  somSusto = loadSound("grito_mujer9-86834.mp3");
  somAmbiente = loadSound("horror-spooky-piano-254402.mp3");
}

function draw() {
  if (tremorAtivo && !jogoEncerrado && !tremorBloqueado) {
    let deslocamentoX = random(-5, 5);
    let deslocamentoY = random(-5, 5);
    translate(deslocamentoX, deslocamentoY);
  }

  background(imagemFundo);
  for (let p of plataformas) p.mostrar();

  let plataformaPorta = plataformas.find(p => p.x === 0 && p.y === 20 && p.largura === 95);
  if (plataformaPorta) {
    if (
      jogador.x + jogador.largura >= plataformaPorta.x + plataformaPorta.largura + 90 && // Ajuste para verificar apenas o lado direito
      jogador.x + jogador.largura <= plataformaPorta.x + plataformaPorta.largura + 95 && // Pequena margem de erro
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
      return;
    }

  if (!jogoIniciado) {
    fill(255);
    textSize(30);
    textAlign(CENTER);
    text("", width / 2, height / 2);
    jogador.mostrar();
    inimigo.mostrar();
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
  if (!jogoIniciado) {
    jogoIniciado = true;
  }
  if (keyCode === LEFT_ARROW) {
    jogador.mover(-3);
  }
  if (keyCode === RIGHT_ARROW) {
    jogador.mover(3);
  }

  if (keyCode === UP_ARROW) jogador.pular();
}

function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) jogador.parar();
}

class Personagem {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.largura = 38;
    this.altura = 38;
    this.velocidadeX = 0;
    this.velocidadeY = 0;
    this.sprite = imagemEsquerda;
  }

  mover(direcao) {
    this.velocidadeX = direcao * 1.5;
    this.sprite = direcao > 0 ? imagemEsquerda : imagemDireita;
  }

  parar() {
    this.velocidadeX = 0;
  }

  pular() {
    this.velocidadeY = -4;
  }

  atualizar() {
    this.velocidadeY += gravidade;
    this.x = constrain(this.x + this.velocidadeX, 0, width - this.largura);
    this.y = constrain(this.y + this.velocidadeY, 0, height - this.altura);

    for (let p of plataformas) {
      if (colidir(this, p)) {
        // Verificação de colisão para cima
        if (this.y + this.altura > p.y && this.y < p.y) {
          this.y = p.y - this.altura;
          this.velocidadeY = 0;
        }
        // Verificação de colisão para baixo
        if (this.y < p.y + p.altura && this.y + this.altura > p.y + p.altura) {
          this.y = p.y + p.altura;
          this.velocidadeY = 0;
        }
        // Verificação de colisão para esquerda
        if (this.x + this.largura > p.x && this.x < p.x) {
          this.x = p.x - this.largura;
          this.velocidadeX = 0;
        }
        // Verificação de colisão para direita
        if (this.x < p.x + p.largura && this.x + this.largura > p.x + p.largura) {
          this.x = p.x + p.largura;
          this.velocidadeX = 0;
        }
      }
    }
  }


  mostrar() {
    image(this.sprite, this.x, this.y, this.largura, this.altura);
  }
}

class Inimigo extends Personagem {
  constructor(jogador, x) {
    super(x, jogador.y);
    this.jogador = jogador;
    this.largura = 50;
    this.altura = 50; 
  }

  seguirJogador() {
    if (jogador.velocidadeX !== 0) { 
      let direcao = this.jogador.x > this.x ? 2 : -2;
      this.mover(direcao);
    }
  }

  atirar() {
    if (this.velocidadeX !== 0 && frameCount % 60 === 0) {
      let angulo = atan2(this.jogador.y - this.y, this.jogador.x - this.x);
      let velocidadeX = cos(angulo) * 4;
      let velocidadeY = sin(angulo) * 4;
      projeteis.push(new Projetil(this.x, this.y, velocidadeX, velocidadeY));
    }
  }

  mostrar() {
    image(imagemInimigo, this.x, this.y, this.largura, this.altura);
  }
}

class Projetil {
  constructor(x, y, velocidadeX, velocidadeY) {
    this.x = x;
    this.y = y;
    this.largura = 10;
    this.altura = 10;
    this.velocidadeX = velocidadeX;
    this.velocidadeY = velocidadeY;
  }

  atualizar() {
    this.x += this.velocidadeX;
    this.y += this.velocidadeY;
  }

  mostrar() {
    image(imagemProj, this.x, this.y, this.largura, this.altura);
  }
}

class Plataforma {
  constructor(x, y, largura, altura, imagem = null) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.imagem = imagem;
  }

  mostrar() {
    if (this.imagem) {
      image(this.imagem, this.x, this.y, this.largura, this.altura);
    } else {
      fill(150);
      rect(this.x, this.y, this.largura, this.altura);
    }
  }
}

function colidir(a, b) {
  return a.x < b.x + b.largura && a.x + a.largura > b.x && a.y < b.y + b.altura && a.y + a.altura > b.y;
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
    somSusto.stop();  // Para o som após 2 segundos
  }, 2000);

  for (let p of plataformas) {
    if (p.x === 0 && p.y === 532.5) {
      p.largura = 860;
    }
  }
}