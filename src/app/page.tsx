'use client';

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAppleAlt, faDumbbell, faUtensils, faHeartbeat, faCheck, faStar, faCrown } from "@fortawesome/free-solid-svg-icons";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      router.push('/perfil');
    }
  }, [isLoaded, user, router]);
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-serif">
                Transforme sua saúde com o <span className="text-amber-300">NutriFit</span>
              </h1>
              <p className="text-lg mb-8 text-gray-100">
                Seu acompanhamento personalizado para uma vida mais saudável com dietas, treinamentos e receitas adaptados às suas necessidades.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="secondary" size="lg">
                  Começar Agora
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-lg shadow-xl bg-white h-[400px] flex items-center justify-center overflow-hidden">
                <Image 
                  src="/img_pratos_saudaveis.jpeg" 
                  alt="Mesa com comida saudável" 
                  width={600} 
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-emerald-800 font-serif">Por que escolher o NutriFit?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Nossa plataforma oferece tudo o que você precisa para alcançar seus objetivos de saúde e bem-estar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <Card className="text-center p-6">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faAppleAlt} className="text-emerald-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-emerald-700">Dietas Personalizadas</h3>
              <p className="text-gray-600">Planos alimentares adaptados ao seu perfil, objetivos e preferências dietéticas.</p>
            </Card>

            {/* Feature 2 */}
            <Card className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faDumbbell} className="text-amber-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-emerald-700">Treinamentos Eficientes</h3>
              <p className="text-gray-600">Exercícios específicos para complementar sua dieta e maximizar resultados.</p>
            </Card>

            {/* Feature 3 */}
            <Card className="text-center p-6">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faUtensils} className="text-emerald-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-emerald-700">Receitas Deliciosas</h3>
              <p className="text-gray-600">Centenas de receitas saudáveis e saborosas que se encaixam no seu plano alimentar.</p>
            </Card>

            {/* Feature 4 */}
            <Card className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faHeartbeat} className="text-amber-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-emerald-700">Acompanhamento Contínuo</h3>
              <p className="text-gray-600">Monitore seu progresso e receba ajustes em tempo real para otimizar resultados.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-emerald-800 font-serif">O que nossos clientes dizem</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Histórias reais de pessoas que transformaram suas vidas com o NutriFit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">Ana Silva</h4>
                  <p className="text-sm text-gray-500">Perdeu 15kg em 6 meses</p>
                </div>
              </div>
              <p className="text-gray-600 italic">&quot;O NutriFit mudou completamente minha relação com a comida. As dietas são fáceis de seguir e as receitas são deliciosas!&quot;</p>
            </Card>

            {/* Testimonial 2 */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">Carlos Oliveira</h4>
                  <p className="text-sm text-gray-500">Ganhou 8kg de massa muscular</p>
                </div>
              </div>
              <p className="text-gray-600 italic">&quot;Os treinamentos são perfeitos para meu objetivo de ganho de massa. Em apenas 4 meses já vi resultados impressionantes.&quot;</p>
            </Card>

            {/* Testimonial 3 */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">Mariana Costa</h4>
                  <p className="text-sm text-gray-500">Melhorou sua saúde geral</p>
                </div>
              </div>
              <p className="text-gray-600 italic">&quot;Não buscava apenas perder peso, mas melhorar minha saúde. Com o NutriFit, meus exames melhoraram e tenho muito mais disposição.&quot;</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-emerald-800 font-serif">Escolha seu Plano</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Encontre o plano perfeito para suas necessidades e comece sua jornada de transformação hoje mesmo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Plano Gratuito */}
            <Card className="p-8 text-center relative flex flex-col h-full">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faAppleAlt} className="text-gray-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800">Gratuito</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-800">R$ 0</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="text-left mb-8 space-y-3 flex-grow">
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="text-emerald-600 mr-3 flex-shrink-0" />
                  <span>Acesso básico a receitas</span>
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="text-emerald-600 mr-3 flex-shrink-0" />
                  <span>Planos de dieta simples</span>
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="text-emerald-600 mr-3 flex-shrink-0" />
                  <span>Comunidade de apoio</span>
                </li>
              </ul>
              <div className="mt-auto">
                <Button variant="outline" className="w-full">
                  Começar Grátis
                </Button>
              </div>
            </Card>

            {/* Plano Premium */}
            <Card className="p-8 text-center relative border-2 border-emerald-500 shadow-lg flex flex-col h-full">
              <div className="absolute top-2 right-2">
                <span className="bg-emerald-500 text-white px-2 py-1 rounded text-xs font-semibold">Mais Popular</span>
              </div>
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faStar} className="text-emerald-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-emerald-800">Premium</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-emerald-800">R$ 18,99</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="text-left mb-8 space-y-3 flex-grow">
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="text-emerald-600 mr-3 flex-shrink-0" />
                  <span>Tudo do plano gratuito</span>
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="text-emerald-600 mr-3 flex-shrink-0" />
                  <span>Dietas personalizadas</span>
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="text-emerald-600 mr-3 flex-shrink-0" />
                  <span>Planos de treino básicos</span>
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="text-emerald-600 mr-3 flex-shrink-0" />
                  <span>Acompanhamento semanal</span>
                </li>
              </ul>
              <div className="mt-auto">
                <Button variant="primary" className="w-full">
                  Assinar Premium
                </Button>
              </div>
            </Card>

            {/* Plano Pro */}
            <Card className="p-8 text-center relative flex flex-col h-full">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faCrown} className="text-amber-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-amber-800">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-amber-800">R$ 29,90</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="text-left mb-8 space-y-3 flex-grow">
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="text-emerald-600 mr-3 flex-shrink-0" />
                  <span>Tudo do plano Premium</span>
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="text-emerald-600 mr-3 flex-shrink-0" />
                  <span>Consultoria nutricional</span>
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="text-emerald-600 mr-3 flex-shrink-0" />
                  <span>Treinos personalizados</span>
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="text-emerald-600 mr-3 flex-shrink-0" />
                  <span>Suporte prioritário 24/7</span>
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faCheck} className="text-emerald-600 mr-3 flex-shrink-0" />
                  <span>Relatórios detalhados</span>
                </li>
              </ul>
              <div className="mt-auto">
                <Button variant="secondary" className="w-full">
                  Assinar Pro
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-serif">Pronto para transformar sua vida?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Junte-se a milhares de pessoas que já estão alcançando seus objetivos com o NutriFit.</p>
          <Button variant="secondary" size="lg">
            Comece Hoje Mesmo
          </Button>
        </div>
      </section>
    </MainLayout>
  );
}
