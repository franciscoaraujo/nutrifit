'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faCog, faChartLine } from '@fortawesome/free-solid-svg-icons';

export default function UserMenu() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await signOut();
  };

  // Fechar o menu quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isLoaded) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  if (!user) {
    return (
      <div className="flex space-x-2">
        <Link 
          href="/sign-in"
          className="text-sm font-medium text-primary hover:text-primary/80"
        >
          Entrar
        </Link>
        <span className="text-gray-300">|</span>
        <Link 
          href="/sign-up"
          className="text-sm font-medium text-primary hover:text-primary/80"
        >
          Registrar
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        {user?.imageUrl ? (
          <Image 
            src={user.imageUrl} 
            alt="Foto do perfil" 
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
            <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
          </div>
        )}
        <span className="text-sm font-medium hidden md:block">
          {user?.firstName || user?.username || 'Usuário'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {user?.imageUrl ? (
                <Image 
                  src={user.imageUrl} 
                  alt="Foto do perfil" 
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                  <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.firstName || user?.username}</p>
                <p className="text-xs text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
          </div>

          <Link 
            href="/dashboard/perfil"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <FontAwesomeIcon icon={faUser} className="mr-2 h-4 w-4 text-gray-400" />
            Meu Perfil
          </Link>

          <Link 
            href="/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <FontAwesomeIcon icon={faChartLine} className="mr-2 h-4 w-4 text-gray-400" />
            Dashboard
          </Link>

          <Link 
            href="/dashboard/configuracoes"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <FontAwesomeIcon icon={faCog} className="mr-2 h-4 w-4 text-gray-400" />
            Configurações
          </Link>

          <button
            onClick={handleLogout}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center border-t border-gray-100"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 h-4 w-4 text-gray-400" />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}