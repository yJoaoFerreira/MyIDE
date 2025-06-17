Programa = _ corpo:(ComandoComEspaco)* _ {
  return { tipo: "PROGRAMA", corpo: corpo };
}

ComandoComEspaco = cmd:Comando ComEspaco { return cmd; }

Comando = DeclaracaoVariavel / AtribuicaoVariavel / ChamadaEscreva / ChamadaLeia

DeclaracaoVariavel = tipo:Tipo _ ":" _ variaveis:ListaIdentificadores {
  return { 
    tipo: "DECLARACAO_VAR", 
    tipo_variavel: tipo, 
    variaveis: variaveis 
  };
}

AtribuicaoVariavel = variavel:Identificador _ ":" _ valor:Valor {
  return {
    tipo: "ATRIBUICAO_VAR",
    variavel: variavel,
    valor: valor
  };
}

ChamadaEscreva = "escreva" _ "(" _ argumento:Valor _ ")" {
  return {
    tipo: "CHAMADA_DE_FUNCAO",
    nome: "escreva",
    argumentos: [argumento]
  };
}

ChamadaLeia = "leia" _ "(" _ argumento:Identificador _ ")" {
  return {
    tipo: "CHAMADA_DE_FUNCAO",
    nome: "leia",
    argumentos: [argumento]
  };
}

Valor = Numero / Texto / Identificador

Texto = '"' chars:([^"]*) '"' {
  return { tipo: "LITERAL_TEXTO", valor: chars.join('') };
}

Numero "Número" = digitos:([0-9]+ ("." [0-9]+)?) {
  return { tipo: "LITERAL_NUMERICO", valor: parseFloat(text()) };
}

Identificador "Identificador" = [a-zA-Z_][a-zA-Z0-9_]* {
  return { tipo: "IDENTIFICADOR", valor: text() };
}

Tipo "Tipo de Variável" = tipo:("real" / "inteiro" / "texto" / "logico") {
  return text();
}


ListaIdentificadores = head:Identificador tail:(_ "," _ Identificador)* {
  const resultado = [head];
  tail.forEach(function(element) {
    resultado.push(element[3]);
  });
  return resultado;
}

ComEspaco = _

_ "espaço ou comentário" = (
    [ \t\n\r] /
    ComentarioLinhaUnica /
    ComentarioMultiLinha
)*

ComentarioLinhaUnica "Comentário de linha única"
  = "//" [^\n]*

ComentarioMultiLinha "Comentário de múltiplas linhas"
  = "/*" (!"*/" .)* "*/"