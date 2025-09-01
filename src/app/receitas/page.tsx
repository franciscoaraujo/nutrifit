import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faLeaf, faFire, faSearch, faFilter, faClock } from "@fortawesome/free-solid-svg-icons";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

export default function ReceitasPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-800 font-serif">Receitas Saudáveis</h1>
            <p className="text-gray-600 mt-2">Descubra pratos deliciosos e nutritivos para complementar sua dieta</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="primary" size="md">
              <FontAwesomeIcon icon={faFilter} className="mr-2" />
              Filtrar Receitas
            </Button>
          </div>
        </div>

        {/* Barra de Pesquisa */}
        <div className="mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar receitas por nome, ingredientes ou categoria..."
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
          <div className="bg-emerald-50 rounded-lg p-4 text-center hover:bg-emerald-100 transition cursor-pointer">
            <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faLeaf} className="text-emerald-600 text-xl" />
            </div>
            <h3 className="font-medium">Low Carb</h3>
            <p className="text-xs text-gray-500 mt-1">24 receitas</p>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4 text-center hover:bg-amber-100 transition cursor-pointer">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faUtensils} className="text-amber-600 text-xl" />
            </div>
            <h3 className="font-medium">Proteicas</h3>
            <p className="text-xs text-gray-500 mt-1">18 receitas</p>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-4 text-center hover:bg-emerald-100 transition cursor-pointer">
            <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faFire} className="text-emerald-600 text-xl" />
            </div>
            <h3 className="font-medium">Detox</h3>
            <p className="text-xs text-gray-500 mt-1">12 receitas</p>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4 text-center hover:bg-amber-100 transition cursor-pointer">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faLeaf} className="text-amber-600 text-xl" />
            </div>
            <h3 className="font-medium">Vegetarianas</h3>
            <p className="text-xs text-gray-500 mt-1">20 receitas</p>
          </div>
        </div>

        {/* Lista de Receitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Receita 1 */}
          <Card className="overflow-hidden diet-card">
            <div className="h-48 bg-emerald-200 flex items-center justify-center">
              <p className="text-emerald-700">Imagem da Salada Proteica</p>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-emerald-800">Salada Proteica com Frango</h3>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">Popular</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Salada nutritiva com peito de frango grelhado, mix de folhas, quinoa e molho de iogurte.
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faClock} className="mr-1" />
                  20 minutos
                </span>
                <span>Dificuldade: Fácil</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Proteica</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Low Carb</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Sem Glúten</span>
              </div>
              <Link href="/receitas/salada-proteica-frango">
                <Button variant="primary" fullWidth>
                  Ver Receita
                </Button>
              </Link>
            </div>
          </Card>

          {/* Receita 2 */}
          <Card className="overflow-hidden diet-card">
            <div className="h-48 bg-amber-200 flex items-center justify-center">
              <p className="text-amber-700">Imagem do Smoothie Verde</p>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-emerald-800">Smoothie Verde Detox</h3>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Detox</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Bebida refrescante com espinafre, abacate, banana, gengibre e água de coco para desintoxicar.
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faClock} className="mr-1" />
                  5 minutos
                </span>
                <span>Dificuldade: Fácil</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Detox</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Vegano</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Sem Lactose</span>
              </div>
              <Link href="/receitas/smoothie-verde-detox">
                <Button variant="primary" fullWidth>
                  Ver Receita
                </Button>
              </Link>
            </div>
          </Card>

          {/* Receita 3 */}
          <Card className="overflow-hidden diet-card">
            <div className="h-48 bg-emerald-200 flex items-center justify-center">
              <p className="text-emerald-700">Imagem do Salmão Grelhado</p>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-emerald-800">Salmão Grelhado com Aspargos</h3>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">Proteica</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Filé de salmão grelhado com aspargos, limão e ervas frescas. Rico em ômega-3 e proteínas.
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faClock} className="mr-1" />
                  25 minutos
                </span>
                <span>Dificuldade: Média</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Proteica</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Low Carb</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Ômega-3</span>
              </div>
              <Link href="/receitas/salmao-grelhado-aspargos">
                <Button variant="primary" fullWidth>
                  Ver Receita
                </Button>
              </Link>
            </div>
          </Card>

          {/* Receita 4 */}
          <Card className="overflow-hidden diet-card">
            <div className="h-48 bg-amber-200 flex items-center justify-center">
              <p className="text-amber-700">Imagem do Bowl de Açaí</p>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-emerald-800">Bowl de Açaí Energético</h3>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Energético</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Bowl de açaí com banana, granola, sementes de chia e frutas vermelhas. Perfeito para pré-treino.
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faClock} className="mr-1" />
                  10 minutos
                </span>
                <span>Dificuldade: Fácil</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Energético</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Vegetariano</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Antioxidantes</span>
              </div>
              <Link href="/receitas/bowl-acai-energetico">
                <Button variant="primary" fullWidth>
                  Ver Receita
                </Button>
              </Link>
            </div>
          </Card>

          {/* Receita 5 */}
          <Card className="overflow-hidden diet-card">
            <div className="h-48 bg-emerald-200 flex items-center justify-center">
              <p className="text-emerald-700">Imagem da Omelete de Claras</p>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-emerald-800">Omelete de Claras com Vegetais</h3>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">Proteica</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Omelete de claras com espinafre, tomate, cebola e queijo cottage. Alta proteína e baixa gordura.
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faClock} className="mr-1" />
                  15 minutos
                </span>
                <span>Dificuldade: Fácil</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Proteica</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Low Carb</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Baixa Gordura</span>
              </div>
              <Link href="/receitas/omelete-claras-vegetais">
                <Button variant="primary" fullWidth>
                  Ver Receita
                </Button>
              </Link>
            </div>
          </Card>

          {/* Receita 6 */}
          <Card className="overflow-hidden diet-card">
            <div className="h-48 bg-amber-200 flex items-center justify-center">
              <p className="text-amber-700">Imagem do Wrap Vegano</p>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-emerald-800">Wrap Vegano de Grão-de-Bico</h3>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Vegano</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Wrap integral com pasta de grão-de-bico, abacate, alface, tomate e molho de tahine.
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faClock} className="mr-1" />
                  15 minutos
                </span>
                <span>Dificuldade: Fácil</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Vegano</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Rico em Fibras</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Proteína Vegetal</span>
              </div>
              <Link href="/receitas/wrap-vegano-grao-de-bico">
                <Button variant="primary" fullWidth>
                  Ver Receita
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