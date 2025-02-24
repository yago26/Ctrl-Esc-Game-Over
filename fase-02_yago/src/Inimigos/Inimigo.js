class Inimigo {
  constructor(x, y, vida, jogador, cor, tamanho) {
    this.x = x;
    this.y = y;
    this.vida = vida;
    this.jogador = jogador;
    this.cor = cor;
    this.corPrincipal = cor;
    this.tamanho = tamanho;
  }

  mostrar() {}

  mover() {}

  atacar() {}

  receberDano() {
    this.vida--;
    this.cor = "red";
    setTimeout(() => {
      this.cor = this.corPrincipal;
    }, 100);
  }
}
