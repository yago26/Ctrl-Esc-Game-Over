class ArmaJogador extends Arma {
  constructor(dano) {
    super(dano, "orange");
  }

  mostrar(x, y) {
    push();
    this.origem = createVector(x + 32, y + 32);
    this.sentido = createVector(mouseX - this.origem.x, mouseY - this.origem.y);

    this.sentido.setMag(48); // Ajuste o tamanho da linha (arma)

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
