class ArmaInimiga extends Arma {
  constructor(dano, cor) {
    super(dano, cor);
  }

  mostrar(x, y, tamanho, jogador) {
    push();
    this.origem = createVector(x + tamanho / 2, y + tamanho / 2);
    this.sentido = createVector(
      jogador.x + jogador.tamanho / 2 - this.origem.x,
      jogador.y + jogador.tamanho / 2 - this.origem.y
    );

    this.sentido.setMag(tamanho); // Ajuste o tamanho da linha (arma)

    stroke(this.cor);
    strokeWeight(10);
    line(
      this.origem.x,
      this.origem.y,
      this.origem.x + this.sentido.x,
      this.origem.y + this.sentido.y
    );

    pop();
  }
}
