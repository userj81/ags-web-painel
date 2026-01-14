"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  FolderOpen,
  Headphones,
  Shield,
  Sprout,
  LogOut,
  User,
  Menu,
  X,
  ArrowDownUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { InvestorProvider, useInvestor } from "@/contexts/investor-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { currentInvestor, setInvestorById, allInvestors } = useInvestor()

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, show: true, href: "/dashboard" },
    { name: "Meus Investimentos", icon: TrendingUp, show: true, href: "/dashboard/investimentos" },
    { name: "Extrato", icon: FileText, show: true, href: "/dashboard/extrato" },
    { name: "Saque", icon: ArrowDownUp, show: true, href: "/dashboard/saque" },
    { name: "Documentos", icon: FolderOpen, show: true, href: "/dashboard/documentos" },
    { name: "Garantia", icon: Shield, show: currentInvestor.tier === 2, href: "/dashboard/garantia" },
    { name: "Participação na Safra", icon: Sprout, show: currentInvestor.tier === 2, href: "/dashboard/safra" },
    { name: "Suporte", icon: Headphones, show: true, href: "/dashboard/suporte" },
  ]

  const handleLogout = () => {
    window.location.href = "/"
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeSidebar} />}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#04164E]/10 flex flex-col transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <button
          onClick={closeSidebar}
          className="absolute top-4 right-4 lg:hidden text-[#04164E]/60 hover:text-[#04164E]"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-6 border-b border-[#04164E]/10">
          <Image src="/logo-ags.png" alt="AGS Logo" width={140} height={47} className="h-10 w-auto" />
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems
            .filter((item) => item.show)
            .map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-[#04164E]/5 text-[#04164E] border-l-3 border-[#00E000]"
                      : "text-[#04164E]/60 hover:bg-[#04164E]/5 hover:text-[#04164E]"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-[#00E000]" : ""}`} />
                  <span className="font-normal text-sm">{item.name}</span>
                </Link>
              )
            })}
        </nav>

        <div className="p-4 border-t border-[#04164E]/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#04164E]/60 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-normal text-sm">Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col w-full lg:w-auto">
        <header className="bg-[#F6F8FC] border-b border-[#04164E]/10 px-4 md:px-8 py-4 md:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-[#04164E]/60 hover:text-[#04164E]"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-[#04164E] font-bold text-lg md:text-xl">Olá, {currentInvestor.name}</h1>
                <div className="mt-2">
                  <Badge
                    variant="outline"
                    className="border-[#04164E] text-[#04164E] font-medium bg-white hover:bg-[#04164E]/5"
                  >
                    Perfil: Investidor Faixa {currentInvestor.tier}
                    <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#00E000]" />
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-[#04164E]/60 hover:text-[#04164E] hover:bg-white/50 text-sm font-normal"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-white border border-[#04164E]/10 flex items-center justify-center">
                <User className="h-4 w-4 md:h-5 md:w-5 text-[#04164E]" />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#04164E]/10">
            <div className="flex items-center gap-3">
              <label className="text-[#04164E]/60 text-xs font-medium uppercase tracking-wide whitespace-nowrap">
                Perfil (Demo)
              </label>
              <Select value={currentInvestor.id.toString()} onValueChange={(value) => setInvestorById(Number(value))}>
                <SelectTrigger className="w-full max-w-md bg-white border-[#04164E]/20 text-[#04164E] text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allInvestors.map((investor) => (
                    <SelectItem key={investor.id} value={investor.id.toString()}>
                      {investor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <InvestorProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </InvestorProvider>
  )
}
