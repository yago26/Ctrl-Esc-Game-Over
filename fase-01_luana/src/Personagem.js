class Personagem {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.largura = 38;
    this.altura = 38;
    this.velocidadeX = 0;
    this.velocidadeY = 0;
    this.sprite = imagemEsquerda;
  }

  mover(direcao) {
    this.velocidadeX = direcao * 1.5;
    this.sprite = direcao > 0 ? imagemEsquerda : imagemDireita;
  }

  parar() {
    this.velocidadeX = 0;
  }

  pular() {
    this.velocidadeY = -4;
  }

  atualizar() {
    this.velocidadeY += gravidade;
    this.x = constrain(this.x + this.velocidadeX, 0, width - this.largura);
    this.y = constrain(this.y + this.velocidadeY, 0, height - this.altura);

    for (let p of plataformas) {
      if (colidir(this, p)) {
        // Verificação de colisão para cima
        if (this.y + this.altura > p.y && this.y < p.y) {
          this.y = p.y - this.altura;
          this.velocidadeY = 0;
        }
        // Verificação de colisão para baixo
        if (this.y < p.y + p.altura && this.y + this.altura > p.y + p.altura) {
          this.y = p.y + p.altura;
          this.velocidadeY = 0;
        }
        // Verificação de colisão para esquerda
        if (this.x + this.largura > p.x && this.x < p.x) {
          this.x = p.x - this.largura;
          this.velocidadeX = 0;
        }
        // Verificação de colisão para direita
        if (
          this.x < p.x + p.largura &&
          this.x + this.largura > p.x + p.largura
        ) {
          this.x = p.x + p.largura;
          this.velocidadeX = 0;
        }
      }
    }
  }

  mostrar() {
    image(this.sprite, this.x, this.y, this.largura, this.altura);
  }
}
