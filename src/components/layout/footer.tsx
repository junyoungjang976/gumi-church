import Link from "next/link"
import { supabase } from "@/lib/supabase"

export async function Footer() {
  // Fetch church settings
  const { data: settings } = await supabase
    .from("church_settings")
    .select("key, value")

  const settingsMap: Record<string, string> = {}
  for (const s of settings || []) {
    settingsMap[s.key] = s.value
  }

  const phone = settingsMap.phone || "준비중"
  const email = settingsMap.email || "준비중"
  const address = settingsMap.address || "경북 구미시 봉곡북로15길 3"

  return (
    <footer className="bg-church-brown text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold">구미겨자씨교회</h3>
            <p className="mt-2 text-sm text-white/70">
              믿음으로 함께 성장하는 교회
            </p>
          </div>

          <div>
            <h4 className="font-semibold">연락처</h4>
            <ul className="mt-2 space-y-1 text-sm text-white/70">
              <li>주소: {address}</li>
              <li>전화: {phone}</li>
              <li>이메일: {email}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">바로가기</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <Link
                  href="/worship"
                  className="text-white/70 transition-colors hover:text-white"
                >
                  예배안내
                </Link>
              </li>
              <li>
                <Link
                  href="/sermons"
                  className="text-white/70 transition-colors hover:text-white"
                >
                  설교
                </Link>
              </li>
              <li>
                <Link
                  href="/notices"
                  className="text-white/70 transition-colors hover:text-white"
                >
                  교회소식
                </Link>
              </li>
              <li>
                <Link
                  href="/location"
                  className="text-white/70 transition-colors hover:text-white"
                >
                  오시는길
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm text-white/50">
          &copy; {new Date().getFullYear()} 구미겨자씨교회. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
