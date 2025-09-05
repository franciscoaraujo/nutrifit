import { SignUp } from '@clerk/nextjs';
import MainLayout from '@/components/layout/MainLayout';

export default function Page() {
  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-800 font-serif">
              Criar nova conta
            </h1>
            <p className="text-gray-600 mt-2">
              Junte-se a nós e comece sua jornada de saúde hoje
            </p>
          </div>
          <SignUp 
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