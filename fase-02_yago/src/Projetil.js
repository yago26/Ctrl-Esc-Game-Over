class Projetil {
  constructor(x, y, velocidade, cor) {
    this.x = x;
    this.y = y;
    this.velocidade = velocidade;
    this.cor = cor;
    this.visivel = true;
    this.raio = 16;
  }

  mostrar() {
    if (!this.visivel) return;
    push();
    fill(this.cor);
    circle(this.x, this.y, this.raio);
    pop();
  }

  mover() {
    this.x += this.velocidade.x;
    this.y += this.velocidade.y;
  }
}
