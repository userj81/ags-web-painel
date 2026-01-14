"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  TrendingUp,
  Wallet,
  Calendar,
  FileText,
  FolderOpen,
  Headphones,
  ArrowRight,
  Info,
  CircleDot,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart } from "recharts"
import { useInvestor } from "@/contexts/investor-context"
import { formatCurrency, formatPercentage } from "@/lib/investors-data"

export default function DashboardPage() {
  const [chartPeriod, setChartPeriod] = useState("6M")
  const [chartMetric, setChartMetric] = useState<"patrimonioTotal" | "rendimento">("patrimonioTotal")

  const { currentInvestor } = useInvestor()

  const allChartData = useMemo(() => {
    const data = []
    const baseDate = new Date()
    baseDate.setMonth(baseDate.getMonth() - currentInvestor.mesesAporte)

    for (let i = 0; i <= currentInvestor.mesesAporte; i++) {
      const month = new Date(baseDate)
      month.setMonth(month.getMonth() + i)
      const monthLabel = month.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })

      const rendimento = i * currentInvestor.saqueMensal
      const patrimonioTotal = currentInvestor.aporte + rendimento

      data.push({
        month: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
        aportes: currentInvestor.aporte,
        rendimento: rendimento,
        patrimonioTotal: patrimonioTotal,
      })
    }
    return data
  }, [currentInvestor])

  const getFilteredChartData = () => {
    const dataLength = allChartData.length
    switch (chartPeriod) {
      case "7D":
        return allChartData.slice(-1)
      case "1M":
        return allChartData.slice(-1)
      case "3M":
        return allChartData.slice(-3)
      case "6M":
        return allChartData.slice(-6)
      case "1A":
        return allChartData.slice(-12)
      case "Tudo":
        return allChartData
      default:
        return allChartData.slice(-6)
    }
  }

  const chartData = getFilteredChartData()

  const calculateVariation = () => {
    if (chartData.length < 2) return 0
    const first = chartData[0][chartMetric]
    const last = chartData[chartData.length - 1][chartMetric]
    return last - first
  }

  const nextPaymentDate = useMemo(() => {
    const date = new Date()
    date.setMonth(date.getMonth() + 1)
    return date.toLocaleDateString("pt-BR")
  }, [])

  return (
    <div className="p-4 md:p-8 space-y-5 md:space-y-6">
      <Card className="relative overflow-hidden p-5 bg-gradient-to-br from-[#04164E]/[0.02] to-transparent border-t-2 border-t-[#04164E] border-l border-r border-b border-[#04164E]/10 rounded-[16px] shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E000]/[0.03] rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[#04164E]/60 text-[10px] font-semibold uppercase tracking-wide mb-2">
                Patrimônio total
              </p>
              <p className="text-[#04164E] font-bold text-3xl md:text-4xl mb-2">
                {formatCurrency(currentInvestor.patrimonioTotal)}
              </p>
              <div className="flex items-center gap-3 text-[10px] text-[#04164E]/60 font-medium">
                <span>Investido: {formatCurrency(currentInvestor.aporte)}</span>
                <span className="text-[#04164E]/30">•</span>
                <span className="text-[#00E000]">
                  Rendimento: {formatCurrency(currentInvestor.rendimentoAcumuladoNaoSacado)}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <Badge className="flex items-center gap-1.5 px-2.5 py-1 bg-[#00E000]/5 border border-[#00E000]/20 rounded-full hover:bg-[#00E000]/5">
                <CircleDot className="h-3 w-3 text-[#00E000] fill-[#00E000]" />
                <span className="text-[#00E000] text-[10px] font-semibold">ATIVO</span>
              </Badge>
              <div className="w-20 h-10 opacity-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={allChartData.slice(-12)}>
                    <Line type="monotone" dataKey="patrimonioTotal" stroke="#04164E" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-3">
            <Link href="#evolucao">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#04164E] hover:bg-[#04164E]/5 text-[11px] font-medium h-8 px-3"
              >
                Ver evolução completa
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="space-y-2.5">
        <h3 className="text-[#04164E]/70 text-[10px] font-semibold uppercase tracking-wide px-1">Resumo</h3>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <Card className="p-4 bg-white border border-[#04164E]/10 rounded-[12px] shadow-sm min-h-[110px] flex flex-col">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F6F8FC] mb-2.5">
              <Wallet className="h-4 w-4 text-[#04164E]/60" />
            </div>
            <p className="text-[#04164E]/60 text-[9px] font-medium uppercase tracking-wide mb-1">Investido</p>
            <p className="text-[#04164E] font-bold text-xl mt-auto">{formatCurrency(currentInvestor.aporte)}</p>
          </Card>

          <Card className="p-4 bg-white border border-[#04164E]/10 rounded-[12px] shadow-sm min-h-[110px] flex flex-col">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F6F8FC] mb-2.5">
              <TrendingUp className="h-4 w-4 text-[#00E000]/80" />
            </div>
            <p className="text-[#04164E]/60 text-[9px] font-medium uppercase tracking-wide mb-1">Rendimento</p>
            <div className="mt-auto">
              <p className="text-[#04164E] font-bold text-xl mb-1.5">
                {formatCurrency(currentInvestor.rendimentoAcumuladoNaoSacado)}
              </p>
              <Badge className="bg-[#00E000]/10 text-[#00E000] hover:bg-[#00E000]/15 text-[8px] px-1.5 py-0 font-semibold">
                EM DIA
              </Badge>
            </div>
          </Card>
        </div>

        <Card className="p-4 bg-white border border-[#04164E]/10 rounded-[12px] shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F6F8FC]">
                <Info className="h-4 w-4 text-[#04164E]/60" />
              </div>
              <p className="text-[#04164E]/60 text-[9px] font-medium uppercase tracking-wide">
                Rentabilidade contratada
              </p>
            </div>
            <Badge className="bg-[#00E000]/10 text-[#00E000] hover:bg-[#00E000]/15 text-[8px] px-2 py-0.5 font-semibold">
              FIXO
            </Badge>
          </div>
          <p className="text-[#04164E] font-bold text-2xl mb-2">{formatPercentage(currentInvestor.percentualMensal)}</p>
          <div className="flex items-center gap-2 text-[9px] text-[#04164E]/50">
            <span>Tipo: Fixo</span>
            <span className="text-[#04164E]/30">•</span>
            <span>Conforme contrato vigente</span>
          </div>
        </Card>
      </div>

      <Card className="p-4 bg-white border border-[#04164E]/10 rounded-[14px] shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F6F8FC]">
              <Calendar className="h-4 w-4 text-[#04164E]/60" />
            </div>
            <p className="text-[#04164E]/70 text-[10px] font-semibold uppercase tracking-wide">Próximo pagamento</p>
          </div>
          <Badge className="bg-[#04164E]/5 text-[#04164E] border border-[#04164E]/10 text-[9px] px-2 py-0.5">
            Programado
          </Badge>
        </div>
        <div className="space-y-1.5 mb-3.5">
          <div className="flex items-baseline gap-2">
            <p className="text-[#04164E] font-bold text-2xl">{formatCurrency(currentInvestor.saqueMensal)}</p>
            <p className="text-[#04164E]/50 text-xs">em {nextPaymentDate}</p>
          </div>
          <p className="text-[#04164E]/40 text-[10px]">Estimativa conforme contrato</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/extrato" className="flex-1">
            <Button
              size="sm"
              className="w-full bg-[#04164E] hover:bg-[#04164E]/90 text-white text-[11px] font-medium h-9"
            >
              Ver extrato
            </Button>
          </Link>
          <Link href="/dashboard/extrato" className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-[#04164E]/20 hover:bg-[#04164E]/5 text-[#04164E] text-[11px] font-medium h-9 bg-transparent"
            >
              Ver detalhes
            </Button>
          </Link>
        </div>
      </Card>

      <div className="space-y-2.5">
        <h3 className="text-[#04164E]/70 text-[10px] font-semibold uppercase tracking-wide px-1">Ações rápidas</h3>
        <div className="grid grid-cols-2 gap-2.5 md:gap-3">
          <Link href="/dashboard/extrato">
            <Card className="p-3.5 bg-white border border-[#04164E]/10 rounded-[12px] hover:bg-[#04164E]/5 hover:border-[#04164E]/20 transition-all shadow-sm h-[100px] flex flex-col">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F6F8FC] mb-2.5">
                <FileText className="h-4.5 w-4.5 text-[#04164E]" />
              </div>
              <p className="text-[#04164E] text-xs font-semibold mb-0.5">Extrato</p>
              <p className="text-[#04164E]/50 text-[9px] leading-tight">Pagamentos e PDFs</p>
            </Card>
          </Link>

          <Link href="/dashboard/investimentos">
            <Card className="p-3.5 bg-white border border-[#04164E]/10 rounded-[12px] hover:bg-[#04164E]/5 hover:border-[#04164E]/20 transition-all shadow-sm h-[100px] flex flex-col">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F6F8FC] mb-2.5">
                <TrendingUp className="h-4.5 w-4.5 text-[#04164E]" />
              </div>
              <p className="text-[#04164E] text-xs font-semibold mb-0.5">Investimentos</p>
              <p className="text-[#04164E]/50 text-[9px] leading-tight">Contratos ativos</p>
            </Card>
          </Link>

          <Link href="/dashboard/documentos">
            <Card className="p-3.5 bg-white border border-[#04164E]/10 rounded-[12px] hover:bg-[#04164E]/5 hover:border-[#04164E]/20 transition-all shadow-sm h-[100px] flex flex-col">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F6F8FC] mb-2.5">
                <FolderOpen className="h-4.5 w-4.5 text-[#04164E]" />
              </div>
              <p className="text-[#04164E] text-xs font-semibold mb-0.5">Documentos</p>
              <p className="text-[#04164E]/50 text-[9px] leading-tight">Contratos e termos</p>
            </Card>
          </Link>

          <Link href="/dashboard/suporte">
            <Card className="p-3.5 bg-white border border-[#04164E]/10 rounded-[12px] hover:bg-[#04164E]/5 hover:border-[#04164E]/20 transition-all shadow-sm h-[100px] flex flex-col">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F6F8FC] mb-2.5">
                <Headphones className="h-4.5 w-4.5 text-[#04164E]" />
              </div>
              <p className="text-[#04164E] text-xs font-semibold mb-0.5">Suporte</p>
              <p className="text-[#04164E]/50 text-[9px] leading-tight">Atendimento</p>
            </Card>
          </Link>
        </div>
      </div>

      <Card id="evolucao" className="p-4 md:p-6 bg-white border border-[#04164E]/10 rounded-[14px] shadow-sm">
        <div className="space-y-3.5">
          <div className="flex items-start justify-between">
            <h2 className="text-[#04164E] font-semibold text-base">Evolução patrimonial</h2>
            <div className="text-right">
              <p className="text-[#04164E] font-semibold text-sm">
                {calculateVariation() >= 0 ? "+" : ""}
                {formatCurrency(calculateVariation())}
              </p>
              <p className="text-[#04164E]/50 text-[9px]">Variação no período</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="inline-flex rounded-lg border border-[#04164E]/15 p-0.5 bg-[#F6F8FC]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChartMetric("patrimonioTotal")}
                className={`text-[10px] px-3 py-1.5 rounded-md transition-all ${
                  chartMetric === "patrimonioTotal"
                    ? "bg-[#04164E] text-white shadow-sm font-semibold"
                    : "text-[#04164E]/60 hover:text-[#04164E] hover:bg-transparent"
                }`}
              >
                Patrimônio total
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChartMetric("rendimento")}
                className={`text-[10px] px-3 py-1.5 rounded-md transition-all ${
                  chartMetric === "rendimento"
                    ? "bg-[#04164E] text-white shadow-sm font-semibold"
                    : "text-[#04164E]/60 hover:text-[#04164E] hover:bg-transparent"
                }`}
              >
                Rendimento
              </Button>
            </div>

            <div className="inline-flex rounded-lg border border-[#04164E]/15 p-0.5 bg-[#F6F8FC] flex-wrap gap-0.5">
              {["6M", "12M", "Tudo"].map((period) => (
                <Button
                  key={period}
                  variant="ghost"
                  size="sm"
                  onClick={() => setChartPeriod(period === "12M" ? "1A" : period)}
                  className={`text-[10px] px-3 py-1.5 rounded-md transition-all ${
                    (period === "6M" && chartPeriod === "6M") ||
                    (period === "12M" && chartPeriod === "1A") ||
                    (period === "Tudo" && chartPeriod === "Tudo")
                      ? "bg-[#04164E] text-white shadow-sm font-semibold"
                      : "text-[#04164E]/60 hover:text-[#04164E] hover:bg-transparent"
                  }`}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#04164E10" vertical={false} />
              <XAxis dataKey="month" stroke="#04164E" style={{ fontSize: "10px" }} tick={{ fill: "#04164E99" }} />
              <YAxis
                stroke="#04164E"
                style={{ fontSize: "10px" }}
                tick={{ fill: "#04164E99" }}
                width={60}
                domain={chartMetric === "rendimento" ? ["auto", "auto"] : undefined}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #04164E20",
                  borderRadius: "10px",
                  fontSize: "11px",
                  padding: "8px 12px",
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Line
                type="monotone"
                dataKey={chartMetric}
                stroke={chartMetric === "patrimonioTotal" ? "#04164E" : "#00E000"}
                strokeWidth={3}
                name={chartMetric === "patrimonioTotal" ? "Patrimônio total" : "Rendimento acumulado"}
                dot={{ fill: chartMetric === "patrimonioTotal" ? "#04164E" : "#00E000", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="pt-3 border-t border-[#04164E]/10 flex items-start justify-between gap-3">
            <p className="text-[#04164E]/50 text-[10px] leading-relaxed flex-1">
              Os valores exibidos refletem informações contratuais e histórico de pagamentos. Rendimentos são
              estimativas sujeitas à apuração final da safra.
            </p>
            <p className="text-[#04164E]/40 text-[9px] whitespace-nowrap">
              Atualizado em {new Date().toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
