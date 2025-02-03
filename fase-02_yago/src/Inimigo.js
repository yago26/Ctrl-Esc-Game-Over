class Inimigo {
  constructor(x, y, vida, personagem, cor, tamanho) {
    this.x = x;
    this.y = y;
    this.vida = vida;
    this.personagem = personagem;
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
  constructor(x, y, personagem) {
    super(x, y, 3, personagem, "lightblue", 32);
    this.periodo = millis();
    this.periodoVelocidade = millis();
    this.periodoAtaque = random(1000, 2000);
    this.vx = random(-5, 5);
    this.vy = random(-8, 8);
    this.arma = new ArmaInimiga(1, "blue");
    this.projeteis = [];
  }

  mostrar() {
    if (this.vida <= 0) return;
    if (this.personagem.vida <= 0) return;
    push();
    fill(this.cor);
    square(this.x, this.y, this.tamanho);
    this.arma.mostrar(this.x, this.y, this.tamanho, this.personagem);
    for (let projetil of this.projeteis) {
      projetil.mostrar();
      projetil.mover();
      if (
        dist(this.personagem.x, this.personagem.y, projetil.x, projetil.y) <=
        this.personagem.tamanho
      ) {
        this.personagem.receberDano();
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
    if (this.personagem.vida <= 0) return;
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
      this.x += this.vx;
      this.y += this.vy;
    }
  }

  atacar() {
    if (this.vida <= 0) return;
    if (this.personagem.vida <= 0) return;
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
  constructor(x, y, personagem) {
    super(x, y, 8, personagem, "brown", 48);
    this.periodo = millis();
    this.vx = 4;
    this.vy = 4;
    this.arma = new ArmaInimiga(3, "black");
    this.atacando = false;
    angleMode(DEGREES);
  }

  mostrar() {
    if (this.vida <= 0) return;
    if (this.personagem.vida <= 0) return;
    push();
    fill(this.cor);
    square(this.x, this.y, this.tamanho);
    this.arma.mostrar(this.x, this.y, this.tamanho, this.personagem);
    pop();
  }

  mover() {
    if (this.vida <= 0) return;
    if (this.personagem.vida <= 0) return;
    let sentidoX = false;
    if (abs(this.x - this.personagem.x) > abs(this.y - this.personagem.y)) {
      sentidoX = true;
    }
    if (sentidoX) {
      if (Math.sign(this.x - this.personagem.x) === 1) {
        this.x -= this.vx;
      } else {
        this.x += this.vx;
      }
    } else {
      if (Math.sign(this.y - this.personagem.y) === 1) {
        this.y -= this.vy;
      } else {
        this.y += this.vy;
      }
    }
  }

  atacar() {
    if (this.vida <= 0) return;
    if (this.personagem.vida <= 0) return;
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
  constructor(x, y, personagem) {
    super(x, y, personagem, "black", 128);
    this.periodo = millis();
    this.vx = random(1, 5);
    this.vx = random(1, 8);
  }
}
