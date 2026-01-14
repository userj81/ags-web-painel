"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, AlertCircle, CheckCircle2, Clock, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useInvestor } from "@/contexts/investor-context"

export default function SaquePage() {
  const router = useRouter()
  const { currentInvestor } = useInvestor()

  const [isLoading, setIsLoading] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedDetail, setSelectedDetail] = useState<any>(null)

  // Form state
  const [withdrawType, setWithdrawType] = useState<"partial" | "total">("partial")
  const [selectedInvestment, setSelectedInvestment] = useState("")
  const [amount, setAmount] = useState((currentInvestor.saqueMensal * 100).toString())
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "transfer">("pix")
  const [pixKeyType, setPixKeyType] = useState("cpf")
  const [pixKey, setPixKey] = useState("")
  const [bank, setBank] = useState("")
  const [agency, setAgency] = useState("")
  const [account, setAccount] = useState("")
  const [accountType, setAccountType] = useState("corrente")
  const [reason, setReason] = useState("")
  const [otherReason, setOtherReason] = useState("")
  const [confirmed, setConfirmed] = useState(false)

  const withdrawalHistory = Array.from({ length: currentInvestor.numeroSaques }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    return {
      protocol: `SAQ-AGS-${date.getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`,
      date: date.toLocaleDateString("pt-BR"),
      value: currentInvestor.saqueMensal,
      method: i % 2 === 0 ? "PIX" : "Transferência",
      status: "Concluído",
      details: i % 2 === 0 ? `CPF: ${currentInvestor.cpf}` : "Banco do Brasil - Ag: 1234-5 - CC: 12345-6",
    }
  })

  const investmentOptions = [
    {
      id: 1,
      name: `APN Invest AFBAGRO-AGS - Contrato ${new Date().getFullYear()}/001`,
      amount: currentInvestor.aporte,
      status: "Ativo",
    },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setAmount(value)
  }

  const getFormattedAmount = () => {
    if (!amount) return ""
    return formatCurrency(Number.parseInt(amount) / 100)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowReviewModal(true)
  }

  const handleConfirmSubmit = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setShowReviewModal(false)
      setShowSuccessModal(true)
    }, 1500)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Concluído":
        return <Badge className="bg-[#00E000]/10 text-[#00E000] border-[#00E000]/20">Concluído</Badge>
      case "Em análise":
        return <Badge className="bg-[#04164E]/10 text-[#04164E] border-[#04164E]/20">Em análise</Badge>
      case "Em processamento":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Em processamento</Badge>
      case "Reprovado":
        return <Badge className="bg-red-50 text-red-600 border-red-200">Reprovado</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="text-[#04164E]/60 -ml-2 md:ml-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>
      </div>

      <div className="space-y-5">
        <div>
          <h1 className="text-[28px] md:text-3xl font-bold text-[#04164E] leading-tight mx-1.5">Saque</h1>
          <p className="text-[#04164E]/60 text-[15px] md:text-base mt-2 ml-1 mr-1">
            Solicite resgate e acompanhe o processamento.
          </p>
        </div>

        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200 mx-0.5 my-0.5">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900 leading-relaxed">
            Para sua segurança, confirme seus dados bancários antes de enviar a solicitação.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#04164E]/10">
          <p className="text-xs md:text-sm text-[#04164E]/60 mb-2 uppercase tracking-wide font-medium">
            Valor investido
          </p>
          <p className="text-2xl md:text-3xl font-bold text-[#04164E]">{formatCurrency(currentInvestor.aporte)}</p>
        </div>
        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#04164E]/10">
          <p className="text-xs md:text-sm text-[#04164E]/60 mb-2 uppercase tracking-wide font-medium">
            Rendimento acumulado disponível
          </p>
          <p className="text-2xl md:text-3xl font-bold text-[#04164E]">
            {formatCurrency(currentInvestor.rendimentoAcumuladoNaoSacado)}
          </p>
          <p className="text-xs text-[#04164E]/60 mt-2">Conforme contrato vigente</p>
        </div>
        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#04164E]/10">
          <p className="text-xs md:text-sm text-[#04164E]/60 mb-2 uppercase tracking-wide font-medium">
            Elegibilidade para resgate
          </p>
          <Badge className="mt-2 bg-[#04164E]/10 text-[#04164E] border-[#04164E]/20">Consultar contrato</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 md:p-8 rounded-xl border border-[#04164E]/10">
            <h2 className="text-xl md:text-2xl font-bold text-[#04164E] mb-6">Solicitar saque</h2>
            <form onSubmit={handleSubmit} className="space-y-7">
              <div>
                <label className="block text-sm font-semibold text-[#04164E] mb-3">Tipo de saque</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="withdrawType"
                      value="partial"
                      checked={withdrawType === "partial"}
                      onChange={(e) => setWithdrawType(e.target.value as "partial")}
                      className="h-4 w-4 text-[#04164E]"
                    />
                    <span className="text-[#04164E]">Saque parcial</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="withdrawType"
                      value="total"
                      checked={withdrawType === "total"}
                      onChange={(e) => setWithdrawType(e.target.value as "total")}
                      className="h-4 w-4 text-[#04164E]"
                    />
                    <span className="text-[#04164E]">Saque total</span>
                  </label>
                </div>
                {withdrawType === "total" && (
                  <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-900">
                      A solicitação de resgate total pode encerrar o contrato, conforme condições contratuais.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#04164E] mb-2">Selecionar investimento</label>
                <select
                  value={selectedInvestment}
                  onChange={(e) => setSelectedInvestment(e.target.value)}
                  className="w-full px-4 py-3 border border-[#04164E]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04164E] focus:border-transparent"
                  required
                >
                  <option value="">Escolha o investimento</option>
                  {investmentOptions.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#04164E] mb-2">Valor do saque</label>
                <input
                  type="text"
                  value={getFormattedAmount()}
                  onChange={handleAmountChange}
                  placeholder="R$ 0,00"
                  disabled={withdrawType === "total"}
                  className="w-full px-4 py-3 border border-[#04164E]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04164E] focus:border-transparent disabled:bg-gray-50"
                  required
                />
                <p className="text-xs text-[#04164E]/60 mt-2">
                  Valor sugerido: {formatCurrency(currentInvestor.saqueMensal)} (sujeito a validação conforme contrato)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#04164E] mb-3">Método de recebimento</label>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="pix"
                      checked={paymentMethod === "pix"}
                      onChange={(e) => setPaymentMethod(e.target.value as "pix")}
                      className="h-4 w-4 text-[#04164E]"
                    />
                    <span className="text-[#04164E]">PIX</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={paymentMethod === "transfer"}
                      onChange={(e) => setPaymentMethod(e.target.value as "transfer")}
                      className="h-4 w-4 text-[#04164E]"
                    />
                    <span className="text-[#04164E]">Transferência bancária</span>
                  </label>
                </div>

                {paymentMethod === "pix" ? (
                  <div className="space-y-4">
                    <select
                      value={pixKeyType}
                      onChange={(e) => setPixKeyType(e.target.value)}
                      className="w-full px-4 py-3 border border-[#04164E]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04164E]"
                    >
                      <option value="cpf">CPF</option>
                      <option value="cnpj">CNPJ</option>
                      <option value="email">E-mail</option>
                      <option value="telefone">Telefone</option>
                      <option value="aleatoria">Chave aleatória</option>
                    </select>
                    <input
                      type="text"
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                      placeholder="Digite sua chave PIX"
                      className="w-full px-4 py-3 border border-[#04164E]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04164E]"
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <select
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                      className="w-full px-4 py-3 border border-[#04164E]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04164E]"
                      required
                    >
                      <option value="">Selecione o banco</option>
                      <option value="001">Banco do Brasil</option>
                      <option value="237">Bradesco</option>
                      <option value="341">Itaú</option>
                      <option value="104">Caixa Econômica</option>
                      <option value="033">Santander</option>
                    </select>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={agency}
                        onChange={(e) => setAgency(e.target.value)}
                        placeholder="Agência"
                        className="px-4 py-3 border border-[#04164E]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04164E]"
                        required
                      />
                      <input
                        type="text"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        placeholder="Conta"
                        className="px-4 py-3 border border-[#04164E]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04164E]"
                        required
                      />
                    </div>
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                      className="w-full px-4 py-3 border border-[#04164E]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04164E]"
                    >
                      <option value="corrente">Conta Corrente</option>
                      <option value="poupanca">Conta Poupança</option>
                    </select>
                    <input
                      type="text"
                      value={currentInvestor.name}
                      disabled
                      className="w-full px-4 py-3 border border-[#04164E]/20 rounded-lg bg-gray-50"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#04164E] mb-2">Motivo (opcional)</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 border border-[#04164E]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04164E]"
                >
                  <option value="">Selecione um motivo</option>
                  <option value="organizacao">Organização financeira</option>
                  <option value="reinvestimento">Reinvestimento</option>
                  <option value="emergencia">Emergência</option>
                  <option value="outros">Outros</option>
                </select>
                {reason === "outros" && (
                  <textarea
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    placeholder="Descreva o motivo (opcional)"
                    rows={3}
                    className="mt-4 w-full px-4 py-3 border border-[#04164E]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04164E]"
                  />
                )}
              </div>

              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="h-4 w-4 mt-1 text-[#04164E]"
                    required
                  />
                  <span className="text-sm text-[#04164E]">
                    Confirmo que os dados bancários estão corretos e que estou ciente das condições contratuais.
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={!confirmed}
                className="w-full bg-[#04164E] hover:bg-[#04164E]/90 text-white py-6 text-base font-semibold disabled:opacity-50"
              >
                Enviar solicitação
              </Button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-5 md:p-6 rounded-xl border border-[#04164E]/10">
            <h3 className="text-lg font-bold text-[#04164E] mb-5">Acompanhamento</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-[#00E000]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-[#00E000]" />
                </div>
                <div>
                  <p className="font-semibold text-[#04164E] text-[15px]">Enviado</p>
                  <p className="text-xs text-[#04164E]/60 mt-1">02/02/2026 14:32</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-[#04164E]/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-[#04164E]" />
                </div>
                <div>
                  <p className="font-semibold text-[#04164E] text-[15px]">Em análise</p>
                  <p className="text-xs text-[#04164E]/60 mt-1">Processando</p>
                </div>
              </div>
              <div className="flex items-start gap-3 opacity-40">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold text-[#04164E] text-[15px]">Aprovado</p>
                  <p className="text-xs text-[#04164E]/60 mt-1">Aguardando</p>
                </div>
              </div>
              <div className="flex items-start gap-3 opacity-40">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold text-[#04164E] text-[15px]">Em processamento</p>
                  <p className="text-xs text-[#04164E]/60 mt-1">Aguardando</p>
                </div>
              </div>
              <div className="flex items-start gap-3 opacity-40">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold text-[#04164E] text-[15px]">Concluído</p>
                  <p className="text-xs text-[#04164E]/60 mt-1">Aguardando</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-xs text-blue-900 leading-relaxed">
                <strong>Prazo estimado:</strong> até 5 dias úteis (pode variar conforme análise e calendário de
                processamento).
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 md:p-8 rounded-xl border border-[#04164E]/10">
        <h2 className="text-xl md:text-2xl font-bold text-[#04164E] mb-6">Histórico de saques</h2>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#04164E]/10">
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#04164E]">Protocolo</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#04164E]">Data</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#04164E]">Valor</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#04164E]">Método</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#04164E]">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-[#04164E]">Comprovante</th>
              </tr>
            </thead>
            <tbody>
              {withdrawalHistory.map((item) => (
                <tr key={item.protocol} className="border-b border-[#04164E]/5 hover:bg-[#04164E]/[0.02]">
                  <td className="py-4 px-4 text-sm text-[#04164E] font-mono">{item.protocol}</td>
                  <td className="py-4 px-4 text-sm text-[#04164E]">{item.date}</td>
                  <td className="py-4 px-4 text-sm font-semibold text-[#04164E]">{formatCurrency(item.value)}</td>
                  <td className="py-4 px-4 text-sm text-[#04164E]">{item.method}</td>
                  <td className="py-4 px-4">{getStatusBadge(item.status)}</td>
                  <td className="py-4 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedDetail(item)
                        setShowDetailsModal(true)
                      }}
                      className="text-[#04164E] hover:text-[#04164E]/80"
                    >
                      Baixar PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-4">
          {withdrawalHistory.map((item) => (
            <div key={item.protocol} className="p-4 border border-[#04164E]/10 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#04164E]/60">{item.protocol}</span>
                {getStatusBadge(item.status)}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-[#04164E]/60">Data</span>
                  <span className="text-sm font-medium text-[#04164E]">{item.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#04164E]/60">Valor</span>
                  <span className="text-sm font-bold text-[#04164E]">{formatCurrency(item.value)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#04164E]/60">Método</span>
                  <span className="text-sm text-[#04164E]">{item.method}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedDetail(item)
                  setShowDetailsModal(true)
                }}
                className="w-full text-[#04164E] border-[#04164E]/20"
              >
                Baixar PDF
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#04164E]">Revisar solicitação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between py-2 border-b border-[#04164E]/10">
              <span className="text-[#04164E]/60">Tipo</span>
              <span className="font-semibold text-[#04164E]">
                {withdrawType === "partial" ? "Saque parcial" : "Saque total"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#04164E]/10">
              <span className="text-[#04164E]/60">Valor</span>
              <span className="font-semibold text-[#04164E]">{getFormattedAmount()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#04164E]/10">
              <span className="text-[#04164E]/60">Método</span>
              <span className="font-semibold text-[#04164E]">{paymentMethod === "pix" ? "PIX" : "Transferência"}</span>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                A solicitação será analisada conforme condições do contrato. O prazo estimado é de até 5 dias úteis.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowReviewModal(false)} className="flex-1">
              Voltar
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              disabled={isLoading}
              className="flex-1 bg-[#04164E] hover:bg-[#04164E]/90"
            >
              {isLoading ? "Enviando..." : "Confirmar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#04164E] flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-[#00E000]" />
              Solicitação enviada
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-[#04164E]">
              Sua solicitação foi recebida e será analisada em breve. Você receberá atualizações por e-mail.
            </p>
            <div className="p-4 bg-[#04164E]/5 rounded-lg">
              <p className="text-sm text-[#04164E]/80">
                <strong>Protocolo:</strong> SAQ-AGS-{new Date().getFullYear()}-
                {String(Math.floor(Math.random() * 9999)).padStart(4, "0")}
              </p>
            </div>
          </div>
          <Button onClick={() => setShowSuccessModal(false)} className="w-full bg-[#04164E] hover:bg-[#04164E]/90">
            Fechar
          </Button>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#04164E]">Comprovante de saque</DialogTitle>
          </DialogHeader>
          {selectedDetail && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-[#04164E]/5 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-[#04164E]/60">Protocolo</span>
                  <span className="text-sm font-mono text-[#04164E]">{selectedDetail.protocol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#04164E]/60">Data</span>
                  <span className="text-sm text-[#04164E]">{selectedDetail.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#04164E]/60">Valor</span>
                  <span className="text-sm font-bold text-[#04164E]">{formatCurrency(selectedDetail.value)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#04164E]/60">Método</span>
                  <span className="text-sm text-[#04164E]">{selectedDetail.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#04164E]/60">Detalhes</span>
                  <span className="text-sm text-[#04164E]">{selectedDetail.details}</span>
                </div>
              </div>
              <Button className="w-full bg-[#04164E] hover:bg-[#04164E]/90">
                <Eye className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
