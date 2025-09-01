import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDumbbell, faRunning, faHeartbeat, faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

export default function TreinamentosPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-800 font-serif">Treinamentos Personalizados</h1>
            <p className="text-gray-600 mt-2">Encontre o plano de exercícios ideal para seus objetivos</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="primary" size="md">
              <FontAwesomeIcon icon={faFilter} className="mr-2" />
              Filtrar Treinamentos
            </Button>
          </div>
        </div>

        {/* Barra de Pesquisa */}
        <div className="mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar treinamentos por nome, tipo ou objetivo..."
              fullWidth
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Categorias */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-amber-50 rounded-lg p-4 text-center hover:bg-amber-100 transition cursor-pointer">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faDumbbell} className="text-amber-600 text-xl" />
            </div>
            <h3 className="font-medium">Força</h3>
            <p className="text-xs text-gray-500 mt-1">15 planos</p>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-4 text-center hover:bg-emerald-100 transition cursor-pointer">
            <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faRunning} className="text-emerald-600 text-xl" />
            </div>
            <h3 className="font-medium">Cardio</h3>
            <p className="text-xs text-gray-500 mt-1">12 planos</p>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4 text-center hover:bg-amber-100 transition cursor-pointer">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faHeartbeat} className="text-amber-600 text-xl" />
            </div>
            <h3 className="font-medium">HIIT</h3>
            <p className="text-xs text-gray-500 mt-1">8 planos</p>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-4 text-center hover:bg-emerald-100 transition cursor-pointer">
            <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faDumbbell} className="text-emerald-600 text-xl" />
            </div>
            <h3 className="font-medium">Funcional</h3>
            <p className="text-xs text-gray-500 mt-1">10 planos</p>
          </div>
        </div>

        {/* Lista de Treinamentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Treinamento 1 */}
          <Card className="overflow-hidden diet-card">
            <div className="h-48 bg-amber-200 flex items-center justify-center">
              <p className="text-amber-700">Imagem do Treinamento HIIT</p>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-emerald-800">HIIT para Queima de Gordura</h3>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Popular</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Treinamento intervalado de alta intensidade para maximizar a queima calórica e perda de gordura.
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>Duração: 30 min/dia</span>
                <span>Dificuldade: Alta</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Queima de Gordura</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Cardio</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Intenso</span>
              </div>
              <Link href="/treinamentos/hiit-queima-gordura">
                <Button variant="primary" fullWidth>
                  Ver Detalhes
                </Button>
              </Link>
            </div>
          </Card>

          {/* Treinamento 2 */}
          <Card className="overflow-hidden diet-card">
            <div className="h-48 bg-emerald-200 flex items-center justify-center">
              <p className="text-emerald-700">Imagem do Treinamento de Força</p>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-emerald-800">Treino de Força Total</h3>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">Recomendado</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Programa completo para ganho de massa muscular e força, trabalhando todos os grupos musculares.
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>Duração: 45-60 min/dia</span>
                <span>Dificuldade: Média</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Hipertrofia</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Força</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Resistência</span>
              </div>
              <Link href="/treinamentos/forca-total">
                <Button variant="primary" fullWidth>
                  Ver Detalhes
                </Button>
              </Link>
            </div>
          </Card>

          {/* Treinamento 3 */}
          <Card className="overflow-hidden diet-card">
            <div className="h-48 bg-amber-200 flex items-center justify-center">
              <p className="text-amber-700">Imagem do Treinamento Funcional</p>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-emerald-800">Treino Funcional</h3>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Versátil</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Exercícios que simulam movimentos do dia a dia, melhorando força, equilíbrio e mobilidade.
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>Duração: 40 min/dia</span>
                <span>Dificuldade: Média</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Equilíbrio</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Coordenação</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Core</span>
              </div>
              <Link href="/treinamentos/funcional">
                <Button variant="primary" fullWidth>
                  Ver Detalhes
                </Button>
              </Link>
            </div>
          </Card>

          {/* Treinamento 4 */}
          <Card className="overflow-hidden diet-card">
            <div className="h-48 bg-emerald-200 flex items-center justify-center">
              <p className="text-emerald-700">Imagem do Treinamento Cardio</p>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-emerald-800">Cardio Progressivo</h3>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">Iniciante</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Programa de condicionamento cardiovascular com progressão gradual para melhorar resistência.
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>Duração: 20-40 min/dia</span>
                <span>Dificuldade: Baixa a Média</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Resistência</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Saúde Cardíaca</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Progressivo</span>
              </div>
              <Link href="/treinamentos/cardio-progressivo">
                <Button variant="primary" fullWidth>
                  Ver Detalhes
                </Button>
              </Link>
            </div>
          </Card>

          {/* Treinamento 5 */}
          <Card className="overflow-hidden diet-card">
            <div className="h-48 bg-amber-200 flex items-center justify-center">
              <p className="text-amber-700">Imagem do Treinamento para Iniciantes</p>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-emerald-800">Iniciação ao Fitness</h3>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Básico</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Programa completo para quem está começando, com foco em técnica e adaptação gradual ao exercício.
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>Duração: 30 min/dia</span>
                <span>Dificuldade: Baixa</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Iniciante</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Técnica</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Adaptação</span>
              </div>
              <Link href="/treinamentos/iniciacao-fitness">
                <Button variant="primary" fullWidth>
                  Ver Detalhes
                </Button>
              </Link>
            </div>
          </Card>

          {/* Treinamento 6 */}
          <Card className="overflow-hidden diet-card">
            <div className="h-48 bg-emerald-200 flex items-center justify-center">
              <p className="text-emerald-700">Imagem do Treinamento em Casa</p>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-emerald-800">Treino em Casa</h3>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">Sem Equipamento</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Programa completo para treinar em casa, usando apenas o peso corporal ou equipamentos mínimos.
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>Duração: 30-45 min/dia</span>
                <span>Dificuldade: Variável</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Em Casa</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Peso Corporal</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Flexível</span>
              </div>
              <Link href="/treinamentos/em-casa">
                <Button variant="primary" fullWidth>
                  Ver Detalhes
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Paginação */}
        <div className="mt-12 flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            <a href="#" className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50">
              Anterior
            </a>
            <a href="#" className="px-4 py-2 bg-emerald-600 border border-emerald-600 text-sm font-medium text-white hover:bg-emerald-700">
              1
            </a>
            <a href="#" className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50">
              2
            </a>
            <a href="#" className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50">
              3
            </a>
            <a href="#" className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50">
              Próxima
            </a>
          </nav>
        </div>
      </div>
    </MainLayout>
  );
}