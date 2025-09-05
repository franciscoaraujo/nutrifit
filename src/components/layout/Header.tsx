'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs';
import UserMenu from '@/components/auth/UserMenu';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  return (
    <header className="bg-[var(--primary)] text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="#" className="flex items-center">
            <h1 className="text-2xl font-bold font-serif">Nutri<span className="text-[var(--secondary)]">Fit</span></h1>
          </Link>

          {/* Desktop Navigation 
          <nav className="hidden md:flex space-x-6">
            {isLoaded && user ? (
              <>
                <Link href="/perfil" className="text-white hover:text-[var(--secondary)] transition-colors">
                  Meu Perfil
                </Link>
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-white hover:text-[var(--secondary)] transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                
              </>
            )}
          </nav>  Fim da Navbar */}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isLoaded && user ? (
              <>
                <button className="text-white hover:text-[var(--secondary)] transition-colors">
                  <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
                </button>
                <UserMenu />
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <SignInButton mode="modal">
                  <button 
                    className="text-white hover:text-[var(--secondary)] transition-colors flex items-center space-x-2 disabled:opacity-50"
                    onClick={() => setIsSigningIn(true)}
                    disabled={isSigningIn}
                  >
                    {isSigningIn && <LoadingSpinner size="sm" color="white" />}
                    <span>Sign In</span>
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button 
                    className="text-white hover:text-[var(--secondary)] transition-colors flex items-center space-x-2 disabled:opacity-50"
                    onClick={() => setIsSigningUp(true)}
                    disabled={isSigningUp}
                  >
                    {isSigningUp && <LoadingSpinner size="sm" color="white" />}
                    <span>Sign Up</span>
                  </button>
                </SignUpButton>
              </div>
            )}
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
                  href="/perfil" 
                  className="text-white hover:text-[var(--secondary)] transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Meu Perfil
                </Link>
              </>
            ) : (
              <div className="py-2 space-y-3">
                <SignInButton mode="modal">
                  <button 
                    className="text-white hover:text-[var(--secondary)] transition-colors flex items-center space-x-2 disabled:opacity-50"
                    onClick={() => {
                      setIsSigningIn(true);
                      setIsMenuOpen(false);
                    }}
                    disabled={isSigningIn}
                  >
                    {isSigningIn && <LoadingSpinner size="sm" color="white" />}
                    <span>Sign In</span>
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button 
                    className="text-white hover:text-[var(--secondary)] transition-colors flex items-center space-x-2 disabled:opacity-50"
                    onClick={() => {
                      setIsSigningUp(true);
                      setIsMenuOpen(false);
                    }}
                    disabled={isSigningUp}
                  >
                    {isSigningUp && <LoadingSpinner size="sm" color="white" />}
                    <span>Sign Up</span>
                  </button>
                </SignUpButton>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;