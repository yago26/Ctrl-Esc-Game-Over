class Inimigo {
  constructor(x, y, vida, jogador, cor, tamanho) {
    this.x = x;
    this.y = y;
    this.vida = vida;
    this.jogador = jogador;
    this.cor = cor;
    this.corPrincipal = cor;
    this.tamanho = tamanho;
  }

  mostrar() {}

  mover() {}

  atacar() {}

  receberDano() {
    this.vida--;
    this.cor = "red";
    setTimeout(() => {
      this.cor = this.corPrincipal;
    }, "100");
  }
}

class Atirador extends Inimigo {
  constructor(x, y, jogador) {
    super(x, y, 3, jogador, "lightblue", 64);
    this.periodo = millis();
    this.periodoVelocidade = millis();
    this.periodoAtaque = random(1000, 2000);
    this.vx = random(-5, 5);
    this.vy = random(-8, 8);
    this.arma = new ArmaInimiga(1, "blue");
    this.tamanhoColisao = 48;
    this.projeteis = [];
    this.caminhos = {
      frente: loadImage("./assets/atirador-frente.png"),
      costas: loadImage("./assets/atirador-costas.png"),
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
      if (millis() - this.periodoVelocidade >= 1500) {
        this.periodoVelocidade = millis();
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

class Guerreiro extends Inimigo {
  constructor(x, y, jogador) {
    super(x, y, 8, jogador, "brown", 48);
    this.periodo = millis();
    this.vx = 4;
    this.vy = 4;
    this.arma = new ArmaInimiga(3, "black");
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

class Boss extends Inimigo {
  constructor(x, y, jogador) {
    super(x, y, 50, jogador, "lightblue", 128);
    this.periodo = millis();
    this.periodoVelocidade = millis();
    this.periodoAtaque = 1500;
    this.vx = 10;
    this.vy = 10;
    this.arma = new ArmaInimiga(1, "blue");
    this.tamanhoColisao = 90;
    this.projeteis = [];
    this.caminhos = {
      frente: loadImage("./assets/atirador-frente.png"),
      costas: loadImage("./assets/atirador-costas.png"),
    };
    this.img = this.caminhos.frente;
    this.ataquesEspeciais = {
      1: () => {},
      2: () => {},
      3: () => {},
    };
  }

  mostrar() {
    if (this.vida <= 0) return;
    if (this.jogador.vida <= 0) return;

    push();
    /* MOSTRANDO COMPONENTES */
    fill(this.cor);
    square(this.x, this.y, this.tamanho);
    this.arma.mostrar(this.x, this.y, this.tamanhoColisao, this.jogador);

    /* CASO */
    for (let projetil of this.projeteis) {
      projetil.mostrar();
      projetil.mover();
      if (
        dist(this.jogador.x, this.jogador.y, projetil.x, projetil.y) <=
        this.jogador.tamanhoColisao
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
      if (millis() - this.periodoVelocidade >= 1500) {
        this.periodoVelocidade = millis();
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
