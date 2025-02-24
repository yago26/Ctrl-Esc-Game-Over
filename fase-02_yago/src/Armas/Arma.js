class Arma {
  constructor(dano, cor) {
    this.origem;
    this.sentido;
    this.dano = dano;
    this.cor = cor;
    this.projeteis = [];
  }

  mostrar(x, y, tamanho, jogador = null, inimigo = false) {
    push();
    this.origem = createVector(x + tamanho / 2, y + tamanho / 2);
    if (!inimigo) {
      this.sentido = createVector(
        mouseX - this.origem.x,
        mouseY - this.origem.y
      );
    } else {
      this.sentido = createVector(
        jogador.x + jogador.tamanho / 2 - this.origem.x,
        jogador.y + jogador.tamanho / 2 - this.origem.y
      );
    }

    this.sentido.setMag(tamanho / 1.25); // Ajuste o tamanho da linha (arma)

    stroke(this.cor);
    strokeWeight(tamanho / 6);
    line(
      this.origem.x,
      this.origem.y,
      this.origem.x + this.sentido.x,
      this.origem.y + this.sentido.y
    );

    pop();
  }
}
