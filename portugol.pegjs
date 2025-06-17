// portugol.pegjs
Programa = _ corpo:(ComandoComEspaco)* _ {
  return { tipo: "PROGRAMA", corpo: corpo };
}

ComandoComEspaco = cmd:Comando ComEspaco { return cmd; }

// ORDEM ATUALIZADA COM A REGRA RENOMEADA
Comando = ChamadaEscreva / ChamadaLeia / DeclaracaoVariavel / AtribuicaoVariavel

// --- Regras de Comando ---

// REGRA SIMPLIFICADA PARA APENAS "escreva"
ChamadaEscreva = "escreva" _ "(" _ args:ListaDeValores? _ ")" {
  return {
    tipo: "CHAMADA_DE_FUNCAO",
    nome: "escreva",
    argumentos: args || []
  };
}

DeclaracaoVariavel = tipo:Tipo _ ":" _ variaveis:ListaIdentificadores { return { tipo: "DECLARACAO_VAR", tipo_variavel: tipo, variaveis: variaveis }; }
AtribuicaoVariavel = variavel:Identificador _ ":" _ valor:Valor { return { tipo: "ATRIBUICAO_VAR", variavel: variavel, valor: valor }; }
ChamadaLeia = "leia" _ "(" _ argumento:Identificador _ ")" { return { tipo: "CHAMADA_DE_FUNCAO", nome: "leia", argumentos: [argumento] }; }

// --- Regras de Valor e Tipos (sem alterações) ---

Valor = Numero / TextoFormatado / Texto / Identificador
Texto = '"' chars:(CaractereDeTexto)* '"' { return { tipo: "LITERAL_TEXTO", valor: chars.join('') }; }
CaractereDeTexto = char:[^"\\\\] { return char; } / "\\" seq:SequenciaDeEscape { return seq; }
SequenciaDeEscape = "n" { return "\n"; } / "r" { return "\r"; } / "t" { return "\t"; } / "\\" { return "\\"; } / '"'  { return '"';  }
TextoFormatado = 'f"' partes:(CaractereNormalFString / ExpressaoEmbutida)* '"' { return { tipo: "TEXTO_FORMATADO", partes: partes }; }
CaractereNormalFString = [^"{]
ExpressaoEmbutida = "{" _ expr:Identificador _ "}" { return expr; }
Numero "Número" = digitos:([0-9]+ ("." [0-9]+)?) { return { tipo: "LITERAL_NUMERICO", valor: parseFloat(text()) }; }
Identificador "Identificador" = [a-zA-Z_][a-zA-Z0-9_]* { return { tipo: "IDENTIFICADOR", valor: text() }; }
Tipo "Tipo de Variável" = tipo:("real" / "inteiro" / "texto" / "logico") { return text(); }

// --- Regras Auxiliares (sem alterações) ---

ListaDeValores = head:Valor tail:(_ "," _ Valor)* { const resultado = [head]; tail.forEach(function(element) { resultado.push(element[3]); }); return resultado; }
ListaIdentificadores = head:Identificador tail:(_ "," _ Identificador)* { const resultado = [head]; tail.forEach(function(element) { resultado.push(element[3]); }); return resultado; }
ComEspaco = _
_ "espaço ou comentário" = ([ \t\n\r] / ComentarioLinhaUnica / ComentarioMultiLinha)*
ComentarioLinhaUnica "Comentário de linha única" = "//" [^\n]*
ComentarioMultiLinha "Comentário de múltiplas linhas" = "/*" (!"*/" .)* "*/"