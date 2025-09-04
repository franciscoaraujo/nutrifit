import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Em produção, aqui seria implementada a lógica de autenticação real
    // Por enquanto, retornar erro de não autenticado
    return NextResponse.json(
      { error: 'Usuário não autenticado' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Erro ao buscar usuário atual:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}