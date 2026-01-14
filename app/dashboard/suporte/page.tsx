"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  MessageCircle,
  Send,
  Paperclip,
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Clock,
  CheckCircle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const investorData = {
  tier: 2,
}

const faqItems = [
  {
    id: 1,
    question: "Como acesso meus comprovantes em PDF?",
    answer: "Acesse Extrato > selecione o pagamento com status 'Pago' > clique em 'Baixar PDF'.",
    keywords: "pdf comprovante extrato baixar download",
  },
  {
    id: 2,
    question: "O que significa 'Em processamento'?",
    answer: "Pagamento em etapa de confirmação e registro. Caso permaneça por mais de 5 dias úteis, contate o suporte.",
    keywords: "processamento status pagamento",
  },
  {
    id: 3,
    question: "Como redefinir minha senha?",
    answer: "Na tela de login, clique em 'Esqueci minha senha' e siga as instruções.",
    keywords: "senha redefinir esqueci login acesso",
  },
  {
    id: 4,
    question: "Onde encontro meu contrato?",
    answer: "Acesse Documentos > categoria 'Contratos'.",
    keywords: "contrato documentos encontrar",
  },
  {
    id: 5,
    question: "Por que o valor do próximo pagamento aparece como estimado?",
    answer: "O painel exibe uma estimativa com base nas condições contratuais e calendário de processamento.",
    keywords: "pagamento estimado valor proximo",
  },
  {
    id: 6,
    question: "Onde vejo Termo de Uso e Safra?",
    answer:
      investorData.tier === 2
        ? "Acesse Documentos ou as abas específicas no menu (Garantia e Participação na Safra)."
        : "Essas seções estão disponíveis para a Faixa 2 conforme modalidade contratada.",
    keywords: "termo uso safra garantia faixa 2",
  },
]

export default function SuportePage() {
  const router = useRouter()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketMessage, setTicketMessage] = useState("")
  const [ticketSubmitted, setTicketSubmitted] = useState(false)
  const [protocolNumber, setProtocolNumber] = useState("")

  const handleSubmitTicket = () => {
    if (!ticketSubject || !ticketMessage) return
    const protocol = `AGS-2026-${Math.floor(1000 + Math.random() * 9000)}`
    setProtocolNumber(protocol)
    setTicketSubmitted(true)
    setTimeout(() => {
      setTicketSubmitted(false)
      setTicketSubject("")
      setTicketMessage("")
    }, 5000)
  }

  const filteredFaq = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const currentHour = new Date().getHours()
  const isOnline = currentHour >= 9 && currentHour < 18

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
          className="mb-6 text-[#04164E] border-[#04164E]/20 hover:bg-[#04164E]/5"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <div className="bg-[#E9EDF5]/30 border border-[#04164E]/10 rounded-lg p-4 mb-6">
          <p className="text-[#04164E]/70 text-sm text-center">
            <strong>Para sua segurança:</strong> Não solicite nem compartilhe senhas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="p-6 bg-white border border-[#04164E]/10">
              <h2 className="text-[#04164E] font-semibold text-lg mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-[#00E000]" />
                Contato rápido
              </h2>

              <div className="space-y-3">
                <Button
                  className="w-full h-12 bg-[#04164E] text-white hover:bg-[#04164E]/90 border-l-4 border-[#00E000]"
                  onClick={() => window.open("https://wa.me/5511999999999", "_blank")}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Atendimento via WhatsApp
                </Button>
                <p className="text-[#04164E]/60 text-xs text-center">Horário: Seg–Sex, 09:00–18:00 (BRT)</p>

                <Button
                  variant="outline"
                  className="w-full h-12 text-[#04164E] border-[#04164E]/30 hover:bg-[#04164E]/5 bg-transparent"
                  onClick={() => setIsChatOpen(true)}
                >
                  <Send className="h-5 w-5 mr-2" />
                  Iniciar chat interno
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-[#04164E]/10">
              <h2 className="text-[#04164E] font-semibold text-lg mb-4 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#00E000]" />
                Abrir chamado
              </h2>

              {ticketSubmitted && (
                <div className="mb-4 p-4 bg-[#00E000]/10 border border-[#00E000]/30 rounded-lg">
                  <p className="text-[#04164E] font-semibold text-sm mb-1">Chamado enviado com sucesso!</p>
                  <p className="text-[#04164E]/70 text-sm">
                    Protocolo: <strong>{protocolNumber}</strong>
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-[#04164E] text-sm font-normal mb-2 block">Assunto</label>
                  <select
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full h-10 px-3 border border-[#9AA3B2]/30 rounded-lg text-[#04164E] text-sm focus:outline-none focus:border-[#04164E] bg-white"
                  >
                    <option value="">Selecione o assunto</option>
                    <option value="pagamentos">Pagamentos</option>
                    <option value="extrato">Extrato e comprovantes</option>
                    <option value="documentos">Documentos</option>
                    <option value="acesso">Acesso e senha</option>
                    <option value="investimentos">Investimentos</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#04164E] text-sm font-normal mb-2 block">Mensagem</label>
                  <Textarea
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Descreva sua solicitação..."
                    className="min-h-[120px] border-[#9AA3B2]/30 focus:border-[#04164E] text-[#04164E]"
                  />
                </div>

                <div>
                  <Button
                    variant="outline"
                    className="w-full text-[#04164E] border-[#04164E]/30 hover:bg-[#04164E]/5 bg-transparent"
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    Enviar arquivo (opcional)
                  </Button>
                </div>

                <Button
                  onClick={handleSubmitTicket}
                  disabled={!ticketSubject || !ticketMessage}
                  className="w-full h-12 bg-[#04164E] text-white hover:bg-[#04164E]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Enviar
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-[#04164E]/10">
              <h2 className="text-[#04164E] font-semibold text-lg mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#00E000]" />
                Status do atendimento
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#04164E]/60 text-sm">Status atual:</span>
                  <Badge
                    className={`${isOnline ? "bg-[#00E000]/10 text-[#00E000]" : "bg-[#9AA3B2]/10 text-[#9AA3B2]"}`}
                  >
                    {isOnline ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Online
                      </>
                    ) : (
                      "Fora do horário"
                    )}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#04164E]/60 text-sm">Tempo médio de resposta:</span>
                  <span className="text-[#04164E] font-semibold text-sm">2–6 horas</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#04164E]/60 text-sm">Última atualização:</span>
                  <span className="text-[#04164E] font-semibold text-sm">11/01/2026</span>
                </div>
              </div>

              <p className="text-[#04164E]/40 text-xs mt-4 italic">
                Prazos podem variar conforme volume de solicitações.
              </p>
            </Card>
          </div>

          <div>
            <Card className="p-6 bg-white border border-[#04164E]/10">
              <h2 className="text-[#04164E] font-semibold text-lg mb-4 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#00E000]" />
                Dúvidas frequentes
              </h2>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#04164E]/40" />
                <Input
                  type="text"
                  placeholder="Buscar por pagamento, extrato, contrato, senha..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#9AA3B2]/30 focus:border-[#04164E] text-[#04164E]"
                />
              </div>

              {filteredFaq.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[#04164E]/60 text-sm">Nenhuma dúvida encontrada.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFaq.map((item) => (
                    <div key={item.id} className="border border-[#04164E]/10 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === item.id ? null : item.id)}
                        className="w-full flex items-start justify-between p-4 hover:bg-[#04164E]/5 transition-colors text-left"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <HelpCircle className="h-5 w-5 text-[#04164E]/40 flex-shrink-0 mt-0.5" />
                          <span className="text-[#04164E] font-normal text-sm">{item.question}</span>
                        </div>
                        {expandedFaq === item.id ? (
                          <ChevronUp className="h-5 w-5 text-[#04164E]/40 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-[#04164E]/40 flex-shrink-0" />
                        )}
                      </button>
                      {expandedFaq === item.id && (
                        <div className="px-4 pb-4 pt-0">
                          <div className="pl-8 text-[#04164E]/70 text-sm leading-relaxed">{item.answer}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#04164E]">Chat interno</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="h-[300px] border border-[#04164E]/10 rounded-lg p-4 bg-[#F6F8FC] flex items-center justify-center">
              <p className="text-[#04164E]/60 text-sm text-center">
                Chat em desenvolvimento.
                <br />
                Por favor, use o WhatsApp para atendimento imediato.
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                className="flex-1 border-[#9AA3B2]/30 focus:border-[#04164E]"
                disabled
              />
              <Button className="bg-[#04164E] hover:bg-[#04164E]/90" disabled>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
