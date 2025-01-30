class Inimigo {
  constructor(personagem) {
    this.personagem = personagem;
    (this.x = 0), (this.y = height - this.personagem.tamanho);
    this.visivel = false;
    this.parado = true;
    this.posicoes = [];
  }

  mostrar() {
    if (!(this.personagem.x < this.personagem.tamanho)) {
      this.visivel = true;
    }
    if (this.visivel) {
      push();
      fill("red");
      square(this.x, this.y, this.personagem.tamanho);
      pop();
    }
  }

  mover() {
    if (!this.visivel) return;
    this.posicoes[this.posicoes.length] = {
      x: this.personagem.x,
      y: this.personagem.y,
    };
    if (this.personagem.x > 50) {
      this.parado = false;
    }
    if (!this.parado) {
      let pontos = this.posicoes.shift();
      this.x = pontos.x;
      this.y = pontos.y;
      if (
        dist(pontos.x, pontos.y, this.personagem.x, this.personagem.y) <
        this.personagem.tamanho
      ) {
        this.personagem.vivo = false;
      }
    }
  }
}
