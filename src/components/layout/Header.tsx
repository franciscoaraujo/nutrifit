'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faUser, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '@clerk/nextjs';
import UserMenu from '@/components/auth/UserMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoaded, user } = useUser();

  return (
    <header className="bg-[var(--primary)] text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="#" className="flex items-center">
            <h1 className="text-2xl font-bold font-serif">Nutri<span className="text-[var(--secondary)]">Fit</span></h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {isLoaded && user ? (
              <>
                <Link href="/dietas" className="text-white hover:text-[var(--secondary)] transition-colors">
                  Dietas
                </Link>
                <Link href="/treinamentos" className="text-white hover:text-[var(--secondary)] transition-colors">
                  Treinamentos
                </Link>
                <Link href="/receitas" className="text-white hover:text-[var(--secondary)] transition-colors">
                  Receitas
                </Link>
                <Link href="/dashboard" className="text-white hover:text-[var(--secondary)] transition-colors">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="text-white hover:text-[var(--secondary)] transition-colors">
                  Login
                </Link>
                <Link href="/sign-up" className="text-white hover:text-[var(--secondary)] transition-colors">
                  Cadastro
                </Link>
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isLoaded && user ? (
              <>
                <button className="text-white hover:text-[var(--secondary)] transition-colors">
                  <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
                </button>
                <UserMenu />
              </>
            ) : null}
            <button 
              className="md:hidden text-white hover:text-[var(--secondary)] transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[var(--primary-dark)] py-4">
          <nav className="flex flex-col space-y-3 px-4">
            {isLoaded && user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-white hover:text-[var(--secondary)] transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/dietas" 
                  className="text-white hover:text-[var(--secondary)] transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dietas
                </Link>
                <Link 
                  href="/treinamentos" 
                  className="text-white hover:text-[var(--secondary)] transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Treinamentos
                </Link>
                <Link 
                  href="/receitas" 
                  className="text-white hover:text-[var(--secondary)] transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Receitas
                </Link>
              </>
            ) : (
              <div className="py-2">
                <Link 
                  href="/sign-in" 
                  className="text-white hover:text-[var(--secondary)] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <span className="text-gray-300 mx-2">|</span>
                <Link 
                  href="/sign-up" 
                  className="text-white hover:text-[var(--secondary)] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cadastro
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;