import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { SignInButton, SignUpButton } from '@clerk/nextjs';

const Footer = () => {
  return (
    <footer className="bg-[var(--primary-dark)] text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-serif">Nutri<span className="text-[var(--secondary)]">Fit</span></h3>
            <p className="text-gray-300 mb-4">
              Seu parceiro para uma vida mais saudável com dietas personalizadas, treinamentos eficientes e receitas deliciosas.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-[var(--secondary)] transition-colors">
                <FontAwesomeIcon icon={faFacebook} className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-[var(--secondary)] transition-colors">
                <FontAwesomeIcon icon={faInstagram} className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-[var(--secondary)] transition-colors">
                <FontAwesomeIcon icon={faTwitter} className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-[var(--secondary)] transition-colors">
                <FontAwesomeIcon icon={faYoutube} className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-[var(--secondary)] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <SignInButton mode="modal">
                  <button className="text-gray-300 hover:text-[var(--secondary)] transition-colors">
                    Login
                  </button>
                </SignInButton>
              </li>
              <li>
                <SignUpButton mode="modal">
                  <button className="text-gray-300 hover:text-[var(--secondary)] transition-colors">
                    Cadastro
                  </button>
                </SignUpButton>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-[var(--secondary)] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-300 hover:text-[var(--secondary)] transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-gray-300 hover:text-[var(--secondary)] transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-gray-300 hover:text-[var(--secondary)] transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-300 mb-4">Receba dicas de saúde e novidades sobre nutrição.</p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Seu e-mail" 
                className="px-4 py-2 rounded bg-[var(--primary)] text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
              />
              <button 
                type="submit" 
                className="bg-[var(--secondary)] hover:bg-[var(--secondary-dark)] text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Inscrever-se
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-emerald-700 pt-6 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} NutriFit. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;