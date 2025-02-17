class Inimigo extends Personagem {
  constructor(jogador, x) {
    super(x, jogador.y);
    this.jogador = jogador;
    this.largura = 50;
    this.altura = 50;
  }

  seguirJogador() {
    if (jogador.velocidadeX !== 0) {
      let direcao = this.jogador.x > this.x ? 2 : -2;
      this.mover(direcao);
    }
  }

  atirar() {
    if (this.velocidadeX !== 0 && frameCount % 60 === 0) {
      let angulo = atan2(this.jogador.y - this.y, this.jogador.x - this.x);
      let velocidadeX = cos(angulo) * 4;
      let velocidadeY = sin(angulo) * 4;
      projeteis.push(new Projetil(this.x, this.y, velocidadeX, velocidadeY));
    }
  }

  mostrar() {
    image(imagemInimigo, this.x, this.y, this.largura, this.altura);
  }
}
