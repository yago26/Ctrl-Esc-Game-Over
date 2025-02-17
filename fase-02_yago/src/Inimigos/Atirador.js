class Atirador extends Inimigo {
  constructor(x, y, jogador) {
    super(x, y, 3, jogador, "lightblue", 64);
    this.vx = random(-5, 5);
    this.vy = random(-8, 8);
    this.cooldown_mover = millis();

    this.tamanhoColisao = 48;

    this.arma = new ArmaInimiga(1, "blue");
    this.projeteis = [];
    this.cronometro_ultimoAtaque = millis();
    this.cooldown_atacar = random(1000, 2000);

    this.caminhos = {
      frente: loadImage("./assets/imagens/inimigos/atirador/atirador-frente.png"),
      costas: loadImage("./assets/imagens/inimigos/atirador/atirador-costas.png"),
    };
    this.img = this.caminhos.frente;
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
    /* MOSTRANDO COMPONENTES */
    image(this.img, this.x, this.y, 64, 64);
    this.arma.mostrar(this.x, this.y, this.tamanhoColisao, this.jogador);

    /* CASO */
    for (let projetil of this.projeteis) {
      projetil.mostrar();
      projetil.mover();
      if (
        dist(
          this.jogador.x + 24,
          this.jogador.y + 32,
          projetil.x,
          projetil.y
        ) <=
        this.jogador.tamanho + 8 /* raio da bala */
      ) {
        this.jogador.receberDano();
        this.projeteis.splice(this.projeteis.indexOf(projetil), 1);
      }
      if (
        projetil.x < 0 ||
        projetil.x > width ||
        projetil.y < 0 ||
        projetil.y > height
      ) {
        this.projeteis.splice(this.projeteis.indexOf(projetil), 1);
      }
    }
    pop();
  }

  mover() {
    if (this.vida <= 0) return;
    if (this.jogador.vida <= 0) return;
    if (this.y < 0) {
      this.y = 0;
      this.vy *= -1;
    }
    if (this.x < 0) {
      this.x = 0;
      this.vx *= -1;
    }
    if (this.y + this.tamanho > height / 2) {
      this.y = height / 2 - this.tamanho;
      this.vy *= -1;
    }
    if (this.x + this.tamanho > width) {
      this.x = width - this.tamanho;
      this.vx *= -1;
    } else {
      if (millis() - this.cooldown_mover >= 1500) {
        this.cooldown_mover = millis();
        this.vx = random(-5, 5);
        this.vy = random(-8, 8);
      }
      if (Math.sign(this.vy) === 1) {
        this.img = this.caminhos.frente;
      } else {
        this.img = this.caminhos.costas;
      }
      this.x += this.vx;
      this.y += this.vy;
    }
  }

  atacar() {
    if (this.vida <= 0) return;
    if (this.jogador.vida <= 0) return;
    this.projeteis.push(
      new Projetil(
        this.arma.origem.x + this.arma.sentido.x,
        this.arma.origem.y + this.arma.sentido.y,
        { x: this.arma.sentido.x / 2, y: this.arma.sentido.y / 2 },
        "lightblue"
      )
    );
  }
}
