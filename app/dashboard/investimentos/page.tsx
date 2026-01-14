"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileCheck, Calendar, Filter } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useInvestor } from "@/contexts/investor-context"

export default function InvestimentosPage() {
  const router = useRouter()
  const { currentInvestor } = useInvestor()
  const [filterStatus, setFilterStatus] = useState("Todos")
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const aporteDate = new Date()
  aporteDate.setMonth(aporteDate.getMonth() - currentInvestor.mesesAporte)

  const endDate = new Date()
  endDate.setMonth(endDate.getMonth() + (24 - currentInvestor.mesesAporte))

  const investmentsList = [
    {
      id: 1,
      date: aporteDate.toLocaleDateString("pt-BR"),
      value: currentInvestor.aporte,
      rate: currentInvestor.percentualMensal,
      term: `${currentInvestor.mesesAporte} meses`,
      startDate: aporteDate.toLocaleDateString("pt-BR"),
      endDate: endDate.toLocaleDateString("pt-BR"),
      status: "Ativo",
      remuneration: "Mensal conforme contrato",
      nextCompetence: new Date().toLocaleDateString("pt-BR", { month: "2-digit", year: "numeric" }),
      observations: `Investimento vinculado ao perfil ${currentInvestor.name}. Rentabilidade de ${currentInvestor.percentualMensal}% a.m. com pagamento mensal.`,
    },
  ]

  const filteredInvestments = investmentsList.filter((inv) => {
    if (filterStatus === "Todos") return true
    return inv.status === filterStatus
  })

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="text-[#04164E]/60 hover:text-[#04164E] hover:bg-[#04164E]/5 -ml-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[#04164E] font-bold text-2xl md:text-3xl mb-2">Meus Investimentos</h1>
            <p className="text-[#04164E]/60 text-sm md:text-base">
              Acompanhe seus aportes, taxas e prazos contratuais.
            </p>
          </div>

          <Card className="lg:w-auto p-4 bg-white border border-[#04164E]/10">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div>
                <p className="text-[#04164E]/60 text-xs mb-1">Total investido</p>
                <p className="text-[#04164E] font-bold text-xl">{formatCurrency(currentInvestor.aporte)}</p>
              </div>
              <div>
                <p className="text-[#04164E]/60 text-xs mb-1">Investimentos ativos</p>
                <p className="text-[#04164E] font-bold text-xl">1</p>
              </div>
              <div>
                <p className="text-[#04164E]/60 text-xs mb-1">Faixa</p>
                <Badge className="bg-[#04164E]/10 text-[#04164E] hover:bg-[#04164E]/20 text-base">
                  Faixa {currentInvestor.tier}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-4 md:p-6 bg-white border border-[#04164E]/10 mb-6">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-start md:items-center">
          <Filter className="h-5 w-5 text-[#04164E]/60 hidden md:block" />
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterStatus === "Todos" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("Todos")}
                className={`${
                  filterStatus === "Todos"
                    ? "bg-[#04164E] text-white hover:bg-[#04164E]/90"
                    : "text-[#04164E] border-[#04164E]/20 hover:bg-[#04164E]/5"
                }`}
              >
                Todos
              </Button>
              <Button
                variant={filterStatus === "Ativo" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("Ativo")}
                className={`${
                  filterStatus === "Ativo"
                    ? "bg-[#04164E] text-white hover:bg-[#04164E]/90"
                    : "text-[#04164E] border-[#04164E]/20 hover:bg-[#04164E]/5"
                }`}
              >
                Ativo
              </Button>
              <Button
                variant={filterStatus === "Encerrado" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("Encerrado")}
                className={`${
                  filterStatus === "Encerrado"
                    ? "bg-[#04164E] text-white hover:bg-[#04164E]/90"
                    : "text-[#04164E] border-[#04164E]/20 hover:bg-[#04164E]/5"
                }`}
              >
                Encerrado
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilterStatus("Todos")}
            className="text-[#04164E]/60 hover:text-[#04164E] hover:bg-[#04164E]/5 w-full sm:w-auto"
          >
            Limpar filtros
          </Button>
        </div>
      </Card>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Card className="p-0 bg-white border border-[#04164E]/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#04164E]/5 border-b border-[#04164E]/10">
                <tr>
                  <th className="text-left p-4 text-[#04164E] font-semibold text-sm">Data do aporte</th>
                  <th className="text-left p-4 text-[#04164E] font-semibold text-sm">Valor aportado</th>
                  <th className="text-left p-4 text-[#04164E] font-semibold text-sm">Taxa contratada</th>
                  <th className="text-left p-4 text-[#04164E] font-semibold text-sm">Prazo do contrato</th>
                  <th className="text-left p-4 text-[#04164E] font-semibold text-sm">Status</th>
                  <th className="text-left p-4 text-[#04164E] font-semibold text-sm">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvestments.map((investment) => (
                  <tr
                    key={investment.id}
                    className="border-b border-[#04164E]/5 hover:bg-[#04164E]/[0.02] transition-colors cursor-pointer"
                    onClick={() => setSelectedInvestment(investment)}
                  >
                    <td className="p-4 text-[#04164E]">{investment.date}</td>
                    <td className="p-4 text-[#04164E] font-semibold">{formatCurrency(investment.value)}</td>
                    <td className="p-4">
                      <span className="text-[#00E000] font-semibold">{investment.rate}%</span>
                      <span className="text-[#04164E]/60 text-sm"> a.m.</span>
                    </td>
                    <td className="p-4 text-[#04164E]">{investment.term}</td>
                    <td className="p-4">
                      <Badge
                        className={`${
                          investment.status === "Ativo"
                            ? "bg-[#00E000]/10 text-[#00E000] hover:bg-[#00E000]/20"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {investment.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedInvestment(investment)
                        }}
                        className="text-[#04164E] hover:text-[#00E000] hover:bg-[#04164E]/5"
                      >
                        Ver detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredInvestments.map((investment) => (
          <Card
            key={investment.id}
            className="p-4 bg-white border border-[#04164E]/10 hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedInvestment(investment)}
          >
            <div className="flex items-center justify-between mb-3">
              <Badge
                className={`${
                  investment.status === "Ativo"
                    ? "bg-[#00E000]/10 text-[#00E000] hover:bg-[#00E000]/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {investment.status}
              </Badge>
              <span className="text-[#04164E]/60 text-sm flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {investment.date}
              </span>
            </div>

            <div className="mb-3">
              <p className="text-[#04164E]/60 text-xs mb-1">Valor aportado</p>
              <p className="text-[#04164E] font-bold text-2xl">{formatCurrency(investment.value)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-[#04164E]/60 text-xs mb-1">Taxa contratada</p>
                <p className="text-[#00E000] font-semibold text-lg">{investment.rate}% a.m.</p>
              </div>
              <div>
                <p className="text-[#04164E]/60 text-xs mb-1">Prazo do contrato</p>
                <p className="text-[#04164E] font-semibold">{investment.term}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-[#04164E] border-[#04164E]/20 hover:bg-[#04164E]/5 bg-transparent"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedInvestment(investment)
              }}
            >
              <FileCheck className="h-4 w-4 mr-2" />
              Ver detalhes
            </Button>
          </Card>
        ))}
      </div>

      {filteredInvestments.length === 0 && (
        <Card className="p-8 bg-white border border-[#04164E]/10 text-center">
          <p className="text-[#04164E]/60">Nenhum investimento encontrado para os filtros selecionados.</p>
        </Card>
      )}

      <p className="text-[#04164E]/40 text-xs mt-6 text-center">
        As informações exibidas refletem condições contratuais e histórico registrado.
      </p>

      <Dialog open={!!selectedInvestment} onOpenChange={() => setSelectedInvestment(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#04164E] text-xl font-bold">Detalhe do Investimento</DialogTitle>
            <DialogDescription className="text-[#04164E]/60">
              Informações completas do contrato de investimento
            </DialogDescription>
          </DialogHeader>

          {selectedInvestment && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#04164E]/60 text-xs mb-1">Data do aporte</p>
                  <p className="text-[#04164E] font-semibold">{selectedInvestment.date}</p>
                </div>
                <div>
                  <p className="text-[#04164E]/60 text-xs mb-1">Status</p>
                  <Badge
                    className={`${
                      selectedInvestment.status === "Ativo"
                        ? "bg-[#00E000]/10 text-[#00E000] hover:bg-[#00E000]/20"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {selectedInvestment.status}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-[#04164E]/60 text-xs mb-1">Valor aportado</p>
                <p className="text-[#04164E] font-bold text-2xl">{formatCurrency(selectedInvestment.value)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#04164E]/60 text-xs mb-1">Taxa contratada</p>
                  <p className="text-[#00E000] font-semibold text-lg">{selectedInvestment.rate}% a.m.</p>
                </div>
                <div>
                  <p className="text-[#04164E]/60 text-xs mb-1">Prazo do contrato</p>
                  <p className="text-[#04164E] font-semibold">{selectedInvestment.term}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#04164E]/60 text-xs mb-1">Início do contrato</p>
                  <p className="text-[#04164E] font-semibold">{selectedInvestment.startDate}</p>
                </div>
                <div>
                  <p className="text-[#04164E]/60 text-xs mb-1">Fim do contrato</p>
                  <p className="text-[#04164E] font-semibold">{selectedInvestment.endDate}</p>
                </div>
              </div>

              <div>
                <p className="text-[#04164E]/60 text-xs mb-1">Forma de remuneração</p>
                <p className="text-[#04164E] font-semibold">{selectedInvestment.remuneration}</p>
              </div>

              <div>
                <p className="text-[#04164E]/60 text-xs mb-1">Próxima competência</p>
                <p className="text-[#04164E] font-semibold">{selectedInvestment.nextCompetence}</p>
              </div>

              <div className="pt-4 border-t border-[#04164E]/10">
                <p className="text-[#04164E]/60 text-xs mb-1">Observações</p>
                <p className="text-[#04164E] text-sm leading-relaxed">{selectedInvestment.observations}</p>
              </div>

              <div className="bg-[#EEF2FA] rounded-lg p-3">
                <p className="text-[#04164E]/70 text-xs leading-relaxed">
                  Informações contratuais. Para dúvidas, entre em contato com o suporte.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
