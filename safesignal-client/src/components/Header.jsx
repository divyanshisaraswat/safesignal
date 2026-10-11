import {
  Activity,
  ChevronDown,
  House,
  Shield,
  UserRound,
} from "lucide-react";

const navItems = [
  { label: "Journey", href: "#journey", icon: House },
  { label: "Simulator", href: "#simulator", icon: Activity },
  { label: "Privacy", href: "#privacy", icon: Shield },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#10275b] text-white shadow-sm">
      <div className="mx-auto flex h-17 max-w-1280px items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5" aria-label="SafeSignal home">
          <Shield size={30} strokeWidth={2.2} />
          <span className="text-xl font-bold tracking-tight">SafeSignal</span>
        </a>

        <nav aria-label="Main navigation" className="flex h-full items-center gap-1 sm:gap-5">
          {navItems.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className={`flex h-full items-center gap-2 border-b-2 px-2 text-xs font-semibold transition hover:text-blue-200 sm:px-3 sm:text-sm ${label === "Journey"
                  ? "border-blue-400 text-white"
                  : "border-transparent text-blue-100/80"
                }`}
            >
              <Icon size={16} aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Account menu"
          className="flex items-center gap-2 rounded-full p-1 text-blue-100 transition hover:bg-white/10"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-slate-200 text-slate-500">
            <UserRound size={19} aria-hidden="true" />
          </span>
          <ChevronDown size={15} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
