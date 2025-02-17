class Plataforma {
  constructor(x, y, largura, altura, imagem = null) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.imagem = imagem;
  }

  mostrar() {
    if (this.imagem) {
      image(this.imagem, this.x, this.y, this.largura, this.altura);
    } else {
      fill(150);
      rect(this.x, this.y, this.largura, this.altura);
    }
  }
}
