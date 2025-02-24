class Boss extends Inimigo {
  constructor(x, y, jogador) {
    super(x, y, 50, jogador, "black", 160);
    this.vx = 10;
    this.vy = 10;
    this.cooldown_mover = millis();

    this.tamanhoColisao = { w: 148, h: 160 };

    this.arma = new Arma(1, "blue");
    this.projeteis = [];
    this.cronometro_ultimoAtaque = millis();
    this.cooldown_atacar = 2000;

    this.cronometro_ultimoAtaqueEspecial_01 = millis();
    this.cooldown_atacarEspecial_01 = 4000;

    this.cronometro_ultimoAtaqueEspecial_02 = millis();
    this.cooldown_atacarEspecial_02 = 3000;
    this.atacarLaiser = false;

    this.ataquesEspeciais = {
      geral: false,
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
    };

    this.sprites = {
      frente: loadImage(
        "./assets/sprites/inimigos/boss-antoin/antoin-frente.png"
      ),
    };
    this.img = this.sprites.frente;
  }

  mostrar() {
    if (this.vida <= 0) return;
    if (this.jogador.vida > 0) {
      if (this.vida > 30) {
        // LAISER
        if (
          millis() - this.cronometro_ultimoAtaqueEspecial_02 >=
            this.cooldown_atacarEspecial_02 / 2 &&
          millis() - this.cronometro_ultimoAtaqueEspecial_02 <=
            this.cooldown_atacarEspecial_02
        ) {
          /* MIRANDO */
          let x = this.x + this.tamanhoColisao.w / 2,
            y = this.y + this.tamanhoColisao.h / 2;
          let sentido = createVector(
            this.jogador.x + this.jogador.tamanhoColisao.w / 2 - x,
            this.jogador.y + this.jogador.tamanhoColisao.h / 2 - y
          );
          sentido.add(sentido.mult(10000));
          line(x, y, sentido.x, sentido.y);
          this.atacarLaiser = true;
        } else {
          if (this.atacarLaiser) {
            this.atacarLaiser = false;
            setTimeout(() => {
              this.cronometro_ultimoAtaqueEspecial_02 = millis();
            }, 1500);
          }
          /* ATACAR */
        }
      } else {
        // EXPLOSÃO
        if (
          millis() - this.cronometro_ultimoAtaqueEspecial_01 >=
          this.cooldown_atacarEspecial_01
        ) {
          this.ataquesEspeciais[1](this.x, this.y);
          this.cronometro_ultimoAtaqueEspecial_01 = millis();
          this.ataquesEspeciais.geral = false;
        } else if (
          millis() - this.cronometro_ultimoAtaqueEspecial_01 >=
          this.cooldown_atacarEspecial_01 - 750
        ) {
          this.ataquesEspeciais.geral = true;
        }
      }
    }

    push();
    /* MOSTRANDO COMPONENTES */
    this.arma.mostrar(this.x, this.y, this.tamanho, this.jogador, true);
    image(this.img, this.x, this.y, this.tamanho, this.tamanho);

    /* CASO ESTEJA EM UM ATAQUE ESPECIAL NÃO *ATIRE* */
    let projeteisRemover = [];
    for (let projetil of this.projeteis) {
      projetil.mostrar();
      projetil.mover();
      if (
        colisaoCirculoRetangulo(
          projetil.x,
          projetil.y,
          projetil.raio,
          this.jogador.x +
            (this.jogador.tamanho - this.jogador.tamanhoColisao.w) / 2,
          this.jogador.y,
          this.jogador.tamanhoColisao.w,
          this.jogador.tamanhoColisao.h
        )
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
    }

    // SE ESTIVER DANDO UM ATAQUE ESPECIAL *PARE*
    if (!this.ataquesEspeciais.geral) {
      if (millis() - this.cooldown_mover >= 1500) {
        this.cooldown_mover = millis();
        this.vx = random(-5, 5);
        this.vy = random(-8, 8);
      }
      if (Math.sign(this.vx) === 1) {
        // MUDAR SPRITE PARA ESQUERDA
      } else {
        // MUDAR SPRITE PARA DIREITA
      }
      this.x += this.vx;
      if (Math.sign(this.vy) === 1) {
        // MUDAR SPRITE PARA FRENTE
      } else {
        // MUDAR SPRITE PARA COSTAS
      }
      this.y += this.vy;
    }
  }

  atacar() {
    if (this.vida <= 0) return;
    if (this.jogador.vida <= 0) return;
    if (this.ataquesEspeciais.geral) return;
    this.projeteis.push(
      new Projetil(
        this.arma.origem.x + this.arma.sentido.x,
        this.arma.origem.y + this.arma.sentido.y,
        { x: this.arma.sentido.x / 3, y: this.arma.sentido.y / 3 },
        "lightblue"
      )
    );
  }
}
