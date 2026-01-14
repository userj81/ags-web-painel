"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Download, FileCheck, Calendar, Map, ArrowLeft, FileText } from "lucide-react"
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

// Mock data
const investorData = {
  name: "Carlos Almeida",
  tier: 2,
  hasHectare: true,
  hasTermOfUse: true,
}

const garantiaData = {
  codigoTermo: "TU-AGS-2026-00012",
  titular: "Carlos Almeida",
  inicioVigencia: "01/02/2026",
  fimVigencia: "01/02/2033",
  areaVinculada: "1 hectare",
  statusDocumento: "Ativo",
  atualizadoEm: "15/01/2026",
  tamanhoArquivo: "1,2 MB",
  localizacao: {
    municipio: "Itacoatiara",
    uf: "AM",
    coordenadas: "-3.138, -58.444",
    referencia: "Área 07 — Gleba Norte",
  },
}

export default function GarantiaPage() {
  const router = useRouter()
  const [isDownloading, setIsDownloading] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)

  useEffect(() => {
    if (investorData.tier !== 2) {
      router.push("/dashboard")
    }
  }, [router])

  if (investorData.tier !== 2) {
    return null
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
      {/* Header da tela */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="text-[#04164E]/60 hover:text-[#04164E] hover:bg-[#04164E]/5 mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-[#04164E] font-bold text-2xl md:text-3xl mb-2">Garantia / Lastro Vinculado</h1>
            <p className="text-[#04164E]/60 text-sm md:text-base">
              Informações do Termo de Uso e área vinculada ao seu contrato.
            </p>
          </div>
          <Badge className="bg-[#04164E]/10 text-[#04164E] hover:bg-[#04164E]/15 border-l-2 border-[#00E000] px-4 py-2 w-fit">
            Disponível para Faixa 2
          </Badge>
        </div>
      </div>

      {/* Seção 1 - Resumo (3 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-6 bg-white border border-[#04164E]/10 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-12 w-12 rounded-full bg-[#04164E]/10 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-[#04164E]" />
            </div>
            <div>
              <p className="text-[#04164E]/60 text-xs font-normal">Hectare vinculado</p>
              <p className="text-[#04164E] font-bold text-2xl">1 ha</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-[#04164E]/10 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-12 w-12 rounded-full bg-[#04164E]/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-[#04164E]" />
            </div>
            <div>
              <p className="text-[#04164E]/60 text-xs font-normal">Vigência do Termo</p>
              <p className="text-[#04164E] font-bold text-2xl">7 anos</p>
              <p className="text-[#04164E]/40 text-xs mt-1">Conforme Termo de Uso</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-[#04164E]/10 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-12 w-12 rounded-full bg-[#00E000]/10 flex items-center justify-center">
              <FileCheck className="h-6 w-6 text-[#00E000]" />
            </div>
            <div>
              <p className="text-[#04164E]/60 text-xs font-normal">Status do documento</p>
              <Badge className="bg-[#00E000]/10 text-[#00E000] hover:bg-[#00E000]/20 mt-1">
                {garantiaData.statusDocumento}
              </Badge>
              <p className="text-[#04164E]/40 text-xs mt-2">Atualizado em: {garantiaData.atualizadoEm}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna esquerda - Desktop */}
        <div className="space-y-6">
          {/* Seção 2 - Informações do Termo de Uso */}
          <Card className="p-6 bg-white border border-[#04164E]/10">
            <h2 className="text-[#04164E] font-semibold text-lg mb-4">Termo de Uso</h2>

            <div className="space-y-4">
              <div>
                <p className="text-[#04164E] text-xs font-semibold mb-1">Código do Termo</p>
                <p className="text-[#04164E] font-normal">{garantiaData.codigoTermo}</p>
              </div>

              <div>
                <p className="text-[#04164E] text-xs font-semibold mb-1">Titular</p>
                <p className="text-[#04164E] font-normal">{garantiaData.titular}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#04164E] text-xs font-semibold mb-1">Início da vigência</p>
                  <p className="text-[#04164E] font-normal">{garantiaData.inicioVigencia}</p>
                </div>
                <div>
                  <p className="text-[#04164E] text-xs font-semibold mb-1">Fim da vigência</p>
                  <p className="text-[#04164E] font-normal">{garantiaData.fimVigencia}</p>
                </div>
              </div>

              <div>
                <p className="text-[#04164E] text-xs font-semibold mb-1">Área vinculada</p>
                <p className="text-[#04164E] font-normal">{garantiaData.areaVinculada}</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#F6F8FC] rounded-lg border border-[#04164E]/10">
              <p className="text-[#04164E]/60 text-xs leading-relaxed">
                O Termo de Uso formaliza a vinculação contratual de uma área produtiva para fins de lastro, conforme
                condições do seu contrato.
              </p>
            </div>
          </Card>

          {/* Seção 3 - Download do Documento */}
          <Card className="p-6 bg-white border border-[#04164E]/10">
            <h2 className="text-[#04164E] font-semibold text-lg mb-4">Documentos</h2>

            <div className="flex items-center justify-between mb-4 p-3 bg-[#F6F8FC] rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-[#04164E]" />
                <div>
                  <p className="text-[#04164E] text-sm font-semibold">Termo de Uso</p>
                  <p className="text-[#04164E]/60 text-xs">
                    PDF • {garantiaData.tamanhoArquivo} • atualizado em {garantiaData.atualizadoEm}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setIsDownloading(true)}
                disabled={isDownloading}
                className="flex-1 bg-[#04164E] text-white hover:bg-[#04164E]/90"
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? "Baixando..." : "Baixar Termo de Uso (PDF)"}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 text-[#04164E] border-[#04164E]/20 bg-transparent">
                    Ver documento
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle className="text-[#04164E]">Termo de Uso - {garantiaData.codigoTermo}</DialogTitle>
                    <DialogDescription>Preview do documento PDF</DialogDescription>
                  </DialogHeader>
                  <div className="w-full h-[60vh] bg-[#F6F8FC] rounded-lg flex items-center justify-center border border-[#04164E]/10">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-[#04164E]/40 mx-auto mb-4" />
                      <p className="text-[#04164E]/60 text-sm">Preview do documento</p>
                      <p className="text-[#04164E]/40 text-xs mt-2">Termo de Uso - {garantiaData.codigoTermo}</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        </div>

        {/* Coluna direita - Desktop / Empilhado - Mobile */}
        <div className="space-y-6">
          {/* Seção 4 - Mapa / Localização */}
          <Card className="p-6 bg-white border border-[#04164E]/10">
            <h2 className="text-[#04164E] font-semibold text-lg mb-4">Localização da área vinculada</h2>

            {/* Placeholder do mapa */}
            <div className="w-full h-64 bg-[#F6F8FC] rounded-lg mb-4 flex items-center justify-center border border-[#04164E]/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#04164E]/5 to-[#00E000]/5" />
              <div className="relative text-center">
                <MapPin className="h-12 w-12 text-[#04164E] mx-auto mb-2" />
                <p className="text-[#04164E]/60 text-sm">Mapa da área vinculada</p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowMapModal(true)}
              className="w-full mb-4 lg:hidden text-[#04164E] border-[#04164E]/20"
            >
              <Map className="h-4 w-4 mr-2" />
              Abrir mapa
            </Button>

            <div className="space-y-3">
              <div>
                <p className="text-[#04164E] text-xs font-semibold mb-1">Município/UF</p>
                <p className="text-[#04164E] font-normal">
                  {garantiaData.localizacao.municipio}/{garantiaData.localizacao.uf}
                </p>
              </div>

              <div>
                <p className="text-[#04164E] text-xs font-semibold mb-1">Coordenadas</p>
                <p className="text-[#04164E] font-normal">{garantiaData.localizacao.coordenadas}</p>
              </div>

              <div>
                <p className="text-[#04164E] text-xs font-semibold mb-1">Referência</p>
                <p className="text-[#04164E] font-normal">{garantiaData.localizacao.referencia}</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-[#F6F8FC] rounded-lg border border-[#04164E]/10">
              <p className="text-[#04164E]/60 text-xs leading-relaxed">
                Informações de localização para fins de transparência e referência contratual.
              </p>
            </div>
          </Card>

          {/* Seção 5 - Notas importantes */}
          <Card className="p-6 bg-[#EEF2FA] border border-[#04164E]/20">
            <h3 className="text-[#04164E] font-semibold text-sm mb-3">Notas importantes</h3>
            <p className="text-[#04164E]/70 text-sm leading-relaxed">
              As informações exibidas nesta seção têm caráter informativo e refletem registros contratuais. Consulte os
              documentos para detalhes completos.
            </p>
          </Card>
        </div>
      </div>

      {/* Modal do mapa para mobile */}
      <Dialog open={showMapModal} onOpenChange={setShowMapModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#04164E]">Localização da área</DialogTitle>
            <DialogDescription>
              {garantiaData.localizacao.municipio}/{garantiaData.localizacao.uf}
            </DialogDescription>
          </DialogHeader>
          <div className="w-full h-64 bg-[#F6F8FC] rounded-lg flex items-center justify-center border border-[#04164E]/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#04164E]/5 to-[#00E000]/5" />
            <div className="relative text-center">
              <MapPin className="h-12 w-12 text-[#04164E] mx-auto mb-2" />
              <p className="text-[#04164E]/60 text-sm">Mapa da área vinculada</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
