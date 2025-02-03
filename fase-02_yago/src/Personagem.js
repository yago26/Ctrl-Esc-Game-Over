class Personagem {
  constructor(x, y, tamanho, velocidade) {
    this.x = x;
    this.y = y;
    this.tamanho = tamanho;
    this.velocidade = velocidade;
    this.origem, this.sentido; // vetores das armas
    this.arma = new ArmaPersonagem(1);
    this.vida = 5;
    this.dash = true;
    this.periodo = millis();
    this.cor = "white";
    this.municao = 10;
    this.recarregando = false;
  }

  mostrar() {
    if (this.vida <= 0) return;
    push();
    fill(this.cor);
    square(this.x, this.y, this.tamanho);
    pop();
    this.arma.mostrar(this.x, this.y, this.tamanho);
    if (yago.municao <= 0 && !this.recarregando) {
      setTimeout(() => {
        this.municao = 10;
        this.recarregando = false;
      }, "2500");
      this.recarregando = true;
    }
  }

  mover() {
    if (this.vida <= 0) return;
    if (keyIsDown(87)) {
      // W
      let velocidade = this.velocidade;
      if (keyIsDown(32) && this.dash) {
        velocidade *= 10;
        this.dash = false;
      }
      if (this.y > 0) this.y -= velocidade;
      if (this.y < 0) this.y = 0;
    }
    if (keyIsDown(65)) {
      // A
      let velocidade = this.velocidade;
      if (keyIsDown(32) && this.dash) {
        velocidade *= 10;
        this.dash = false;
      }
      if (this.x > 0) this.x -= velocidade;
      if (this.x < 0) this.x = 0;
    }
    if (keyIsDown(83)) {
      // S
      let velocidade = this.velocidade;
      if (keyIsDown(32) && this.dash) {
        velocidade *= 10;
        this.dash = false;
      }
      if (this.y + this.tamanho < height) this.y += velocidade;
      if (this.y + this.tamanho > height) this.y = height - this.tamanho;
    }
    if (keyIsDown(68)) {
      // D
      let velocidade = this.velocidade;
      if (keyIsDown(32) && this.dash) {
        velocidade *= 10;
        this.dash = false;
      }
      if (this.x + this.tamanho < width) this.x += velocidade;
      if (this.x + this.tamanho > width) this.x = width - this.tamanho;
    }
  }

  receberDano() {
    this.vida--;
    this.cor = "red";
    setTimeout(() => {
      this.cor = "white";
    }, "100");
  }
}
