import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-church-gold">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-church-brown">
        페이지를 찾을 수 없습니다
      </h2>
      <p className="mt-2 text-church-brown-light">
        요청하신 페이지가 존재하지 않습니다
      </p>
      <Button asChild className="mt-8">
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  )
}
