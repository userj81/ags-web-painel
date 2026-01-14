"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, User, ShieldCheck } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [cpf, setCpf] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1")
    }
    return cpf
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setCpf(formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-[#F6F8FC] relative overflow-hidden">
      {/* Blobs animados desfocados */}
      <div className="absolute inset-0 motion-reduce:hidden">
        {/* Blob azul 1 */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.14] blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(70, 120, 220, 0.9) 0%, rgba(4, 22, 78, 0.6) 40%, transparent 70%)",
            top: "-12%",
            left: "-8%",
            animation: "float-horizontal-1 18s ease-in-out infinite",
          }}
        />

        {/* Blob verde */}
        <div
          className="absolute w-[550px] h-[550px] rounded-full opacity-[0.12] blur-[110px]"
          style={{
            background:
              "radial-gradient(circle, rgba(100, 230, 100, 0.85) 0%, rgba(0, 224, 0, 0.5) 40%, transparent 70%)",
            top: "15%",
            right: "-10%",
            animation: "float-diagonal-1 20s ease-in-out infinite",
          }}
        />

        {/* Blob azul 2 */}
        <div
          className="absolute w-[700px] h-[700px] rounded-full opacity-[0.16] blur-[140px]"
          style={{
            background:
              "radial-gradient(circle, rgba(70, 120, 220, 0.95) 0%, rgba(4, 22, 78, 0.7) 40%, transparent 70%)",
            bottom: "-18%",
            left: "25%",
            animation: "float-horizontal-2 16s ease-in-out infinite",
          }}
        />

        {/* Blob azul/verde mix */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.10] blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(70, 180, 160, 0.8) 0%, rgba(4, 22, 78, 0.4) 40%, transparent 70%)",
            top: "40%",
            left: "60%",
            animation: "float-diagonal-2 22s ease-in-out infinite",
          }}
        />
      </div>

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.08] blur-[80px] pointer-events-none motion-reduce:opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, rgba(70, 120, 220, 0.6) 0%, transparent 60%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.07] motion-reduce:opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(4, 22, 78, 0.4) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.06] motion-reduce:opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 75%, rgba(0, 224, 0, 0.3) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="w-full max-w-[480px] relative z-10">
        <div
          className="rounded-[16px] sm:rounded-[20px] shadow-[0_8px_32px_rgba(4,22,78,0.12),0_2px_8px_rgba(4,22,78,0.08)] overflow-hidden border border-[rgba(255,255,255,0.6)]"
          style={{
            background: "rgba(255, 255, 255, 0.86)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow:
              "0 8px 32px rgba(4, 22, 78, 0.12), 0 2px 8px rgba(4, 22, 78, 0.08), inset 0 0 0 1px rgba(233, 237, 245, 0.5)",
          }}
        >
          <div className="relative bg-[#04164E] h-[68px] sm:h-[72px] flex items-center justify-center">
            <Image
              src="/logo-ags-invest.png"
              alt="AGS Invest Logo"
              width={180}
              height={50}
              className="h-10 sm:h-12 w-auto"
            />
            <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#00E000]" />
          </div>

          <div className="px-5 sm:px-10 pt-6 sm:pt-8 pb-8 sm:pb-10">
            <div className="text-center mb-6">
              <h1 className="text-[#04164E] font-bold text-[28px] sm:text-[30px] leading-[1.15] mb-2.5">
                Acesso ao Painel do Investidor
              </h1>
              <p className="text-[#04164E] opacity-65 font-normal text-[14px] sm:text-[15px] leading-relaxed max-w-[320px] mx-auto">
                Entre com seus dados para acessar suas informações de investimento
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-[#04164E] font-semibold text-[13px] sm:text-[14px]">
                  CPF
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={handleCPFChange}
                    maxLength={14}
                    className="pl-11 h-[52px] bg-white border-[#D7DDEA] focus:border-[#04164E] focus:ring-2 focus:ring-[#04164E]/15 text-[#04164E] text-[15px] placeholder:text-gray-400/70 rounded-[13px] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#04164E] font-semibold text-[13px] sm:text-[14px]">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 h-[52px] bg-white border-[#D7DDEA] focus:border-[#04164E] focus:ring-2 focus:ring-[#04164E]/15 text-[#04164E] text-[15px] placeholder:text-gray-400/70 rounded-[13px] transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#04164E] transition-colors p-1 touch-manipulation"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-[52px] bg-[#04164E] hover:bg-[#03123F] text-white font-semibold text-[15px] sm:text-base rounded-[13px] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(4,22,78,0.2)] disabled:opacity-70 touch-manipulation"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Entrando...</span>
                  </div>
                ) : (
                  "Entrar"
                )}
              </Button>

              <div className="text-center pt-0.5">
                <a
                  href="#"
                  className="text-[#04164E] font-medium text-[13px] sm:text-sm hover:text-[#00E000] hover:underline transition-all inline-block py-1"
                >
                  Esqueci minha senha
                </a>
              </div>
            </form>

            <div className="mt-6 pb-safe">
              <div className="flex items-center justify-center gap-2 bg-[#EEF2FA] rounded-[15px] px-4 py-3">
                <ShieldCheck className="h-[15px] w-[15px] text-[#04164E]/70 flex-shrink-0" />
                <span className="text-[#04164E]/70 text-[12px] sm:text-[13px] font-normal text-center">
                  Ambiente seguro para investidores
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-horizontal-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(120px, -40px) scale(1.08); }
        }
        
        @keyframes float-horizontal-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-100px, 35px) scale(1.06); }
        }
        
        @keyframes float-diagonal-1 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(-90px, 80px) scale(1.05) rotate(5deg); }
        }
        
        @keyframes float-diagonal-2 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(85px, -70px) scale(1.04) rotate(-5deg); }
        }
      `}</style>
    </div>
  )
}
