import Link from "next/link"
import { MobileNav } from "@/components/layout/mobile-nav"

const navItems = [
  { label: "교회소개", href: "/about" },
  { label: "예배안내", href: "/worship" },
  { label: "설교", href: "/sermons" },
  { label: "새가족안내", href: "/newcomer" },
  { label: "오시는길", href: "/location" },
  { label: "교회소식", href: "/notices" },
]

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-church-gold-light bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-church-brown transition-colors hover:text-church-gold"
        >
          구미겨자씨교회
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-church-brown-light transition-colors hover:bg-church-cream hover:text-church-brown"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="md:hidden">
          <MobileNav navItems={navItems} />
        </div>
      </div>
    </header>
  )
}
