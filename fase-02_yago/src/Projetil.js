class Projetil {
  constructor(x, y, velocidade, cor) {
    this.x = x;
    this.y = y;
    this.velocidade = velocidade;
    this.cor = cor;
    this.visivel = true;
  }

  mostrar() {
    if (!this.visivel) return;
    push();
    fill(this.cor);
    circle(this.x, this.y, 16);
    pop();
  }

  mover() {
    this.x += this.velocidade.x;
    this.y += this.velocidade.y;
  }
}
