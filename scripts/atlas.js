// ATLAS TCG v0.2 — script executado na sandbox do TCG Arena.
// Usa APENAS funções documentadas: getCardData, moveCard, moveCards, chatLog.
// A seleção é realizada movendo cartas da mão para as zonas de preparação/pagamento.
// Este protótipo só automatiza o pagamento; não garante jogadas que contornem esse botão.

function atlasMensagem(msg) {
  game.data.ControlesAtlas.resultado = msg;
  functions.chatLog('[Atlas] ' + msg);
}
function atlasCor(c) {return String(c||'').trim().toLowerCase();}
function atlasCusto(card) {
  const data=functions.getCardData(card);
  const c=data?.atlas?.custo;
  if(!c) return null;
  return {coloridas:c.coloridas||{},generica:Number(c.generica)||0};
}
function atlasPagamentoValido(alvo, fontes) {
  const custo=atlasCusto(alvo);
  if(!custo) return {ok:false,erro:'Carta sem custo Atlas configurado.'};
  let restante={};
  for(const [cor,n] of Object.entries(custo.coloridas)) restante[atlasCor(cor)]=Number(n);
  const disponiveis={};
  for(const f of fontes) {
    const c=atlasCor(functions.getCardData(f)?.atlas?.cor);
    if(!c) return {ok:false,erro:'Carta de pagamento sem cor Atlas.'};
    disponiveis[c]=(disponiveis[c]||0)+1;
  }
  for (const [cor,n] of Object.entries(restante)) {
    if ((disponiveis[cor]||0)<n) return {ok:false,erro:'Faltam '+(n-(disponiveis[cor]||0))+' carta(s) '+cor+'.'};
    disponiveis[cor]-=n;
  }
  const extras=Object.values(disponiveis).reduce((a,b)=>a+b,0);
  if(extras!==custo.generica) return {ok:false,erro:'Pagamento exige '+custo.generica+' carta(s) extra(s) de qualquer cor; selecionadas: '+extras+'.'};
  return {ok:true};
}
async function atlasPagarEJogar() {
  if (!game.turn.isMyTurn) {atlasMensagem('Somente no seu turno.');return;}
  const alvo=(cards.Preparacao||[]);
  if(alvo.length!==1){atlasMensagem('Coloque exatamente 1 carta em Preparação.');return;}
  const fontes=cards.Pagamento||[];
  const resultado=atlasPagamentoValido(alvo[0],fontes);
  if(!resultado.ok){atlasMensagem(resultado.erro);return;}
  const tipo=functions.getCardData(alvo[0])?.type;
  const destino=({'Unidade':'Banco','Construcao':'Construcoes','Magia':'Discard','Equipamento':'Banco'})[tipo];
  if(!destino){atlasMensagem('Tipo não suportado ainda: '+tipo);return;}
  if(tipo==='Unidade' && (cards.Banco||[]).length>=20){atlasMensagem('Limite técnico do protótipo: banco cheio.');return;}
  // Descarta as cartas de pagamento; nenhuma mana fica guardada.
  if(fontes.length) await functions.moveCards(fontes,'Discard');
  await functions.moveCard(alvo[0],destino);
  atlasMensagem('Pagamento confirmado; '+tipo+' movida para '+destino+'.');
}
async function atlasCancelarPagamento() {
  const toReturn=[...(cards.Pagamento||[]),...(cards.Preparacao||[])];
  if(toReturn.length) await functions.moveCards(toReturn,'Hand');
  atlasMensagem('Pagamento cancelado. Cartas devolvidas à mão.');
}
function atlasCalcularDefesa(){
 const n=Math.max(0,Number(game.data.ControlesAtlas.dano)||0);
 game.data.ControlesAtlas.defesa=Math.ceil(n/2);
 atlasMensagem('Defesa: '+n+' de dano bruto → '+Math.ceil(n/2)+' recebido. A unidade perde sua ação.');
}
