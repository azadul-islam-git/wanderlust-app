import Image from "next/image";
import Link from "next/link";
import { UserRound } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "all-destination" },
  { label: "Add Destination", href: "add-destination" },
  { label: "My Bookings", href: "#" },
];

const authLinks = [
  { label: "Profile", href: "profile", icon: true },
  { label: "Login", href: "login", icon: false },
  { label: "Sign Up", href: "signup", icon: false },
];

export default function Navbar() {
  return (
    <header className="relative z-50 flex h-16 items-center justify-between gap-4 border-b bg-white px-4 md:px-8">
      <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`text-sm font-medium transition-colors ${
              link.label === "Home"
                ? "text-cyan-600"
                : "text-neutral-700 hover:text-cyan-600"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Link
        href="/"
        aria-label="Wanderlast home"
        className="shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2"
      >
        <Image
          src="/images/Wanderlast.png"
          alt="Wanderlast"
          width={162}
          height={24}
          className="h-5 w-auto md:h-6"
        />
      </Link>

      <div className="flex items-center gap-4 md:gap-6">
        {authLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`flex items-center gap-1.5 text-sm font-medium text-neutral-700 transition-colors hover:text-cyan-600 ${
              link.icon ? "hidden sm:flex" : ""
            }`}
          >
            {link.icon && <UserRound className="h-4 w-4" aria-hidden />}
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
