class Arma {
  constructor(dano, cor) {
    this.origem;
    this.sentido;
    this.dano = dano;
    this.cor = cor;
    this.projeteis = [];
  }
}

class ArmaPersonagem extends Arma {
  constructor(dano) {
    super(dano, "orange");
  }

  mostrar(x, y, tamanho) {
    push();
    this.origem = createVector(x + tamanho / 2, y + tamanho / 2);
    this.sentido = createVector(mouseX - this.origem.x, mouseY - this.origem.y);

    this.sentido.setMag(tamanho); // Ajuste o tamanho da linha (arma)

    stroke("red");
    strokeWeight(5);
    line(this.origem.x, this.origem.y, mouseX, mouseY);

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

class ArmaInimiga extends Arma {
  constructor(dano, cor) {
    super(dano, cor);
  }

  mostrar(x, y, tamanho, personagem) {
    push();
    this.origem = createVector(x + tamanho / 2, y + tamanho / 2);
    this.sentido = createVector(
      personagem.x + personagem.tamanho / 2 - this.origem.x,
      personagem.y + personagem.tamanho / 2 - this.origem.y
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
