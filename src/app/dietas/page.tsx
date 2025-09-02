import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faAppleAlt, faDrumstickBite, faBolt, faCube, faClock, faUtensils, faCheckCircle, faTimes, faBalanceScale } from "@fortawesome/free-solid-svg-icons";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

export default function DietasPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-800 font-serif">Dietas Personalizadas</h1>
          <p className="text-gray-600 mt-2">Encontre o plano alimentar perfeito para seus objetivos</p>
        </div>

        {/* Categorias de Dietas */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Escolha Sua Dieta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-emerald-50 rounded-xl p-8 text-center hover:bg-emerald-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faCube} className="text-emerald-600 text-3xl" />
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">Low Carb</h3>
              <p className="text-gray-600 leading-relaxed mb-4">Plano alimentar com baixo teor de carboidratos, ideal para perda de peso e controle glicêmico.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <FontAwesomeIcon icon={faAppleAlt} className="text-emerald-600" />
                  Média proteína
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <FontAwesomeIcon icon={faLeaf} className="text-green-600" />
                  Veggies OK
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <FontAwesomeIcon icon={faCube} className="text-yellow-600" />
                  Açúcar mínimo
                </span>
              </div>
            </div>
            
            <div className="bg-amber-50 rounded-xl p-8 text-center hover:bg-amber-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faBolt} className="text-amber-600 text-3xl" />
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">Cetogênica</h3>
              <p className="text-gray-600 leading-relaxed mb-4">Dieta rica em gorduras e baixa em carboidratos que induz o estado de cetose para queima de gordura.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <FontAwesomeIcon icon={faAppleAlt} className="text-amber-600" />
                  Alta gordura
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <FontAwesomeIcon icon={faAppleAlt} className="text-orange-600" />
                  Média proteína
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <FontAwesomeIcon icon={faTimes} className="text-red-600" />
                  Mínimo carb
                </span>
              </div>
            </div>
            
            <div className="bg-red-50 rounded-xl p-8 text-center hover:bg-red-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faDrumstickBite} className="text-red-600 text-3xl" />
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">Carnívora</h3>
              <p className="text-gray-600 leading-relaxed mb-4">Plano alimentar baseado exclusivamente em produtos de origem animal, eliminando todos os vegetais.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-red-600" />
                  Alta proteína
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
                  Zero carb
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <FontAwesomeIcon icon={faTimes} className="text-green-600" />
                  Sem vegetais
                </span>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-xl p-8 text-center hover:bg-orange-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faBolt} className="text-orange-600 text-3xl" />
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">Ceto-Carnívora</h3>
              <p className="text-gray-600 leading-relaxed mb-4">Combinação da dieta cetogênica com carnívora, focando em gorduras e proteínas animais com zero carboidratos.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-orange-600" />
                  Alta gordura
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <FontAwesomeIcon icon={faAppleAlt} className="text-red-600" />
                  Média proteína
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
                  Mínimo carb
                </span>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-8 text-center hover:bg-purple-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faClock} className="text-purple-600 text-3xl" />
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">Jejum Intermitente</h3>
              <p className="text-gray-600 leading-relaxed mb-4">Protocolo alimentar que alterna períodos de jejum e alimentação para otimizar metabolismo e queima de gordura.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <FontAwesomeIcon icon={faClock} className="text-purple-600" />
                  Ciclos alimentares
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <FontAwesomeIcon icon={faClock} className="text-indigo-600" />
                  Jejum programado
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <FontAwesomeIcon icon={faBalanceScale} className="text-blue-600" />
                  Equilíbrio calórico
                </span>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-8 text-center hover:bg-blue-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faUtensils} className="text-blue-600 text-3xl" />
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">Reeducação Alimentar</h3>
              <p className="text-gray-600 leading-relaxed mb-4">Mudança gradual e sustentável dos hábitos alimentares, promovendo uma relação saudável com a comida.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <FontAwesomeIcon icon={faBalanceScale} className="text-blue-600" />
                  Equilibrada
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
                  Sustentável
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <FontAwesomeIcon icon={faUtensils} className="text-blue-600" />
                  Flexível
                </span>
              </div>
            </div>
          </div>
        </div>


      </div>
    </MainLayout>
  );
}