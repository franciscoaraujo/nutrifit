import { SignIn } from '@clerk/nextjs';
import MainLayout from '@/components/layout/MainLayout';

export default function Page() {
  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-800 font-serif">
              Entrar na sua conta
            </h1>
            <p className="text-gray-600 mt-2">
              Acesse sua conta para continuar sua jornada de saúde
            </p>
          </div>
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-sm normal-case',
                card: 'shadow-lg',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden'
              }
            }}
          />
        </div>
      </div>
    </MainLayout>
  );
}