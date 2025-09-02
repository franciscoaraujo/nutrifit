'use client';

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAppleAlt, faDumbbell, faUtensils, faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function Home() {
  const { isLoaded, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      router.push('/receitas');
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
                <Link href="/auth/register">
                  <Button variant="secondary" size="lg">
                    Começar Agora
                  </Button>
                </Link>
                <Link href="/dietas">
                  <Button variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white/20">
                    Explorar Dietas
                  </Button>
                </Link>
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
              <p className="text-gray-600 italic">"O NutriFit mudou completamente minha relação com a comida. As dietas são fáceis de seguir e as receitas são deliciosas!"</p>
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
              <p className="text-gray-600 italic">"Os treinamentos são perfeitos para meu objetivo de ganho de massa. Em apenas 4 meses já vi resultados impressionantes."</p>
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
              <p className="text-gray-600 italic">"Não buscava apenas perder peso, mas melhorar minha saúde. Com o NutriFit, meus exames melhoraram e tenho muito mais disposição."</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-serif">Pronto para transformar sua vida?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Junte-se a milhares de pessoas que já estão alcançando seus objetivos com o NutriFit.</p>
          <Link href="/auth/register">
            <Button variant="secondary" size="lg">
              Comece Hoje Mesmo
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
