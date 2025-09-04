import { NextRequest, NextResponse } from 'next/server';
import { DashboardStats } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      );
    }

    // Em produção, aqui seria implementada a lógica de busca no banco de dados
    const emptyStats = {
      totalMedidas: 0,
      totalFotos: 0,
      diasAcompanhamento: 0,
      ultimaMedida: null,
      proximaMetaMedida: null
    };
    
    return NextResponse.json({
      success: true,
      data: emptyStats
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}