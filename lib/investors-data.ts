export interface Comprovante {
  id: number
  data: string // YYYY-MM-DD
  dataFormatada: string // DD/MM/YYYY
  competencia: string // MM/YYYY
  valor: number
  status: "Pago" | "Programado"
  arquivo: string // nome do arquivo PDF
}

export interface Investor {
  id: number
  name: string
  aporte: number
  percentualMensal: number
  mesesAporte: number
  numeroSaques: number
  tier: 1 | 2
  documentFolder: string // pasta dos documentos do investidor
  comprovantes: Comprovante[] // lista de comprovantes reais
  safraData?: {
    participacao: number // Percentual de participação
    producaoEstimada: string // Ex: "450 ton"
    valorEstimadoMin: number // Valor mínimo estimado
    valorEstimadoMax: number // Valor máximo estimado
    cicloAtual: string // Ex: "2025/2026"
    etapaAtual: number // 1 a 5 (Planejamento, Plantio, Desenvolvimento, Colheita, Apuração)
    progressoEtapa: number // 0 a 100
  }
}

export interface InvestorCalculated extends Investor {
  saqueMensal: number
  totalSacado: number
  rendimentoAcumuladoNaoSacado: number
  patrimonioTotal: number
}

// Faixa 1: aporte entre R$ 50.000 e R$ 100.000
// Faixa 2: aporte ≥ R$ 150.000
export function calculateTier(aporte: number): 1 | 2 {
  return aporte < 150000 ? 1 : 2
}

export const INVESTORS: Investor[] = [
  {
    id: 1,
    name: "ALEXANDRE LUCAS DE SOUZA",
    aporte: 100000,
    percentualMensal: 1.2,
    mesesAporte: 3,
    numeroSaques: 2,
    tier: 1,
    documentFolder: "alexandre-lucas",
    comprovantes: [
      { id: 1, data: "2026-01-16", dataFormatada: "16/01/2026", competencia: "01/2026", valor: 1200, status: "Pago", arquivo: "recibo-pagamento-2026-01-16.pdf" },
      { id: 2, data: "2025-12-17", dataFormatada: "17/12/2025", competencia: "12/2025", valor: 1200, status: "Pago", arquivo: "recibo-pagamento-2025-12-17.pdf" },
    ],
  },
  {
    id: 2,
    name: "AGRO FORTE DO BRASIL",
    aporte: 4200000,
    percentualMensal: 3.0,
    mesesAporte: 7,
    numeroSaques: 5,
    tier: 2,
    documentFolder: "agroforte",
    comprovantes: [
      { id: 1, data: "2026-01-16", dataFormatada: "16/01/2026", competencia: "01/2026", valor: 126000, status: "Pago", arquivo: "recibo-pagamento-2026-01-16.pdf" },
      { id: 2, data: "2025-12-17", dataFormatada: "17/12/2025", competencia: "12/2025", valor: 126000, status: "Pago", arquivo: "recibo-pagamento-2025-12-17.pdf" },
      { id: 3, data: "2025-11-17", dataFormatada: "17/11/2025", competencia: "11/2025", valor: 126000, status: "Pago", arquivo: "recibo-pagamento-2025-11-17.pdf" },
      { id: 4, data: "2025-10-18", dataFormatada: "18/10/2025", competencia: "10/2025", valor: 126000, status: "Pago", arquivo: "recibo-pagamento-2025-10-18.pdf" },
      { id: 5, data: "2025-09-18", dataFormatada: "18/09/2025", competencia: "09/2025", valor: 126000, status: "Pago", arquivo: "recibo-pagamento-2025-09-18.pdf" },
    ],
    safraData: {
      participacao: 8.5,
      producaoEstimada: "820 ton",
      valorEstimadoMin: 105000,
      valorEstimadoMax: 152500,
      cicloAtual: "2025/2026",
      etapaAtual: 3,
      progressoEtapa: 68,
    },
  },
  {
    id: 3,
    name: "INSTITUTO ESTADUAL DOS TRABALHADORES DE AÇAI",
    aporte: 2000000,
    percentualMensal: 2.8,
    mesesAporte: 4,
    numeroSaques: 3,
    tier: 2,
    documentFolder: "instituto-acai",
    comprovantes: [
      { id: 1, data: "2026-01-16", dataFormatada: "16/01/2026", competencia: "01/2026", valor: 56000, status: "Pago", arquivo: "recibo-pagamento-2026-01-16.pdf" },
      { id: 2, data: "2025-12-17", dataFormatada: "17/12/2025", competencia: "12/2025", valor: 56000, status: "Pago", arquivo: "recibo-pagamento-2025-12-17.pdf" },
      { id: 3, data: "2025-11-17", dataFormatada: "17/11/2025", competencia: "11/2025", valor: 56000, status: "Pago", arquivo: "recibo-pagamento-2025-11-17.pdf" },
    ],
    safraData: {
      participacao: 4.2,
      producaoEstimada: "380 ton",
      valorEstimadoMin: 36000,
      valorEstimadoMax: 54000,
      cicloAtual: "2025/2026",
      etapaAtual: 2,
      progressoEtapa: 45,
    },
  },
  {
    id: 4,
    name: "PRIME ASSESSORIA",
    aporte: 50000,
    percentualMensal: 1.5,
    mesesAporte: 3,
    numeroSaques: 2,
    tier: 1,
    documentFolder: "prime-assessoria",
    comprovantes: [],
  },
  {
    id: 5,
    name: "VIDA DIGNA",
    aporte: 1200000,
    percentualMensal: 2.3,
    mesesAporte: 4,
    numeroSaques: 3,
    tier: 2,
    documentFolder: "vida-digna",
    comprovantes: [
      { id: 1, data: "2026-01-16", dataFormatada: "16/01/2026", competencia: "01/2026", valor: 27600, status: "Pago", arquivo: "recibo-pagamento-2026-01-16.pdf" },
      { id: 2, data: "2025-12-17", dataFormatada: "17/12/2025", competencia: "12/2025", valor: 27600, status: "Pago", arquivo: "recibo-pagamento-2025-12-17.pdf" },
      { id: 3, data: "2025-11-17", dataFormatada: "17/11/2025", competencia: "11/2025", valor: 27600, status: "Pago", arquivo: "recibo-pagamento-2025-11-17.pdf" },
    ],
    safraData: {
      participacao: 2.8,
      producaoEstimada: "290 ton",
      valorEstimadoMin: 21600,
      valorEstimadoMax: 33000,
      cicloAtual: "2025/2026",
      etapaAtual: 3,
      progressoEtapa: 62,
    },
  },
  {
    id: 6,
    name: "AMICIA",
    aporte: 1980000,
    percentualMensal: 2.7,
    mesesAporte: 7,
    numeroSaques: 6,
    tier: 2,
    documentFolder: "amicia",
    comprovantes: [
      { id: 1, data: "2026-01-16", dataFormatada: "16/01/2026", competencia: "01/2026", valor: 53460, status: "Pago", arquivo: "recibo-pagamento-2026-01-16.pdf" },
      { id: 2, data: "2025-12-18", dataFormatada: "18/12/2025", competencia: "12/2025", valor: 53460, status: "Pago", arquivo: "recibo-pagamento-2025-12-18.pdf" },
      { id: 3, data: "2025-11-18", dataFormatada: "18/11/2025", competencia: "11/2025", valor: 53460, status: "Pago", arquivo: "recibo-pagamento-2025-11-18.pdf" },
      { id: 4, data: "2025-10-18", dataFormatada: "18/10/2025", competencia: "10/2025", valor: 53460, status: "Pago", arquivo: "recibo-pagamento-2025-10-18.pdf" },
      { id: 5, data: "2025-09-18", dataFormatada: "18/09/2025", competencia: "09/2025", valor: 53460, status: "Pago", arquivo: "recibo-pagamento-2025-09-18.pdf" },
      { id: 6, data: "2025-08-19", dataFormatada: "19/08/2025", competencia: "08/2025", valor: 53460, status: "Pago", arquivo: "recibo-pagamento-2025-08-19.pdf" },
    ],
    safraData: {
      participacao: 3.9,
      producaoEstimada: "425 ton",
      valorEstimadoMin: 29700,
      valorEstimadoMax: 47500,
      cicloAtual: "2025/2026",
      etapaAtual: 4,
      progressoEtapa: 78,
    },
  },
]

export function calculateInvestorData(investor: Investor): InvestorCalculated {
  const saqueMensal = investor.aporte * (investor.percentualMensal / 100)
  const totalSacado = investor.numeroSaques * saqueMensal
  const rendimentoAcumuladoNaoSacado = Math.max(0, (investor.mesesAporte - investor.numeroSaques) * saqueMensal)
  const patrimonioTotal = investor.aporte + rendimentoAcumuladoNaoSacado

  return {
    ...investor,
    saqueMensal,
    totalSacado,
    rendimentoAcumuladoNaoSacado,
    patrimonioTotal,
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}% a.m.`
}

export function formatMonths(value: number): string {
  return `${value} ${value === 1 ? "mês" : "meses"} de aporte`
}

export function getComprovantePath(documentFolder: string, arquivo: string): string {
  return `/documentos/comprovantes/${documentFolder}/${arquivo}`
}

export function downloadComprovante(documentFolder: string, arquivo: string): void {
  const path = getComprovantePath(documentFolder, arquivo)
  window.open(path, "_blank")
}
