'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import MainLayout from '@/components/layout/MainLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faRuler, faCalendarAlt, faSave, faPlus, faCamera, faImage, faTimes, faTrash, faDownload } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { MedidaCorporal, MedidaFormData, DashboardStats, FotoProgresso } from '@/types';
import { dashboardService } from '@/services';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { showError, showSuccess, showWarning } = useToast();

  // Verificar autenticação
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login?redirect=/dashboard');
    }
  }, [isLoading, user, router]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Não renderizar nada se não estiver autenticado
  if (!user) {
    return null;
  }
  
  const [medidas, setMedidas] = useState<MedidaCorporal[]>([]);
  const [novaMedida, setNovaMedida] = useState<MedidaFormData>({
    data: new Date().toISOString().split('T')[0],
    bracos: '',
    busto: '',
    cintura: '',
    quadril: '',
    coxas: '',
    observacoes: ''
  });
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [fotoCapturada, setFotoCapturada] = useState<string | null>(null);
  const [fotosProgresso, setFotosProgresso] = useState<FotoProgresso[]>([]);
  const [mostrarHistoricoFotos, setMostrarHistoricoFotos] = useState(false);
  const [cameraAtiva, setCameraAtiva] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Carregar dados do dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Em uma aplicação real, o userId viria do contexto de autenticação
        // Por enquanto, não carregamos dados sem autenticação
        
        const [medidasResponse, statsResponse, fotosResponse] = await Promise.all([
          dashboardService.getMedidas(),
          dashboardService.getDashboardStats(),
          dashboardService.getFotosProgresso()
        ]);
        
        if (medidasResponse.success && medidasResponse.data) {
          setMedidas(medidasResponse.data);
        }
        
        if (statsResponse.success && statsResponse.data) {
          setDashboardStats(statsResponse.data);
        }
        
        if (fotosResponse.success && fotosResponse.data) {
          setFotosProgresso(fotosResponse.data);
        }
      } catch (err) {
        setError('Erro ao carregar dados do dashboard');
        console.error('Erro ao carregar dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const validateField = (campo: keyof MedidaFormData, valor: string): string => {
    if (campo === 'data') {
      if (!valor) {
        return 'Data é obrigatória';
      }
      return '';
    }
    
    if (['bracos', 'busto', 'cintura', 'quadril', 'coxas'].includes(campo)) {
      if (!valor) {
        return `${campo.charAt(0).toUpperCase() + campo.slice(1)} é obrigatório`;
      }
      
      const numericValue = parseFloat(valor);
      if (isNaN(numericValue)) {
        return `${campo.charAt(0).toUpperCase() + campo.slice(1)} deve ser um número válido`;
      }
      
      if (numericValue <= 0) {
        return `${campo.charAt(0).toUpperCase() + campo.slice(1)} deve ser maior que zero`;
      }
      
      if (numericValue > 200) {
        return `${campo.charAt(0).toUpperCase() + campo.slice(1)} deve ser menor que 200 cm`;
      }
    }
    
    return '';
  };

  const handleInputChange = (campo: keyof MedidaFormData, valor: string) => {
    setNovaMedida(prev => ({
      ...prev,
      [campo]: valor
    }));
    
    // Validação em tempo real
    const error = validateField(campo, valor);
    setValidationErrors(prev => ({
      ...prev,
      [campo]: error
    }));
  };

  const salvarMedida = async () => {
    // Validar todos os campos
    const errors: {[key: string]: string} = {};
    const campos: (keyof MedidaFormData)[] = ['data', 'bracos', 'busto', 'cintura', 'quadril', 'coxas'];
    
    campos.forEach(campo => {
      const error = validateField(campo, novaMedida[campo] || '');
      if (error) {
        errors[campo] = error;
      }
    });
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      showError('Por favor, corrija os erros nos campos destacados', 'Erros de validação');
      return;
    }

    try {
      const response = await dashboardService.createMedida(novaMedida);
      
      if (response.success && response.data) {
        setMedidas(prev => [response.data!, ...prev]);
        setNovaMedida({
          data: new Date().toISOString().split('T')[0],
          bracos: '',
          busto: '',
          cintura: '',
          quadril: '',
          coxas: '',
          observacoes: ''
        });
        setValidationErrors({});
        setMostrarFormulario(false);
        showSuccess('Medida salva com sucesso!', 'Sucesso');
        
        // Se há foto capturada, fazer upload
        if (fotoCapturada) {
          await uploadFotoProgresso(response.data.id);
        }
      } else {
        showError(response.error || 'Erro desconhecido', 'Erro ao salvar medida');
      }
    } catch (error) {
      console.error('Erro ao salvar medida:', error);
      showError('Erro interno do sistema', 'Erro ao salvar medida');
    }
  };

  const uploadFotoProgresso = async (medidaId?: string) => {
    if (!fotoCapturada) return;
    
    try {
      // Converter base64 para File
      const response = await fetch(fotoCapturada);
      const blob = await response.blob();
      const file = new File([blob], 'foto-progresso.jpg', { type: 'image/jpeg' });
      
      const uploadResponse = await dashboardService.uploadFotoProgresso(file, medidaId || '', 'frente');
      
      if (uploadResponse.success && uploadResponse.data) {
        setFotosProgresso(prev => [uploadResponse.data!, ...prev]);
        setFotoCapturada(null);
        showSuccess('Foto de progresso salva com sucesso!', 'Sucesso');
      } else {
        showError(uploadResponse.error || 'Erro desconhecido', 'Erro ao fazer upload da foto');
      }
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      showError('Erro interno do sistema', 'Erro ao fazer upload da foto');
    }
  };

  const deletarMedida = async (medidaId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta medida?')) return;
    
    try {
      const response = await dashboardService.deleteMedida(medidaId);
      
      if (response.success) {
        setMedidas(prev => prev.filter(m => m.id !== medidaId));
        showSuccess('Medida deletada com sucesso!', 'Sucesso');
      } else {
        showError(response.error || 'Erro desconhecido', 'Erro ao deletar medida');
      }
    } catch (error) {
      console.error('Erro ao deletar medida:', error);
      showError('Erro interno do sistema', 'Erro ao deletar medida');
    }
  };

  const exportarDados = () => {
    const csvContent = dashboardService.exportMedidasCSV(medidas);
    const filename = `medidas-corporais-${new Date().toISOString().split('T')[0]}.csv`;
    dashboardService.downloadCSV(csvContent, filename);
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
      showError('Não foi possível acessar a câmera. Verifique as permissões.', 'Erro de câmera');
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
        const dataURL = canvas.toDataURL('image/png');
        setFotoCapturada(dataURL);
        pararCamera();
      }
    }
  };

  const removerFoto = () => {
    setFotoCapturada(null);
  };



  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando dados do dashboard...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-red-600 mb-2">Erro ao carregar dados</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button 
                variant="primary" 
                onClick={() => window.location.reload()}
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

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
            <Button 
              variant="outline" 
              size="md"
              onClick={exportarDados}
              disabled={medidas.length === 0}
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Exportar
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
                  className={validationErrors.data ? 'border-red-500 focus:border-red-500' : ''}
                />
                {validationErrors.data && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.data}</p>
                )}
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
                  className={validationErrors.bracos ? 'border-red-500 focus:border-red-500' : ''}
                />
                {validationErrors.bracos && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.bracos}</p>
                )}
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
                  className={validationErrors.busto ? 'border-red-500 focus:border-red-500' : ''}
                />
                {validationErrors.busto && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.busto}</p>
                )}
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
                  className={validationErrors.cintura ? 'border-red-500 focus:border-red-500' : ''}
                />
                {validationErrors.cintura && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.cintura}</p>
                )}
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
                  className={validationErrors.quadril ? 'border-red-500 focus:border-red-500' : ''}
                />
                {validationErrors.quadril && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.quadril}</p>
                )}
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
                  className={validationErrors.coxas ? 'border-red-500 focus:border-red-500' : ''}
                />
                {validationErrors.coxas && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.coxas}</p>
                )}
              </div>
            </div>
            
            {/* Seção de Foto */}
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faCamera} className="text-emerald-600" />
                Foto de Progresso (Opcional)
              </h3>
              
              {!cameraAtiva && !fotoCapturada && (
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="md"
                    onClick={iniciarCamera}
                  >
                    <FontAwesomeIcon icon={faCamera} className="mr-2" />
                    Tirar Foto
                  </Button>
                </div>
              )}
              
              {cameraAtiva && (
                <div className="space-y-4">
                  <div className="relative max-w-md">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-auto rounded-lg border-2 border-emerald-200"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="primary" 
                      size="md"
                      onClick={tirarFoto}
                    >
                      Capturar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="md"
                      onClick={pararCamera}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
              
              {fotoCapturada && (
                <div className="space-y-4">
                  <div className="relative max-w-md">
                    <Image 
                      src={fotoCapturada} 
                      alt="Foto capturada" 
                      width={400}
                      height={300}
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
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setMostrarFormulario(false);
                  setFotoCapturada(null);
                  setValidationErrors({});
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
                      <Image 
                        src={medida.foto || '/placeholder-image.jpg'} 
                        alt={`Foto de ${new Date(medida.data).toLocaleDateString('pt-BR')}`}
                        fill
                        className="object-cover"
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
              <p className="text-gray-400 mt-2">Clique em &quot;Nova Medição&quot; para começar a acompanhar seu progresso</p>
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
                    <th className="px-4 py-3 text-center text-sm font-medium text-emerald-800">Ações</th>
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
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deletarMedida(medida.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
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