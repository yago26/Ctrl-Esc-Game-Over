class Perseguidor extends Inimigo {
  constructor(x, y, jogador) {
    super(x, y, 6, jogador, "brown", 96);
    this.vx = 4;
    this.vy = 4;

    this.tamanhoColisao = { w: 96, h: 96 };

    this.sprites = {
      frente: loadImage(
        "./assets/sprites/inimigos/perseguidor/perseguidor-frente.png"
      ),
      direita: loadImage(
        "./assets/sprites/inimigos/perseguidor/perseguidor-direita.png"
      ),
      esquerda: loadImage(
        "./assets/sprites/inimigos/perseguidor/perseguidor-esquerda.png"
      ),
      costas: loadImage(
        "./assets/sprites/inimigos/perseguidor/perseguidor-costas.png"
      ),
    };
    this.img = this.sprites.frente;
  }

  mostrar() {
    if (this.vida <= 0) return;

    push();
    /* BARRA INFORMATIVA - VIDA */
    stroke(color(255, 162, 182));
    fill(color(255, 162, 182));
    rect(this.x + 10, this.y - 10, map(this.vida, 0, 3, 0, 50), 5);
    pop();

    image(this.img, this.x, this.y, this.tamanho, this.tamanho);
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
        this.img = this.sprites.direita;
      } else {
        this.x += this.vx;
        this.img = this.sprites.esquerda;
      }
    } else {
      if (Math.sign(this.y - this.jogador.y) === 1) {
        this.y -= this.vy;
        this.img = this.sprites.costas;
      } else {
        this.y += this.vy;
        this.img = this.sprites.frente;
      }
    }
  }
}
