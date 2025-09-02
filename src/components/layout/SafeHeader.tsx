'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const SafeHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-[var(--primary)] text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold font-serif">Nutri<span className="text-[var(--secondary)]">Fit</span></h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-white hover:text-[var(--secondary)] transition-colors">
              Início
            </Link>
            <Link href="/dietas" className="text-white hover:text-[var(--secondary)] transition-colors">
              Dietas
            </Link>
            <Link href="/treinamentos" className="text-white hover:text-[var(--secondary)] transition-colors">
              Treinamentos
            </Link>
            <Link href="/receitas" className="text-white hover:text-[var(--secondary)] transition-colors">
              Receitas
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white hover:text-[var(--secondary)] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-xl" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-emerald-700">
            <div className="flex flex-col space-y-3 pt-4">
              <Link href="/" className="text-white hover:text-[var(--secondary)] transition-colors">
                Início
              </Link>
              <Link href="/dietas" className="text-white hover:text-[var(--secondary)] transition-colors">
                Dietas
              </Link>
              <Link href="/treinamentos" className="text-white hover:text-[var(--secondary)] transition-colors">
                Treinamentos
              </Link>
              <Link href="/receitas" className="text-white hover:text-[var(--secondary)] transition-colors">
                Receitas
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default SafeHeader;