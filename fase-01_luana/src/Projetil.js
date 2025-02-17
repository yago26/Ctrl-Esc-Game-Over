class Projetil {
  constructor(x, y, velocidadeX, velocidadeY) {
    this.x = x;
    this.y = y;
    this.largura = 10;
    this.altura = 10;
    this.velocidadeX = velocidadeX;
    this.velocidadeY = velocidadeY;
  }

  atualizar() {
    this.x += this.velocidadeX;
    this.y += this.velocidadeY;
  }

  mostrar() {
    image(imagemProj, this.x, this.y, this.largura, this.altura);
  }
}
