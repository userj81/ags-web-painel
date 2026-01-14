"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { INVESTORS, calculateInvestorData, type InvestorCalculated } from "@/lib/investors-data"

interface InvestorContextType {
  currentInvestor: InvestorCalculated
  setInvestorById: (id: number) => void
  allInvestors: InvestorCalculated[]
}

const InvestorContext = createContext<InvestorContextType | undefined>(undefined)

export function InvestorProvider({ children }: { children: ReactNode }) {
  const [currentInvestorId, setCurrentInvestorId] = useState(1)

  const allInvestors = INVESTORS.map(calculateInvestorData)
  const currentInvestor = allInvestors.find((inv) => inv.id === currentInvestorId) || allInvestors[0]

  const setInvestorById = (id: number) => {
    setCurrentInvestorId(id)
  }

  return (
    <InvestorContext.Provider value={{ currentInvestor, setInvestorById, allInvestors }}>
      {children}
    </InvestorContext.Provider>
  )
}

export function useInvestor() {
  const context = useContext(InvestorContext)
  if (context === undefined) {
    throw new Error("useInvestor must be used within an InvestorProvider")
  }
  return context
}
