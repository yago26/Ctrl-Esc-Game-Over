class Arma {
  constructor(dano) {
    this.dano = dano;
    this.projeteis = [];
  }

  mostrar(x, y, tamanho) {
    push();
    x += map(mouseX > width ? width : mouseX, 0, width, -5, 30);
    y += map(mouseY > height ? height : mouseY, 0, height, -5, 30);
    let origem = createVector(x, y);
    let sentido = createVector(mouseX - origem.x, mouseY - origem.y);
    sentido.setMag(tamanho); // Ajuste o tamanho da linha (arma)

    stroke("orange");
    strokeWeight(10);
    line(origem.x, origem.y, origem.x + sentido.x, origem.y + sentido.y);
    pop();
  }
}
