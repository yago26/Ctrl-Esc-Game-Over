class Projetil {
  constructor(x, y, velocidade) {
    this.x = x;
    this.y = y;
    this.velocidade = velocidade;
  }

  mostrar() {
    push();
    fill("red");
    circle(this.x, this.y, 10);
    pop();
  }

  mover() {
    this.x += this.velocidade.x;
    this.y += this.velocidade.y;
  }
}
