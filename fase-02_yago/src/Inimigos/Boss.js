class Boss extends Inimigo {
  constructor(x, y, jogador) {
    super(x, y, 50, jogador, "black", 128);
    this.vx = 10;
    this.vy = 10;
    this.cooldown_mover = millis();

    this.tamanhoColisao = 90;

    this.arma = new ArmaInimiga(1, "blue");
    this.projeteis = [];
    this.cronometro_ultimoAtaque = millis();
    this.cooldown_atacar = 2000;

    this.cronometro_ultimoAtaqueEspecial_01 = millis();
    this.cooldown_atacarEspecial_01 = 4000;
    this.ataquesEspeciais = {
      1: (x, y) => {
        for (let i = 0; i < 40; i++) {
          this.projeteis.push(
            new Projetil(
              x + this.tamanho / 2,
              y + this.tamanho / 2,
              { x: random(-10, 10), y: random(-10, 10) },
              "gray"
            )
          );
        }
      },
      2: () => {},
      3: () => {},
    };

    this.caminhos = {
      frente: loadImage("./assets/atirador-frente.png"),
      costas: loadImage("./assets/atirador-costas.png"),
    };
    this.img = this.caminhos.frente;
  }

  mostrar() {
    if (this.vida <= 0) return;
    if (this.jogador.vida <= 0) return;
    if (
      millis() - this.cronometro_ultimoAtaqueEspecial_01 >=
      this.cooldown_atacarEspecial_01
    ) {
      this.ataquesEspeciais[1](this.x, this.y);
      this.cronometro_ultimoAtaqueEspecial_01 = millis();
    }

    push();
    /* MOSTRANDO COMPONENTES */
    fill(this.cor);
    square(this.x, this.y, this.tamanho);
    this.arma.mostrar(this.x, this.y, this.tamanhoColisao, this.jogador);

    /* CASO */
    let projeteisRemover = [];
    for (let projetil of this.projeteis) {
      projetil.mostrar();
      projetil.mover();
      if (
        dist(this.jogador.x, this.jogador.y, projetil.x, projetil.y) <=
        this.jogador.tamanhoColisao
      ) {
        this.jogador.receberDano();
        projeteisRemover.push(projetil);
      }
      if (
        projetil.x < 0 ||
        projetil.x > width ||
        projetil.y < 0 ||
        projetil.y > height
      ) {
        projeteisRemover.push(projetil);
      }
    }
    // Remover projéteis após a iteração
    for (let projetil of projeteisRemover) {
      this.projeteis.splice(this.projeteis.indexOf(projetil), 1);
    }
    pop();

    push();
    /* BARRA INFORMATIVA - VIDA */
    stroke(color(255, 162, 182));
    fill(color(255, 162, 182));
    rect(20, 20, map(this.vida, 0, 50, 0, width - 40), 30);
    pop();
  }

  mover() {
    if (this.vida <= 0) return;
    if (this.jogador.vida <= 0) return;
    if (this.vida === 25) {
      this.ataquesEspeciais[1];
    }
    if (this.y < 0) {
      this.y = 0;
      this.vy *= -1;
    }
    if (this.x < 0) {
      this.x = 0;
      this.vx *= -1;
    }
    if (this.y + this.tamanho > height) {
      this.y = height - this.tamanho;
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
