// Teste direto da API externa
const testApiCall = async () => {
  const testData = {
    nome: "Teste Usuario",
    email: "teste@email.com",
    userId: "test-123",
    sexo: "masculino",
    idade: 30,
    altura: 175,
    peso: 70,
    objetivo: "perder_peso",
    nivelAtividade: "moderado",
    timestamp: new Date().toISOString(),
    source: "nutri-fit-app-test"
  };

  console.log('Enviando dados para API externa:', testData);
  console.log('URL da API:', 'http://localhost:8080/nutrifit/api/v1/clientes/cadastrar');

  try {
    const response = await fetch('http://localhost:8080/nutrifit/api/v1/clientes/cadastrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': 'test-user-123',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log('Status da resposta:', response.status);
    console.log('Headers da resposta:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      // Tentar parsear como JSON, se falhar, usar como texto
      let responseData;
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);
      
      // Ler o corpo da resposta apenas uma vez
      const responseText = await response.text();
      
      try {
        responseData = JSON.parse(responseText);
        console.log('✅ Sucesso! Resposta da API (JSON):', responseData);
      } catch (jsonError) {
        console.log('✅ Sucesso! Resposta da API (Texto):', responseText);
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Erro na API:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
    }
  } catch (error) {
    console.log('❌ Erro de conexão:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
  }
};

// Executar o teste
testApiCall();