const fs = require('fs');
const parser = require('./parser.js');
const avaliar = require('./avaliador.js');

const codigo = fs.readFileSync('exemplo.ptgl', 'utf-8');

try {
  const ast = parser.parse(codigo);
  avaliar(ast);
} catch (e) {
  console.error("Ocorreu um erro:", e.message);
}