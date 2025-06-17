const fs = require('fs');
const parser = require('./parser.js');
const avaliar = require('./avaliador.js');

const codigo = fs.readFileSync('exemplo.ptgl', 'utf-8');

try {
  const ast = parser.parse(codigo);
  console.log("AST Gerada com Sucesso:", JSON.stringify(ast, null, 2));

  console.log("\n--- Execução ---");
  avaliar(ast);
  console.log("----------------");

} catch (e) {
  console.error("Ocorreu um erro:", e.message);
}