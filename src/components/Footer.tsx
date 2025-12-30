import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <img src="/logo.svg" alt="Administradora Mutual" className="h-12 w-auto mb-4 brightness-0 invert" />
            <p className="text-sm text-gray-400 max-w-md">
              Administradora especializada em gestão de seguros mútuos, oferecendo soluções completas
              e personalizadas para seguradoras autorizadas pela SUSEP.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold text-white mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-sm hover:text-white transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/legislacao">
                  <a className="text-sm hover:text-white transition-colors">Legislação</a>
                </Link>
              </li>
              <li>
                <Link href="/seguradoras">
                  <a className="text-sm hover:text-white transition-colors">Seguradoras</a>
                </Link>
              </li>
              <li>
                <Link href="/mutualismo">
                  <a className="text-sm hover:text-white transition-colors">Mutualismo</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold text-white mb-4">Sistemas</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://sistemas.administradoramutual.com.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors"
                >
                  Portal de Sistemas
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {currentYear} Administradora Mutual. Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            **TESTE DE AUTOMAÇÃO DE DOCUMENTAÇÃO: CONTEÚDO ATUALIZADO**
            
            Seguradoras autorizadas pela SUSEP - Superintendência de Seguros Privados
          </p>
        </div>
      </div>
    </footer>
  );
}

