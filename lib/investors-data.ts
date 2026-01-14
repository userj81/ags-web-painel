export interface Investor {
  id: number
  name: string
  aporte: number
  percentualMensal: number
  mesesAporte: number
  numeroSaques: number
  tier: 1 | 2
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
    aporte: 100000, // Faixa 1 (50k - 100k)
    percentualMensal: 1.2, // Faixa 1: 1,2% - 1,5%
    mesesAporte: 3,
    numeroSaques: 2,
    tier: 1, // < 150k = Faixa 1
    // Sem safraData (Faixa 1 não tem garantia/safra)
  },
  {
    id: 2,
    name: "AGRO FORTE DO BRASIL",
    aporte: 4200000, // Faixa 2 (≥ 150k)
    percentualMensal: 3.0, // 2M+ → até 3% a.m.
    mesesAporte: 7,
    numeroSaques: 5,
    tier: 2, // ≥ 150k = Faixa 2
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
    aporte: 2000000, // Faixa 2 (≥ 150k)
    percentualMensal: 2.8, // 2M → até 3% a.m.
    mesesAporte: 4,
    numeroSaques: 3,
    tier: 2, // ≥ 150k = Faixa 2
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
    aporte: 50000, // Ajustado para R$ 50k (mínimo Faixa 1)
    percentualMensal: 1.5, // Faixa 1: 1,2% - 1,5%
    mesesAporte: 3,
    numeroSaques: 2,
    tier: 1, // < 150k = Faixa 1
    // Sem safraData (Faixa 1 não tem garantia/safra)
  },
  {
    id: 5,
    name: "VIDA DIGNA",
    aporte: 1200000, // Faixa 2 (≥ 150k)
    percentualMensal: 2.3, // 1,2M → ~2,3% a.m.
    mesesAporte: 4,
    numeroSaques: 3,
    tier: 2, // ≥ 150k = Faixa 2
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
    aporte: 1980000, // Faixa 2 (≥ 150k)
    percentualMensal: 2.7, // ~2M → até 3% a.m.
    mesesAporte: 7,
    numeroSaques: 6,
    tier: 2, // ≥ 150k = Faixa 2
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
