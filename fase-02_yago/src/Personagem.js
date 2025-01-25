class Personagem {
  constructor(x, y, tamanho, velocidade) {
    this.x = x;
    this.y = y;
    this.tamanho = tamanho;
    this.velocidade = velocidade;
    this.origem, this.sentido; // vetores das armas
    this.arma = new Arma(1);
    this.vida = 3;
  }

  mostrar() {
    square(this.x, this.y, this.tamanho);
    this.arma.mostrar(this.x, this.y, this.tamanho);
  }

  mover() {
    if (keyIsDown(87)) {
      // W
      if (this.y > 0) this.y -= this.velocidade;
    }
    if (keyIsDown(65)) {
      // A
      if (this.x > 0) this.x -= this.velocidade;
    }
    if (keyIsDown(83)) {
      // S
      if (this.y + this.tamanho < height) this.y += this.velocidade;
    }
    if (keyIsDown(68)) {
      // D
      if (this.x + this.tamanho < width) this.x += this.velocidade;
    }
  }
}
