class Personagem {
  constructor(x, y, velocidade) {
    this.x = x;
    this.y = y;
    this.velocidade = velocidade;
    this.tamanho = 20;
    this.nome = "luanao";

    this.velocidadePulo = -12; // Velocidade inicial de pulo (valor negativo para subir)
    this.gravidade = 0.5; // Aceleração de gravidade (quão rápido o personagem cai)
    this.velocidadeAtual = 0; // Velocidade de movimento no eixo Y
    this.saltou = false; // Controla se o personagem está no ar ou no chão
  }

  mostrar() {
    square(this.x, this.y, this.tamanho);
  }

  mover() {
    // Movimento lateral (A e D)
    if (keyIsDown(65)) {
      // A
      if (this.x > 0) this.x -= this.velocidade;
    }
    if (keyIsDown(68)) {
      // D
      if (this.x + this.tamanho < width) this.x += this.velocidade;
    }

    // Lógica de pulo
    if (this.saltou) {
      this.velocidadeAtual += this.gravidade; // Aplica a gravidade
      this.y += this.velocidadeAtual; // Move o personagem com a velocidade atual

      // Quando o personagem atinge o solo
      if (this.y >= height - this.tamanho) {
        this.y = height - this.tamanho; // Fixa a posição do personagem no chão
        this.saltou = false; // O personagem não está mais no ar
        this.velocidadeAtual = 0; // Reseta a velocidade de queda
      }
    }

    // Pulo
    if (keyIsDown(87) && !this.saltou) {
      // W
      this.saltou = true;
      this.velocidadeAtual = this.velocidadePulo; // Aplica a velocidade inicial do pulo
    }
  }
}
