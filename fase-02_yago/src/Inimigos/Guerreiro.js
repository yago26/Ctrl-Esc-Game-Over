class Guerreiro extends Inimigo {
  constructor(x, y, jogador) {
    super(x, y, 6, jogador, "brown", 48);
    this.vx = 4;
    this.vy = 4;

    this.arma = new ArmaInimiga(3, "black");
    this.cronometro = millis();

    this.atacando = false;
    angleMode(DEGREES);
  }

  mostrar() {
    if (this.vida <= 0) return;
    if (this.jogador.vida <= 0) return;

    push();
    /* BARRA INFORMATIVA - VIDA */
    stroke(color(255, 162, 182));
    fill(color(255, 162, 182));
    rect(this.x + 10, this.y - 10, map(this.vida, 0, 3, 0, 50), 5);
    pop();

    push();
    fill(this.cor);
    square(this.x, this.y, this.tamanho);
    this.arma.mostrar(this.x, this.y, this.tamanho, this.jogador);
    pop();
  }

  mover() {
    if (this.vida <= 0) return;
    if (this.jogador.vida <= 0) return;
    let sentidoX = false;
    if (abs(this.x - this.jogador.x) > abs(this.y - this.jogador.y)) {
      sentidoX = true;
    }
    if (sentidoX) {
      if (Math.sign(this.x - this.jogador.x) === 1) {
        this.x -= this.vx;
      } else {
        this.x += this.vx;
      }
    } else {
      if (Math.sign(this.y - this.jogador.y) === 1) {
        this.y -= this.vy;
      } else {
        this.y += this.vy;
      }
    }
  }

  atacar() {
    if (this.vida <= 0) return;
    if (this.jogador.vida <= 0) return;
    if (!this.atacando) {
      push();
      stroke("green");
      fill("green");
      arc(
        this.arma.origem.x,
        this.arma.origem.y,
        this.tamanho / 2,
        this.tamanho / 2,
        180,
        45
      );
      pop();
    }
  }
}
