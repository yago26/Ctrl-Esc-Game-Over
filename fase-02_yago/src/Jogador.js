class Jogador {
  constructor(x, y, tamanho, velocidade) {
    this.x = x;
    this.y = y;
    this.tamanho = tamanho;
    this.velocidade = velocidade;

    this.vida = 10;
    this.tamanhoColisao = 48;

    this.arma = new ArmaJogador(1);
    this.origem, this.sentido; // vetores das armas
    this.municao = 10;
    this.recarregando = false;

    this.dash = {
      geral: true,
      cima: false,
      direita: false,
      baixo: false,
      esquerda: false,
    };
    this.velocidadeDash = {
      fixa: 16,
      variavel: 0,
    };
    this.freioDash = 2;
    this.cooldown_dash = millis();

    this.caminhos = {
      frente: loadImage("./assets/imagens/jogador/yago-frente.png"),
      direita: loadImage("./assets/imagens/jogador/yago-direita.png"),
      esquerda: loadImage("./assets/imagens/jogador/yago-esquerda.png"),
      costas: loadImage("./assets/imagens/jogador/yago-costas.png"),
      /* Dano */
      direitaDano: loadImage("./assets/imagens/jogador/yago-direita-dano.png"),
      esquerdaDano: loadImage("./assets/imagens/jogador/yago-esquerda-dano.png"),
    };
    this.img = this.caminhos.frente;
  }

  mostrar() {
    if (this.vida <= 0) return;
    push();
    image(this.img, this.x, this.y, 64, 64);
    pop();
    this.arma.mostrar(this.x, this.y, this.tamanho);
    if (this.municao <= 0 && !this.recarregando) {
      setTimeout(() => {
        this.municao = 10;
        this.recarregando = false;
      }, 2500);
      this.recarregando = true;
    }
  }

  mover() {
    if (this.vida <= 0) return;
    // EXECUÇÃO DO DASH
    if (!this.dash.geral) {
      if (this.dash.cima) {
        // P/ CIMA
        if (this.velocidadeDash.variavel >= 0) {
          this.dash.cima = false;
        }
        this.y += this.velocidadeDash.variavel;
        this.velocidadeDash.variavel += this.freioDash;
        if (this.y < 0) this.y = 0;
      }
      if (this.dash.esquerda) {
        // P/ ESQUERDA
        if (this.velocidadeDash.variavel >= 0) {
          this.dash.esquerda = false;
        }
        this.x += this.velocidadeDash.variavel;
        this.velocidadeDash.variavel += this.freioDash;
        if (this.x < 0) this.x = 0;
      }
      if (this.dash.baixo) {
        // P/ BAIXO
        if (this.velocidadeDash.variavel <= 0) {
          this.dash.baixo = false;
        }
        this.y += this.velocidadeDash.variavel;
        this.velocidadeDash.variavel -= this.freioDash;
        if (this.y + this.tamanho > height) this.y = height - this.tamanho;
      }
      if (this.dash.direita) {
        // P/ DIREITA
        if (this.velocidadeDash.variavel <= 0) {
          this.dash.direita = false;
        }
        this.x += this.velocidadeDash.variavel;
        this.velocidadeDash.variavel -= this.freioDash;
        if (this.x + this.tamanho > width) this.x = width - this.tamanho;
      }
    }

    if (keyIsDown(87) || keyIsDown(38)) {
      // W ou ARROW_UP
      if (keyIsDown(32) && this.dash.geral) {
        this.dash.geral = false;
        this.dash.cima = true;
        this.velocidadeDash.variavel = -this.velocidadeDash.fixa;
      }
      if (this.y > 0) {
        this.y -= this.velocidade;
        this.img = this.caminhos.costas;
      }
      if (this.y < 0) this.y = 0;
    }
    if (keyIsDown(65) || keyIsDown(37)) {
      // A ou ARROW_LEFT
      if (keyIsDown(32) && this.dash.geral) {
        this.dash.geral = false;
        this.dash.esquerda = true;
        this.velocidadeDash.variavel = -this.velocidadeDash.fixa;
      }
      if (this.x > 0) {
        this.x -= this.velocidade;
        this.img = this.caminhos.esquerda;
      }
      if (this.x < 0) this.x = 0;
    }
    if (keyIsDown(83) || keyIsDown(40)) {
      // S ou ARROW_DOWN
      if (keyIsDown(32) && this.dash.geral) {
        this.dash.geral = false;
        this.dash.baixo = true;
        this.velocidadeDash.variavel = this.velocidadeDash.fixa;
      }
      if (this.y + this.tamanho < height) {
        this.y += this.velocidade;
        this.img = this.caminhos.frente;
      }
      if (this.y + this.tamanho > height) this.y = height - this.tamanho;
    }
    if (keyIsDown(68) || keyIsDown(39)) {
      // D ou ARROW_RIGHT
      if (keyIsDown(32) && this.dash.geral) {
        this.dash.geral = false;
        this.dash.direita = true;
        this.velocidadeDash.variavel = this.velocidadeDash.fixa;
      }
      if (this.x + this.tamanho < width) {
        this.x += this.velocidade;
        this.img = this.caminhos.direita;
      }
      if (this.x + this.tamanho > width) this.x = width - this.tamanho;
    }
  }

  receberDano() {
    this.vida--;
    this.cor = "red";
    setTimeout(() => {
      this.cor = "white";
    }, 100);
  }
}
