"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useCallback } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SermonSearchProps {
  defaultValue?: string
}

export function SermonSearch({ defaultValue = "" }: SermonSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(defaultValue)

  const handleSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (term) {
        params.set("search", term)
      } else {
        params.delete("search")
      }
      params.delete("page")
      router.push(`/sermons?${params.toString()}`)
    },
    [router, searchParams]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(value)
    }
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-church-brown-light" />
      <Input
        type="text"
        placeholder="설교 제목, 성경구절, 설교자 검색..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border-church-gold-light pl-10 focus-visible:border-church-gold focus-visible:ring-church-gold/30"
      />
    </div>
  )
}
