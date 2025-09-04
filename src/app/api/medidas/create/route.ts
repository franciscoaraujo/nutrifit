import { NextRequest, NextResponse } from 'next/server';
import { MedidaCorporal, MedidaFormData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: MedidaFormData = await request.json();

    // Validação básica
    if (!body.data || !body.bracos || !body.busto || !body.cintura || !body.quadril || !body.coxas) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      );
    }

    // Criar nova medida
    const novaMedida: MedidaCorporal = {
      id: Math.random().toString(36).substr(2, 9),
      userId: '', // Em uma aplicação real, viria do token de autenticação
      data: body.data,
      bracos: parseFloat(body.bracos),
      busto: parseFloat(body.busto),
      cintura: parseFloat(body.cintura),
      quadril: parseFloat(body.quadril),
      coxas: parseFloat(body.coxas),
      observacoes: body.observacoes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Simular salvamento no banco de dados
    // Em uma aplicação real, aqui seria feita a inserção no banco
    
    return NextResponse.json({
      success: true,
      data: novaMedida,
      message: 'Medida criada com sucesso'
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar medida:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}