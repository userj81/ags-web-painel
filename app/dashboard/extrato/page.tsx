"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Download, Calendar, Filter, ArrowLeft, ChevronDown, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useInvestor } from "@/contexts/investor-context"
import { getComprovantePath } from "@/lib/investors-data"

export default function ExtratoPage() {
  const router = useRouter()
  const { currentInvestor } = useInvestor()
  const [showFilters, setShowFilters] = useState(false)

  // Filters state
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos")
  const [competenceFilter, setCompetenceFilter] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Usa os comprovantes reais do investidor, ordenados por data (mais recente primeiro)
  const paymentData = useMemo(() => {
    const comprovantes = [...currentInvestor.comprovantes].sort((a, b) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    )
    return comprovantes
  }, [currentInvestor.comprovantes])

  const applyFilters = () => {
    const filters: string[] = []
    if (dateFrom && dateTo) filters.push(`Período: ${dateFrom} - ${dateTo}`)
    if (statusFilter !== "Todos") filters.push(`Status: ${statusFilter}`)
    if (competenceFilter) filters.push(`Competência: ${competenceFilter}`)
    setActiveFilters(filters)
    setShowFilters(false)
  }

  const clearFilters = () => {
    setDateFrom("")
    setDateTo("")
    setStatusFilter("Todos")
    setCompetenceFilter("")
    setActiveFilters([])
  }

  const removeFilter = (filterToRemove: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filterToRemove))
  }

  const handleDownloadPdf = (arquivo: string) => {
    const path = getComprovantePath(currentInvestor.documentFolder, arquivo)
    window.open(path, "_blank")
  }

  const totalPaid = paymentData.reduce((sum, p) => sum + p.valor, 0)
  const lastPaymentDate = paymentData.length > 0 ? paymentData[0].dataFormatada : "-"

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
      {/* Page Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="text-[#04164E]/60 hover:text-[#04164E] hover:bg-[#04164E]/5 mb-4 px-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h2 className="text-[#04164E] font-bold text-2xl md:text-3xl">Extrato</h2>
            <p className="text-[#04164E]/60 text-sm md:text-base mt-1">Histórico de pagamentos e comprovantes.</p>
          </div>

          <Card className="p-4 bg-white border border-[#04164E]/10">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-8">
                <span className="text-[#04164E]/60">Pagamentos realizados:</span>
                <span className="text-[#04164E] font-semibold">{currentInvestor.numeroSaques}</span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="text-[#04164E]/60">Total recebido:</span>
                <span className="text-[#00E000] font-semibold">
                  {totalPaid.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="text-[#04164E]/60">Última atualização:</span>
                <span className="text-[#04164E] font-semibold">{lastPaymentDate}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-6 mb-6 bg-gradient-to-r from-[#04164E]/5 to-white border border-[#04164E]/10">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[#04164E] font-semibold text-lg mb-3">Próximo pagamento</h3>
            <div className="space-y-2">
              <p className="text-[#04164E]">
                <span className="font-semibold">Data prevista:</span>{" "}
                {new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString("pt-BR")}
              </p>
              <p className="text-[#04164E]">
                <span className="font-semibold">Valor estimado:</span>{" "}
                {currentInvestor.saqueMensal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
              <Badge className="bg-[#00E000]/10 text-[#00E000] hover:bg-[#00E000]/20">Programado</Badge>
            </div>
            <p className="text-[#04164E]/40 text-xs mt-3">
              Estimativa conforme condições contratuais e calendário de processamento.
            </p>
          </div>
          <Calendar className="h-8 w-8 text-[#00E000]" />
        </div>
      </Card>

      {/* Filtros */}
      <Card className="p-4 md:p-6 mb-6 bg-white border border-[#04164E]/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#04164E] font-semibold text-base md:text-lg flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#00E000]" />
            Filtros
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-[#04164E] hover:bg-[#04164E]/5"
          >
            {showFilters ? "Ocultar" : "Mostrar"}
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </Button>
        </div>

        {showFilters && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Período */}
              <div>
                <label className="text-[#04164E]/60 text-sm mb-2 block">De</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-[#04164E]/20 rounded-lg focus:outline-none focus:border-[#04164E] text-sm"
                />
              </div>
              <div>
                <label className="text-[#04164E]/60 text-sm mb-2 block">Até</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-[#04164E]/20 rounded-lg focus:outline-none focus:border-[#04164E] text-sm"
                />
              </div>

              {/* Status */}
              <div>
                <label className="text-[#04164E]/60 text-sm mb-2 block">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-[#04164E]/20 rounded-lg focus:outline-none focus:border-[#04164E] text-sm"
                >
                  <option>Todos</option>
                  <option>Pago</option>
                  <option>Programado</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={applyFilters} className="bg-[#04164E] text-white hover:bg-[#04164E]/90 text-sm">
                Aplicar
              </Button>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="text-[#04164E] border-[#04164E]/20 hover:bg-[#04164E]/5 text-sm bg-transparent"
              >
                Limpar filtros
              </Button>
              <Button variant="ghost" className="text-[#04164E]/60 hover:text-[#04164E] hover:bg-[#04164E]/5 text-sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>
        )}

        {/* Active Filters Chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#04164E]/10">
            {activeFilters.map((filter, index) => (
              <Badge key={index} className="bg-[#04164E]/10 text-[#04164E] hover:bg-[#04164E]/20 pr-1">
                {filter}
                <button onClick={() => removeFilter(filter)} className="ml-2 hover:text-[#00E000]">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </Card>

      <Card className="hidden md:block p-6 bg-white border border-[#04164E]/10 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#04164E]/10">
              <th className="text-left py-3 px-4 text-[#04164E] font-semibold text-sm">Competência</th>
              <th className="text-left py-3 px-4 text-[#04164E] font-semibold text-sm">Data</th>
              <th className="text-left py-3 px-4 text-[#04164E] font-semibold text-sm">Valor</th>
              <th className="text-left py-3 px-4 text-[#04164E] font-semibold text-sm">Status</th>
              <th className="text-left py-3 px-4 text-[#04164E] font-semibold text-sm">Comprovante (PDF)</th>
            </tr>
          </thead>
          <tbody>
            {paymentData.map((payment) => (
              <tr key={payment.id} className="border-b border-[#04164E]/5 hover:bg-[#04164E]/5 transition-colors">
                <td className="py-4 px-4 text-[#04164E] font-medium text-sm">{payment.competencia}</td>
                <td className="py-4 px-4 text-[#04164E] text-sm">{payment.dataFormatada}</td>
                <td className="py-4 px-4 text-[#04164E] font-semibold text-sm">
                  {payment.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </td>
                <td className="py-4 px-4">
                  <Badge className="bg-[#00E000]/10 text-[#00E000] hover:bg-[#00E000]/20">{payment.status}</Badge>
                </td>
                <td className="py-4 px-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadPdf(payment.arquivo)}
                    className="text-[#04164E] border-[#04164E]/20 hover:bg-[#04164E]/5 text-xs bg-transparent"
                  >
                    <Download className="h-3 w-3 mr-2" />
                    Baixar PDF
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="md:hidden space-y-4">
        {paymentData.map((payment) => (
          <Card key={payment.id} className="p-4 bg-white border border-[#04164E]/10">
            <div className="flex items-start justify-between mb-3">
              <Badge className="bg-[#00E000]/10 text-[#00E000] hover:bg-[#00E000]/20">{payment.status}</Badge>
              <span className="text-[#04164E] font-semibold text-sm">{payment.competencia}</span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#04164E]/60">Data:</span>
                <span className="text-[#04164E] font-medium">{payment.dataFormatada}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#04164E]/60 text-sm">Valor:</span>
                <span className="text-[#04164E] font-bold text-lg">
                  {payment.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </div>
            </div>

            <Button
              onClick={() => handleDownloadPdf(payment.arquivo)}
              className="w-full bg-[#04164E] text-white hover:bg-[#04164E]/90 text-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar comprovante (PDF)
            </Button>
          </Card>
        ))}
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-8 text-center">
        <p className="text-[#04164E]/40 text-xs">
          As informações exibidas refletem registros de pagamentos e condições contratuais.
        </p>
      </div>
    </div>
  )
}
