const assert = require('node:assert/strict');
const {validarPagamento, danoAposDefesa, compararVelocidade} = require('./regras-atlas');
const custo = {coloridas: {azul: 2}, generica: 2};
assert.equal(validarPagamento(custo, [{cor:'azul'},{cor:'azul'},{cor:'vermelho'},{cor:'verde'}]), true);
assert.equal(validarPagamento(custo, [{cor:'azul'},{cor:'vermelho'},{cor:'vermelho'},{cor:'verde'}]), false);
assert.equal(validarPagamento(custo, [{cor:'azul'},{cor:'azul'},{cor:'verde'}]), false);
assert.equal(danoAposDefesa(5), 3);
assert.equal([{velocidade:1},{velocidade:4}].sort(compararVelocidade)[0].velocidade, 4);
console.log('Testes das regras basicas passaram.');
