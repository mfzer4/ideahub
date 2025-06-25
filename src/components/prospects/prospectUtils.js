export const statusOptions = ['Contatar', 'Em Negociação', 'Aguardando Documentos', 'Convertido', 'Perdido', 'Follow-up', 'Cadastrado'];
export const situacaoOptions = ['Pendente Vendedor', 'Aguardando Cliente', 'Documentação OK', 'Fechado', 'Cancelado'];
export const sellerOptions = [{ id: 'Carlos Silva', name: 'Carlos Silva' }, { id: 'Ana Beatriz', name: 'Ana Beatriz' }];

export const parsePercentageForCalc = (value) => {
  const num = parseFloat(String(value).replace('%', ''));
  return isNaN(num) ? 0 : num / 100;
};

export const calculateCommissionsFromProspectData = (prospect) => {
  const pla = parseFloat(prospect.premioLiquidoAnterior) || 0;
  const pa = parsePercentageForCalc(prospect.percentualAnterior);
  const platu = parseFloat(prospect.premioLiquidoAtual) || 0;
  const patu = parsePercentageForCalc(prospect.percentualAtual);

  const comissaoAnteriorCalculada = pla * pa;
  const comissaoAtualCalculada = platu * patu;
  const diferencaComissaoCalculada = comissaoAtualCalculada - comissaoAnteriorCalculada;

  return {
    comissaoAnterior: comissaoAnteriorCalculada,
    comissaoAtual: comissaoAtualCalculada,
    diferencaComissao: diferencaComissaoCalculada,
  };
};

export const initialProspectsData = [
  { id: 'PROS001', vigenciaFinal: '2025-07-15', cliente: 'Juliana Paes', produto: 'Automóvel Completo', seguradora: 'Porto Seguro', vendedor: 'Carlos Silva', planoAnterior: 'Plano Basic', percentualAnterior: '5', premioLiquidoAnterior: 5000, planoAtual: 'Plano Top', percentualAtual: '7', premioLiquidoAtual: 5000, analise: 'Positiva', status: 'Em Negociação', situacao: 'Aguardando Cliente', observacao: 'Cliente pediu para ligar na sexta.', attachment: null },
  { id: 'PROS002', vigenciaFinal: '2025-08-01', cliente: 'Ricardo Alves', produto: 'Residencial Essencial', seguradora: 'Tokio Marine', vendedor: 'Ana Beatriz', planoAnterior: 'Cobertura Padrão', percentualAnterior: '3', premioLiquidoAnterior: 5000, planoAtual: 'Cobertura Padrão', percentualAtual: '3', premioLiquidoAtual: 5000, analise: 'Neutra', status: 'Contatar', situacao: 'Pendente Vendedor', observacao: 'Apólice vence em 45 dias.', attachment: null },
  { id: 'PROS003', vigenciaFinal: '2025-06-30', cliente: 'Sofia Bernardes', produto: 'Vida Total', seguradora: 'Bradesco Seguros', vendedor: 'Carlos Silva', planoAnterior: 'Vida Individual', percentualAnterior: '10', premioLiquidoAnterior: 4000, planoAtual: 'Vida Individual Plus', percentualAtual: '12', premioLiquidoAtual: 4000, analise: 'Positiva', status: 'Convertido', situacao: 'Fechado', observacao: 'Apólice emitida.', attachment: { name: 'apolice_sofia_2024.pdf', size: 245388, type: 'application/pdf' } },
].map(p => ({...p, ...calculateCommissionsFromProspectData(p)}));