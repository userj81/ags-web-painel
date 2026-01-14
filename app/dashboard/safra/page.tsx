"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, Info, Sprout } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useInvestor } from "@/contexts/investor-context"
import { formatCurrency } from "@/lib/investors-data"

const historico = [
  {
    safra: "Café Robusta Amazônico",
    ciclo: "2024/2025",
    status: "Concluída",
    temPdf: true,
  },
  {
    safra: "Fibra Vegetal (Curauá)",
    ciclo: "2023/2024",
    status: "Concluída",
    temPdf: true,
  },
]

const etapasNomes = ["Planejamento", "Plantio", "Desenvolvimento", "Colheita", "Apuração"]

export default function SafraPage() {
  const router = useRouter()
  const { currentInvestor } = useInvestor()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null)

  useEffect(() => {
    if (currentInvestor.tier !== 2) {
      router.push("/dashboard")
      return
    }
    setTimeout(() => setIsLoading(false), 800)
  }, [router, currentInvestor.tier])

  if (!currentInvestor.safraData) {
    return null
  }

  const safraData = currentInvestor.safraData

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#F6F8FC] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#04164E]"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="text-[#04164E]/60 hover:text-[#04164E] hover:bg-[#04164E]/5 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <h1 className="text-[#04164E] font-bold text-2xl md:text-3xl">Participação na Safra</h1>
          <Badge className="bg-[#00E000]/10 text-[#00E000] hover:bg-[#00E000]/20 w-fit">Disponível para Faixa 2</Badge>
        </div>
        <p className="text-[#04164E]/60 text-sm md:text-base mb-3">
          Acompanhe o ciclo produtivo e resultados vinculados à sua participação.
        </p>
        <div className="bg-[#E9EDF5] border border-[#04164E]/10 rounded-lg p-3">
          <p className="text-[#04164E]/70 text-xs md:text-sm">
            <strong>Aviso:</strong> Projeções são estimativas e podem variar conforme condições de produção e apuração.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6 bg-white border border-[#04164E]/10 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#04164E] font-semibold text-lg">Ciclo Atual</h2>
            <Sprout className="h-5 w-5 text-[#00E000]" />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[#04164E]/60 text-sm mb-1">Safra</p>
              <p className="text-[#04164E] font-semibold text-xl">{safraData.cicloAtual}</p>
            </div>

            <div>
              <p className="text-[#04164E]/60 text-sm mb-1">Cultura</p>
              <p className="text-[#04164E] font-semibold">Soja</p>
            </div>

            <div>
              <p className="text-[#04164E]/60 text-sm mb-1">Participação</p>
              <p className="text-[#04164E] font-semibold">{safraData.participacao.toFixed(1)}%</p>
            </div>

            <div>
              <p className="text-[#04164E]/60 text-sm mb-1">Produção Estimada</p>
              <p className="text-[#04164E] font-semibold">{safraData.producaoEstimada}</p>
            </div>

            <div className="pt-4 border-t border-[#04164E]/10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#04164E]/60 text-sm">Status do Ciclo</p>
                <span className="text-[#04164E] font-bold text-lg">{safraData.progressoEtapa}%</span>
              </div>

              <div className="relative">
                <div className="flex justify-between mb-2">
                  {etapasNomes.map((etapa, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                          index < safraData.etapaAtual
                            ? "bg-[#04164E] text-white"
                            : index === safraData.etapaAtual
                              ? "bg-[#00E000] text-white"
                              : "bg-[#E9EDF5] text-[#04164E]/40"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <p
                        className={`text-xs mt-2 text-center ${
                          index <= safraData.etapaAtual ? "text-[#04164E] font-medium" : "text-[#04164E]/40"
                        }`}
                      >
                        {etapa}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#E9EDF5] -z-10">
                  <div
                    className="h-full bg-[#04164E] transition-all duration-500"
                    style={{ width: `${(safraData.etapaAtual / (etapasNomes.length - 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-[#04164E]/10 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#04164E] font-semibold text-lg">Projeção (Estimativa)</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-5 w-5 text-[#04164E]/40" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">
                    Projeções são estimativas baseadas em dados preliminares e podem variar
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[#04164E]/60 text-sm mb-2">Faixa de projeção</p>
              <p className="text-[#00E000] font-bold text-2xl md:text-3xl">
                {formatCurrency(safraData.valorEstimadoMin)} – {formatCurrency(safraData.valorEstimadoMax)}
              </p>
            </div>

            <div className="pt-4 border-t border-[#04164E]/10">
              <p className="text-[#04164E]/60 text-sm mb-2">Base de cálculo</p>
              <p className="text-[#04164E]/80 text-sm leading-relaxed">
                Estimativa baseada em produtividade projetada e parâmetros contratuais.
              </p>
            </div>

            <div className="pt-4 border-t border-[#04164E]/10">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#04164E]/60 text-sm">Projetado (mínimo)</span>
                  <span className="text-[#04164E] font-semibold">{formatCurrency(safraData.valorEstimadoMin)}</span>
                </div>
                <div className="w-full bg-[#E9EDF5] rounded-full h-2">
                  <div className="bg-[#04164E]/40 h-2 rounded-full" style={{ width: "60%" }} />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[#04164E]/60 text-sm">Projetado (máximo)</span>
                  <span className="text-[#00E000] font-semibold">{formatCurrency(safraData.valorEstimadoMax)}</span>
                </div>
                <div className="w-full bg-[#E9EDF5] rounded-full h-2">
                  <div className="bg-[#00E000] h-2 rounded-full" style={{ width: "85%" }} />
                </div>
              </div>
            </div>

            <div className="bg-[#E9EDF5] rounded-lg p-3 mt-4">
              <p className="text-[#04164E]/70 text-xs leading-relaxed">
                <strong>Importante:</strong> Valores estimados. O resultado final depende da colheita e apuração.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-white border border-[#04164E]/10 shadow-sm mb-6">
        <h2 className="text-[#04164E] font-semibold text-lg mb-4">Resumo da Participação</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00E000] mt-2" />
            <div>
              <p className="text-[#04164E] font-medium">Participação vinculada: Sim (Faixa 2)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00E000] mt-2" />
            <div>
              <p className="text-[#04164E] font-medium">Apuração: ao final do ciclo</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00E000] mt-2" />
            <div>
              <p className="text-[#04164E] font-medium">Pagamento/repasse: conforme calendário e contrato</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00E000] mt-2" />
            <div>
              <p className="text-[#04164E] font-medium">Competência de referência: 01/2026</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white border border-[#04164E]/10 shadow-sm">
        <h2 className="text-[#04164E] font-semibold text-lg mb-4">Histórico de Safras Anteriores</h2>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#04164E]/10">
                <th className="text-left py-3 px-4 text-[#04164E]/60 font-semibold text-sm">Nome da Safra</th>
                <th className="text-left py-3 px-4 text-[#04164E]/60 font-semibold text-sm">Ciclo/Ano</th>
                <th className="text-left py-3 px-4 text-[#04164E]/60 font-semibold text-sm">Status</th>
                <th className="text-left py-3 px-4 text-[#04164E]/60 font-semibold text-sm">Ações</th>
              </tr>
            </thead>
            <tbody>
              {historico.map((item, index) => (
                <tr key={index} className="border-b border-[#04164E]/10 hover:bg-[#F6F8FC] transition-colors">
                  <td className="py-4 px-4 text-[#04164E] font-medium">{item.safra}</td>
                  <td className="py-4 px-4 text-[#04164E]">{item.ciclo}</td>
                  <td className="py-4 px-4">
                    <Badge className="bg-[#00E000]/10 text-[#00E000] hover:bg-[#00E000]/20">{item.status}</Badge>
                  </td>
                  <td className="py-4 px-4">
                    {item.temPdf && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[#04164E] border-[#04164E]/20 hover:bg-[#04164E]/5 bg-transparent"
                            onClick={() => setSelectedPdf(item.safra)}
                          >
                            Ver detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{item.safra}</DialogTitle>
                            <DialogDescription>
                              Detalhes e documentação da safra {item.safra} ({item.ciclo})
                            </DialogDescription>
                          </DialogHeader>
                          <div className="bg-[#F6F8FC] rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                            <div className="text-center">
                              <Sprout className="h-16 w-16 text-[#04164E]/40 mx-auto mb-4" />
                              <p className="text-[#04164E]/60 mb-4">Preview do documento</p>
                              <Button className="bg-[#04164E] text-white hover:bg-[#04164E]/90">
                                <Download className="h-4 w-4 mr-2" />
                                Baixar Documento
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {historico.map((item, index) => (
            <Card key={index} className="p-4 border border-[#04164E]/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[#04164E] font-semibold">{item.safra}</h3>
                <Badge className="bg-[#00E000]/10 text-[#00E000] hover:bg-[#00E000]/20">{item.status}</Badge>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-[#04164E]/60">Ciclo/Ano:</span>
                  <span className="text-[#04164E] font-medium">{item.ciclo}</span>
                </div>
              </div>
              {item.temPdf && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-[#04164E] border-[#04164E]/20 hover:bg-[#04164E]/5 bg-transparent"
                      onClick={() => setSelectedPdf(item.safra)}
                    >
                      Ver detalhes
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{item.safra}</DialogTitle>
                      <DialogDescription>
                        Detalhes e documentação da safra {item.safra} ({item.ciclo})
                      </DialogDescription>
                    </DialogHeader>
                    <div className="bg-[#F6F8FC] rounded-lg p-8 min-h-[300px] flex items-center justify-center">
                      <div className="text-center">
                        <Sprout className="h-16 w-16 text-[#04164E]/40 mx-auto mb-4" />
                        <p className="text-[#04164E]/60 mb-4">Preview do documento</p>
                        <Button className="bg-[#04164E] text-white hover:bg-[#04164E]/90">
                          <Download className="h-4 w-4 mr-2" />
                          Baixar Documento
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </Card>
          ))}
        </div>
      </Card>

      <div className="bg-[#E9EDF5] border border-[#04164E]/10 rounded-lg p-4 mt-6">
        <p className="text-[#04164E]/70 text-xs leading-relaxed text-center">
          Resultados e projeções seguem critérios de apuração e condições operacionais, conforme documentos e contrato.
        </p>
      </div>
    </div>
  )
}
