import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sistemasOpen, setSistemasOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Legislação", path: "/legislacao" },
    { name: "Seguradoras", path: "/seguradoras" },
    { name: "Mutualismo", path: "/mutualismo" },
    { name: "Monitoramento", path: "/monitoramento" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/logo.svg" alt="Administradora Mutual" className="h-12 w-auto" />
              <span className="font-semibold text-xl text-primary hidden sm:inline">
                Administradora Mutual
              </span>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </a>
              </Link>
            ))}

            {/* Sistemas Internos Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSistemasOpen(!sistemasOpen)}
                onBlur={() => setTimeout(() => setSistemasOpen(false), 200)}
                className="px-4 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1"
              >
                Sistemas Internos
                <ChevronDown className={`h-4 w-4 transition-transform ${sistemasOpen ? 'rotate-180' : ''}`} />
              </button>
              {sistemasOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200">
                  <a
                    href="https://sistemas.administradoramutual.com.br/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Acessar Portal de Sistemas
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-md font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </a>
              </Link>
            ))}
            <a
              href="https://sistemas.administradoramutual.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Sistemas Internos
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

