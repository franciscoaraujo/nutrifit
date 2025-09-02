'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEdit, faWeight, faRulerVertical, faCalendarAlt, faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";

export default function ProfilePage() {
  const [fotoPerfil, setFotoPerfil] = useState<string>('');

  // Simular carregamento da foto do perfil (em uma aplicação real, viria de uma API)
  useEffect(() => {
    const fotoSalva = localStorage.getItem('fotoPerfil');
    if (fotoSalva) {
      setFotoPerfil(fotoSalva);
    }
  }, []);
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-emerald-800 mb-8 font-serif">Meu Perfil</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna da Esquerda - Informações do Perfil */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                  {fotoPerfil ? (
                    <Image 
                      src={fotoPerfil} 
                      alt="Foto do perfil" 
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUser} className="text-emerald-600 text-4xl" />
                  )}
                </div>
                <h2 className="text-xl font-bold">João Silva</h2>
                <p className="text-gray-500">joao.silva@email.com</p>
                <p className="text-sm text-emerald-600 mt-2">Membro desde Junho 2023</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-bold text-lg mb-4">Informações Pessoais</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faWeight} className="text-emerald-500 mr-3" />
                      <span className="text-gray-600">Peso</span>
                    </div>
                    <span className="font-medium">75 kg</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faRulerVertical} className="text-emerald-500 mr-3" />
                      <span className="text-gray-600">Altura</span>
                    </div>
                    <span className="font-medium">1.78 m</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-emerald-500 mr-3" />
                      <span className="text-gray-600">Idade</span>
                    </div>
                    <span className="font-medium">32 anos</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faHeartbeat} className="text-emerald-500 mr-3" />
                      <span className="text-gray-600">Objetivo</span>
                    </div>
                    <span className="font-medium">Perda de peso</span>
                  </div>
                </div>
                
                <Link href="/perfil/configuracao">
                  <Button 
                    variant="outline" 
                    className="mt-6 w-full flex items-center justify-center" 
                    size="md"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Editar Perfil
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
          
          {/* Coluna da Direita - Progresso e Planos */}
          <div className="lg:col-span-2">
            {/* Progresso */}
            <Card className="p-6 mb-8">
              <h3 className="font-bold text-xl mb-4">Meu Progresso</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Perda de Peso</span>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Treinos Completados</span>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Adesão à Dieta</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-emerald-700">-5kg</p>
                  <p className="text-sm text-gray-600">Perda Total</p>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-amber-700">18</p>
                  <p className="text-sm text-gray-600">Treinos</p>
                </div>
                
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-emerald-700">42</p>
                  <p className="text-sm text-gray-600">Dias Seguidos</p>
                </div>
              </div>
            </Card>
            
            {/* Planos Ativos */}
            <Card className="p-6">
              <h3 className="font-bold text-xl mb-4">Meus Planos Ativos</h3>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-lg">Dieta Low Carb</h4>
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">Ativo</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">Plano alimentar com baixo carboidrato para perda de peso acelerada.</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Progresso: 2 de 8 semanas</span>
                    <Button variant="outline" size="sm">Ver Detalhes</Button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-lg">Treino HIIT</h4>
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">Ativo</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">Treinamento intervalado de alta intensidade para queima de gordura.</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Progresso: 3 de 12 semanas</span>
                    <Button variant="outline" size="sm">Ver Detalhes</Button>
                  </div>
                </div>
              </div>
              
              <Button variant="primary" className="mt-6 w-full" size="md">
                Explorar Mais Planos
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}