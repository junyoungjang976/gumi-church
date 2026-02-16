"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function InquiryForm() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/newcomer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, message }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "오류가 발생했습니다")
        return
      }

      setSuccess(true)
      setName("")
      setPhone("")
      setEmail("")
      setMessage("")
    } catch {
      setError("서버에 연결할 수 없습니다")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Card className="border-church-gold-light bg-white">
        <CardContent className="py-12 text-center">
          <p className="text-lg font-semibold text-church-brown">
            문의가 접수되었습니다
          </p>
          <p className="mt-2 text-church-brown-light">
            곧 연락드리겠습니다.
          </p>
          <Button
            onClick={() => setSuccess(false)}
            className="mt-6 bg-church-gold text-white hover:bg-church-gold/90"
          >
            추가 문의하기
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-church-gold-light bg-white">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-church-brown">
              이름 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              required
              className="border-church-gold-light focus-visible:border-church-gold focus-visible:ring-church-gold/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-church-brown">
              연락처
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="연락처를 입력해주세요"
              className="border-church-gold-light focus-visible:border-church-gold focus-visible:ring-church-gold/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-church-brown">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력해주세요"
              className="border-church-gold-light focus-visible:border-church-gold focus-visible:ring-church-gold/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-church-brown">
              문의사항
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="문의사항을 입력해주세요"
              rows={5}
              className="border-church-gold-light focus-visible:border-church-gold focus-visible:ring-church-gold/30"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-church-gold text-white hover:bg-church-gold/90"
          >
            {isSubmitting ? "접수 중..." : "문의하기"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
