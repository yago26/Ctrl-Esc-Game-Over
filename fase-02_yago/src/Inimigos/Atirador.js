class Atirador extends Inimigo {
  constructor(x, y, jogador) {
    super(x, y, 3, jogador, "lightblue", 64);
    this.vx = random(-5, 5);
    this.vy = random(-8, 8);
    this.cooldown_mover = millis();

    this.tamanhoColisao = { w: 48, h: 64 };

    this.arma = new Arma(1, "blue");
    this.projeteis = [];
    this.cronometro_ultimoAtaque = millis();
    this.cooldown_atacar = random(1000, 2000);

    let nome = random(["daniel", "vitor"]);

    this.sprites = {
      frente: loadImage(
        "./assets/sprites/inimigos/atirador/"+nome+"/atirador-frente.png"
      ),
      direita: loadImage(
        "./assets/sprites/inimigos/atirador/"+nome+"/atirador-direita.png"
      ),
      esquerda: loadImage(
        "./assets/sprites/inimigos/atirador/"+nome+"/atirador-esquerda.png"
      ),
      costas: loadImage(
        "./assets/sprites/inimigos/atirador/"+nome+"/atirador-costas.png"
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

    push();
    /* MOSTRANDO COMPONENTES */
    image(this.img, this.x, this.y, this.tamanho, this.tamanho);
    this.arma.mostrar(this.x, this.y, this.tamanho, this.jogador, true);

    /* CASO */
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
    for (let projetil of projeteisRemover) {
      this.projeteis.splice(this.projeteis.indexOf(projetil), 1);
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
    }

    if (millis() - this.cooldown_mover >= 1500) {
      this.cooldown_mover = millis();
      this.vx = random(-5, 5);
      this.vy = random(-8, 8);
    }
    if (Math.sign(this.vx) === 1) {
      // MUDAR SPRITE PARA ESQUERDA
      this.img = this.sprites.esquerda;
    } else {
      // MUDAR SPRITE PARA DIREITA
      this.img = this.sprites.direita;
    }
    this.x += this.vx;
    if (Math.sign(this.vy) === 1) {
      // MUDAR SPRITE PARA FRENTE
      this.img = this.sprites.frente;
    } else {
      // MUDAR SPRITE PARA COSTAS
      this.img = this.sprites.costas;
    }
    this.y += this.vy;
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
