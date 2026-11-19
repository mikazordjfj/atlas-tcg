/**
 * Regras do Atlas TCG - nucleo independente para testes.
 * Ainda NAO integrado a eventos do TCG Arena.
 * Cada carta tem UMA cor e paga UMA unidade da mesma cor.
 */
function validarPagamento(custo, cartasDescartadas) {
  const cores = custo.coloridas || {};
  const generica = custo.generica || 0;
  const necessarias = Object.values(cores).reduce((a,b)=>a+b,0) + generica;
  if (cartasDescartadas.length !== necessarias) return false;
  const disponiveis = {};
  for (const carta of cartasDescartadas) {
    if (!carta.cor) return false;
    disponiveis[carta.cor] = (disponiveis[carta.cor] || 0) + 1;
  }
  for (const [cor, qtd] of Object.entries(cores)) {
    if ((disponiveis[cor] || 0) < qtd) return false;
  }
  return true;
}

// A defesa reduz o dano recebido pela metade, arredondando PARA CIMA.
function danoAposDefesa(dano) {
  return Math.ceil(dano / 2);
}

// Unidades de maior velocidade agem antes. Empates exigem escolha ou d6.
function compararVelocidade(a, b) {
  return b.velocidade - a.velocidade;
}

if (typeof module !== 'undefined') module.exports = {
  validarPagamento, danoAposDefesa, compararVelocidade
};
