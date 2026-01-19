"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { X, Search, Download, Eye, FileCheck, ChevronDown, Calendar, Filter, FolderOpen, ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useInvestor } from "@/contexts/investor-context"
import { getComprovantePath } from "@/lib/investors-data"

export default function DocumentosPage() {
  const router = useRouter()
  const { currentInvestor } = useInvestor()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedType, setSelectedType] = useState("Todos")
  const [selectedYear, setSelectedYear] = useState("Todos")
  const [selectedDocument, setSelectedDocument] = useState<{id: number; name: string; type: string; available: boolean} | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState<number | null>(null)

  // Documentos fixos (contratos, termos, etc)
  const fixedDocuments = useMemo(() => {
    const docs = [
      {
        id: 100,
        name: `Contrato_AGS_${currentInvestor.name.split(" ")[0]}.pdf`,
        type: "Contrato",
        category: "Contratos",
        competence: null,
        issueDate: "01/02/2026",
        available: true,
        pinned: true,
        arquivo: null,
      },
      {
        id: 101,
        name: `InformeRendimentos_2025.pdf`,
        type: "Informe",
        category: "Informe de rendimentos",
        competence: null,
        issueDate: "20/01/2026",
        available: true,
        pinned: true,
        arquivo: null,
      },
    ]

    // Adiciona Termo de Uso apenas para Faixa 2
    if (currentInvestor.tier === 2) {
      docs.push({
        id: 102,
        name: "TermoDeUso_TU-AGS-2026-00012.pdf",
        type: "Termo",
        category: "Termos",
        competence: null,
        issueDate: "01/02/2026",
        available: true,
        pinned: true,
        arquivo: null,
      })
      docs.push({
        id: 103,
        name: "RelatorioSafra_2024-2025.pdf",
        type: "Safra",
        category: "Safra",
        competence: null,
        issueDate: "18/05/2025",
        available: true,
        pinned: false,
        arquivo: null,
      })
    }

    return docs
  }, [currentInvestor.name, currentInvestor.tier])

  // Comprovantes reais do investidor
  const comprovanteDocuments = useMemo(() => {
    return currentInvestor.comprovantes.map((comp, index) => ({
      id: index + 1,
      name: `Comprovante_${comp.competencia.replace("/", "-")}.pdf`,
      type: "Comprovante",
      category: "Comprovantes",
      competence: comp.competencia,
      issueDate: comp.dataFormatada,
      available: true,
      pinned: false,
      arquivo: comp.arquivo,
    })).sort((a, b) => {
      // Ordenar por data (mais recente primeiro)
      const [mesA, anoA] = a.competence!.split("/")
      const [mesB, anoB] = b.competence!.split("/")
      const dateA = new Date(Number(anoA), Number(mesA) - 1)
      const dateB = new Date(Number(anoB), Number(mesB) - 1)
      return dateB.getTime() - dateA.getTime()
    })
  }, [currentInvestor.comprovantes])

  // Todos os documentos combinados
  const allDocuments = useMemo(() => {
    return [...fixedDocuments, ...comprovanteDocuments]
  }, [fixedDocuments, comprovanteDocuments])

  const categories = currentInvestor.tier === 2 
    ? ["Todos", "Contratos", "Termos", "Comprovantes", "Informe de rendimentos", "Safra"]
    : ["Todos", "Contratos", "Comprovantes", "Informe de rendimentos"]

  const types = currentInvestor.tier === 2
    ? ["Todos", "Contrato", "Termo", "Comprovante", "Informe", "Safra"]
    : ["Todos", "Contrato", "Comprovante", "Informe"]

  const years = ["Todos", "2026", "2025", "2024"]

  const filteredDocuments = allDocuments.filter((doc) => {
    // Filter by search
    if (
      searchQuery &&
      !doc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !doc.type.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(doc.competence && doc.competence.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false
    }

    // Filter by category
    if (selectedCategory !== "Todos" && doc.category !== selectedCategory) return false

    // Filter by type
    if (selectedType !== "Todos" && doc.type !== selectedType) return false

    // Filter by year
    if (selectedYear !== "Todos") {
      const docYear = doc.issueDate ? doc.issueDate.split("/")[2] : null
      if (docYear !== selectedYear) return false
    }

    return true
  })

  const pinnedDocuments = filteredDocuments.filter((doc) => doc.pinned)

  const activeFilters = []
  if (selectedType !== "Todos") activeFilters.push({ label: `Tipo: ${selectedType}`, key: "type" })
  if (selectedYear !== "Todos") activeFilters.push({ label: `Ano: ${selectedYear}`, key: "year" })
  if (selectedCategory !== "Todos") activeFilters.push({ label: `Categoria: ${selectedCategory}`, key: "category" })

  const handleRemoveFilter = (key: string) => {
    if (key === "type") setSelectedType("Todos")
    if (key === "year") setSelectedYear("Todos")
    if (key === "category") setSelectedCategory("Todos")
  }

  const handleViewDocument = (doc: typeof allDocuments[0]) => {
    if (!doc.available) return
    setSelectedDocument(doc)
    setIsPreviewOpen(true)
  }

  const handleDownload = (doc: typeof allDocuments[0]) => {
    setIsDownloading(doc.id)
    
    // Se for comprovante com arquivo real, abre o PDF
    if (doc.arquivo) {
      const path = getComprovantePath(currentInvestor.documentFolder, doc.arquivo)
      window.open(path, "_blank")
    }
    
    setTimeout(() => {
      setIsDownloading(null)
    }, 1000)
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="text-[#04164E]/60 hover:text-[#04164E] hover:bg-[#04164E]/5 mb-4 px-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-[#04164E] font-bold text-2xl md:text-3xl mb-2">Documentos</h1>
              <p className="text-[#04164E]/60 text-sm md:text-base">
                Acesse contratos, termos e comprovantes de pagamento.
              </p>
            </div>
            <div className="text-sm text-[#04164E]/60">
              <span className="font-semibold text-[#04164E]">{allDocuments.length}</span> documentos disponíveis
            </div>
          </div>
        </div>

        {/* Documentos Importantes */}
        {pinnedDocuments.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[#04164E] font-semibold text-lg mb-4">Documentos importantes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pinnedDocuments.map((doc) => (
                <Card
                  key={doc.id}
                  className="p-4 bg-white border border-[#04164E]/10 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleViewDocument(doc)}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#04164E]/5 flex items-center justify-center flex-shrink-0">
                      <FileCheck className="h-5 w-5 text-[#04164E]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#04164E] font-medium text-sm mb-1">{doc.type}</p>
                      <p className="text-[#04164E]/60 text-xs mb-2">Emissão: {doc.issueDate}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[#04164E] hover:text-[#00E000] p-0 h-auto font-semibold text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewDocument(doc)
                        }}
                      >
                        Ver documento
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Filtros */}
        <Card className="p-4 md:p-6 bg-white border border-[#04164E]/10 mb-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#04164E]/40" />
              <Input
                placeholder="Buscar documento por nome, tipo ou competência..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 border-[#04164E]/20 focus:border-[#04164E] text-[#04164E]"
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1 relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#04164E]/40" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full h-10 pl-10 pr-10 rounded-lg border border-[#04164E]/20 text-[#04164E] text-sm focus:outline-none focus:border-[#04164E] bg-white appearance-none"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      Tipo: {type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#04164E]/40 pointer-events-none" />
              </div>

              <div className="flex-1 relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#04164E]/40" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full h-10 pl-10 pr-10 rounded-lg border border-[#04164E]/20 text-[#04164E] text-sm focus:outline-none focus:border-[#04164E] bg-white appearance-none"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      Ano: {year}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#04164E]/40 pointer-events-none" />
              </div>

              <div className="lg:hidden">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-10 px-4 rounded-lg border border-[#04164E]/20 text-[#04164E] text-sm focus:outline-none focus:border-[#04164E] bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <Badge
                    key={filter.key}
                    variant="secondary"
                    className="bg-[#04164E]/10 text-[#04164E] hover:bg-[#04164E]/20 cursor-pointer"
                    onClick={() => handleRemoveFilter(filter.key)}
                  >
                    {filter.label}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Tabs de Categoria (Desktop) */}
        <div className="hidden lg:block">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#04164E] text-white hover:bg-[#04164E]/90"
                    : "text-[#04164E] border-[#04164E]/20 hover:bg-[#04164E]/5 bg-transparent"
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Lista de Documentos */}
        {filteredDocuments.length === 0 ? (
          <Card className="p-12 bg-white border border-[#04164E]/10 text-center">
            <FolderOpen className="h-12 w-12 text-[#04164E]/20 mx-auto mb-4" />
            <p className="text-[#04164E]/60 text-lg">Nenhum documento encontrado.</p>
            <p className="text-[#04164E]/40 text-sm mt-2">Tente ajustar os filtros ou busca.</p>
          </Card>
        ) : (
          <>
            {/* Tabela Desktop */}
            <div className="hidden md:block">
              <Card className="overflow-hidden bg-white border border-[#04164E]/10">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F6F8FC] border-b border-[#04164E]/10 sticky top-0">
                      <tr>
                        <th className="text-left px-6 py-4 text-[#04164E] font-semibold text-sm">Nome do documento</th>
                        <th className="text-left px-6 py-4 text-[#04164E] font-semibold text-sm">Tipo</th>
                        <th className="text-left px-6 py-4 text-[#04164E] font-semibold text-sm">Competência</th>
                        <th className="text-left px-6 py-4 text-[#04164E] font-semibold text-sm">Data de emissão</th>
                        <th className="text-center px-6 py-4 text-[#04164E] font-semibold text-sm">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments.map((doc) => (
                        <tr
                          key={doc.id}
                          className="border-b border-[#04164E]/5 hover:bg-[#F6F8FC]/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-[#04164E]/5">
                                <FileCheck className="h-4 w-4 text-[#04164E]" />
                              </div>
                              <span className="font-normal text-sm text-[#04164E]">{doc.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary" className="bg-[#04164E]/10 text-[#04164E]">
                              {doc.type}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-[#04164E]/60">{doc.competence || "—"}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-[#04164E]/60">{doc.issueDate}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewDocument(doc)}
                                className="text-[#04164E] hover:bg-[#04164E]/5"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Ver
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDownload(doc)}
                                disabled={isDownloading === doc.id}
                                className="text-[#00E000] hover:bg-[#00E000]/5"
                              >
                                {isDownloading === doc.id ? (
                                  <div className="h-4 w-4 border-2 border-[#00E000]/30 border-t-[#00E000] rounded-full animate-spin mr-1" />
                                ) : (
                                  <Download className="h-4 w-4 mr-1" />
                                )}
                                Baixar PDF
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Cards Mobile */}
            <div className="md:hidden space-y-4">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="p-4 bg-white border border-[#04164E]/10">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#04164E]/5">
                      <FileCheck className="h-5 w-5 text-[#04164E]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[#04164E] mb-1 truncate">{doc.name}</p>
                      <Badge variant="secondary" className="bg-[#04164E]/10 text-[#04164E]">
                        {doc.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    {doc.competence && (
                      <div className="flex justify-between">
                        <span className="text-[#04164E]/60">Competência:</span>
                        <span className="text-[#04164E]">{doc.competence}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[#04164E]/60">Emissão:</span>
                      <span className="text-[#04164E]">{doc.issueDate}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDocument(doc)}
                      className="flex-1 border-[#04164E]/20 text-[#04164E] hover:bg-[#04164E]/5 bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      disabled={isDownloading === doc.id}
                      className="flex-1 bg-[#00E000] text-white hover:bg-[#00E000]/90"
                    >
                      {isDownloading === doc.id ? (
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Baixar PDF
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Modal de Preview */}
        {isPreviewOpen && selectedDocument && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-white p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[#04164E] font-semibold text-lg">Visualizar documento</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPreviewOpen(false)}
                  className="text-[#04164E]/60 hover:text-[#04164E]"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="bg-[#F6F8FC] rounded-lg p-8 mb-6 text-center">
                <FileCheck className="h-16 w-16 text-[#04164E]/20 mx-auto mb-4" />
                <p className="text-[#04164E] font-medium mb-2">{selectedDocument.name}</p>
                <p className="text-[#04164E]/60 text-sm">Preview do documento</p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsPreviewOpen(false)}
                  className="flex-1 border-[#04164E]/20 text-[#04164E] hover:bg-[#04164E]/5 bg-transparent"
                >
                  Fechar
                </Button>
                <Button
                  onClick={() => {
                    const doc = allDocuments.find(d => d.id === selectedDocument.id)
                    if (doc) handleDownload(doc)
                  }}
                  className="flex-1 bg-[#00E000] text-white hover:bg-[#00E000]/90"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar PDF
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[#04164E]/40 text-xs">
            Os documentos exibidos são de uso exclusivo do investidor e estão protegidos conforme LGPD.
          </p>
        </div>
      </div>
    </div>
  )
}
