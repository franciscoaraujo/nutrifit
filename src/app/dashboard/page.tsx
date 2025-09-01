'use client';

import { useState, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faRuler, faCalendarAlt, faSave, faPlus, faCamera, faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

interface MedidaCorporal {
  id: string;
  data: string;
  bracos: number;
  busto: number;
  cintura: number;
  quadril: number;
  coxas: number;
  foto?: string;
}

export default function DashboardPage() {
  const [medidas, setMedidas] = useState<MedidaCorporal[]>([]);
  const [novaMedida, setNovaMedida] = useState({
    data: new Date().toISOString().split('T')[0],
    bracos: '',
    busto: '',
    cintura: '',
    quadril: '',
    coxas: ''
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [fotoCapturada, setFotoCapturada] = useState<string | null>(null);
  const [mostrarHistoricoFotos, setMostrarHistoricoFotos] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraAtiva, setCameraAtiva] = useState(false);

  const handleInputChange = (campo: string, valor: string) => {
    setNovaMedida(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const iniciarCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraAtiva(true);
      }
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
      alert('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  };

  const pararCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraAtiva(false);
    }
  };

  const tirarFoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const fotoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setFotoCapturada(fotoDataUrl);
        pararCamera();
      }
    }
  };

  const removerFoto = () => {
    setFotoCapturada(null);
  };

  const salvarMedida = () => {
    if (novaMedida.bracos && novaMedida.busto && novaMedida.cintura && novaMedida.quadril && novaMedida.coxas) {
      const medida: MedidaCorporal = {
        id: Date.now().toString(),
        data: novaMedida.data,
        bracos: parseFloat(novaMedida.bracos),
        busto: parseFloat(novaMedida.busto),
        cintura: parseFloat(novaMedida.cintura),
        quadril: parseFloat(novaMedida.quadril),
        coxas: parseFloat(novaMedida.coxas),
        foto: fotoCapturada || undefined
      };
      
      setMedidas(prev => [medida, ...prev]);
      setNovaMedida({
        data: new Date().toISOString().split('T')[0],
        bracos: '',
        busto: '',
        cintura: '',
        quadril: '',
        coxas: ''
      });
      setFotoCapturada(null);
      setMostrarFormulario(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-800 font-serif flex items-center gap-3">
              <FontAwesomeIcon icon={faChartLine} className="text-emerald-600" />
              Dashboard - Evolução da Dieta
            </h1>
            <p className="text-gray-600 mt-2">Acompanhe seu progresso através das medidas corporais</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Button 
              variant="primary" 
              size="md"
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Nova Medição
            </Button>
            <Button 
              variant="outline" 
              size="md"
              onClick={() => setMostrarHistoricoFotos(!mostrarHistoricoFotos)}
            >
              <FontAwesomeIcon icon={faImage} className="mr-2" />
              Histórico de Fotos
            </Button>
          </div>
        </div>

        {/* Formulário de Nova Medida */}
        {mostrarFormulario && (
          <Card className="mb-8 p-6">
            <h2 className="text-xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
              <FontAwesomeIcon icon={faRuler} className="text-emerald-600" />
              Registrar Novas Medidas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-emerald-600" />
                  Data da Medição
                </label>
                <Input
                  type="date"
                  value={novaMedida.data}
                  onChange={(e) => handleInputChange('data', e.target.value)}
                  fullWidth
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diâmetro dos Braços (cm)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 32.5"
                  value={novaMedida.bracos}
                  onChange={(e) => handleInputChange('bracos', e.target.value)}
                  fullWidth
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diâmetro do Busto (cm)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 95.0"
                  value={novaMedida.busto}
                  onChange={(e) => handleInputChange('busto', e.target.value)}
                  fullWidth
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diâmetro da Cintura (cm)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 75.5"
                  value={novaMedida.cintura}
                  onChange={(e) => handleInputChange('cintura', e.target.value)}
                  fullWidth
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diâmetro do Quadril (cm)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 98.0"
                  value={novaMedida.quadril}
                  onChange={(e) => handleInputChange('quadril', e.target.value)}
                  fullWidth
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diâmetro das Coxas (cm)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 58.5"
                  value={novaMedida.coxas}
                  onChange={(e) => handleInputChange('coxas', e.target.value)}
                  fullWidth
                />
              </div>
            </div>
            
            {/* Seção de Foto */}
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faCamera} className="text-emerald-600" />
                Foto de Progresso (Opcional)
              </h3>
              
              {!fotoCapturada && !cameraAtiva && (
                <div className="flex gap-3">
                  <Button variant="outline" onClick={iniciarCamera}>
                    <FontAwesomeIcon icon={faCamera} className="mr-2" />
                    Tirar Foto
                  </Button>
                </div>
              )}
              
              {cameraAtiva && (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden max-w-md">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="primary" onClick={tirarFoto}>
                      <FontAwesomeIcon icon={faCamera} className="mr-2" />
                      Capturar
                    </Button>
                    <Button variant="outline" onClick={pararCamera}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
              
              {fotoCapturada && (
                <div className="space-y-4">
                  <div className="relative max-w-md">
                    <img 
                      src={fotoCapturada} 
                      alt="Foto capturada" 
                      className="w-full h-auto rounded-lg border-2 border-emerald-200"
                    />
                    <button 
                      onClick={removerFoto}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-sm" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">Foto capturada com sucesso!</p>
                </div>
              )}
              
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setMostrarFormulario(false);
                  setFotoCapturada(null);
                  pararCamera();
                }}
              >
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                onClick={salvarMedida}
              >
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                Salvar Medidas
              </Button>
            </div>
          </Card>
        )}

        {/* Histórico de Fotos */}
        {mostrarHistoricoFotos && (
          <Card className="mb-8 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-emerald-800 flex items-center gap-2">
                <FontAwesomeIcon icon={faImage} className="text-emerald-600" />
                Histórico de Fotos
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setMostrarHistoricoFotos(false)}
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Fechar
              </Button>
            </div>
            
            {medidas.filter(m => m.foto).length === 0 ? (
              <div className="text-center py-12">
                <FontAwesomeIcon icon={faImage} className="text-gray-300 text-6xl mb-4" />
                <p className="text-gray-500 text-lg">Nenhuma foto registrada ainda</p>
                <p className="text-gray-400 mt-2">As fotos aparecerão aqui conforme você as adicionar nas medições</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {medidas.filter(m => m.foto).map((medida) => (
                  <div key={medida.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-square relative">
                      <img 
                        src={medida.foto} 
                        alt={`Foto de ${new Date(medida.data).toLocaleDateString('pt-BR')}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        {new Date(medida.data).toLocaleDateString('pt-BR')}
                      </p>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>Braços: {medida.bracos}cm</p>
                        <p>Cintura: {medida.cintura}cm</p>
                        <p>Quadril: {medida.quadril}cm</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Histórico de Medidas */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-emerald-800 mb-6">
            Histórico de Medidas
          </h2>
          
          {medidas.length === 0 ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faRuler} className="text-gray-300 text-6xl mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma medida registrada ainda</p>
              <p className="text-gray-400 mt-2">Clique em "Nova Medição" para começar a acompanhar seu progresso</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-emerald-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-emerald-800">Data</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-emerald-800">Braços (cm)</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-emerald-800">Busto (cm)</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-emerald-800">Cintura (cm)</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-emerald-800">Quadril (cm)</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-emerald-800">Coxas (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {medidas.map((medida, index) => (
                    <tr key={medida.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(medida.data).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{medida.bracos}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{medida.busto}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{medida.cintura}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{medida.quadril}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{medida.coxas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Informações Adicionais */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-emerald-800 mb-4">Como Medir Corretamente</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Braços:</strong> Meça na parte mais larga do bíceps, com o braço relaxado</li>
              <li>• <strong>Busto:</strong> Meça na linha dos mamilos, mantendo a fita paralela ao chão</li>
              <li>• <strong>Cintura:</strong> Meça na parte mais estreita do tronco, geralmente acima do umbigo</li>
              <li>• <strong>Quadril:</strong> Meça na parte mais larga dos quadris</li>
              <li>• <strong>Coxas:</strong> Meça na parte mais larga da coxa, próximo ao quadril</li>
            </ul>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-bold text-emerald-800 mb-4">Dicas Importantes</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Meça sempre no mesmo horário do dia</li>
              <li>• Use uma fita métrica flexível</li>
              <li>• Mantenha a fita firme, mas não apertada</li>
              <li>• Registre as medidas semanalmente para melhor acompanhamento</li>
              <li>• Tire fotos para comparação visual do progresso</li>
            </ul>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}