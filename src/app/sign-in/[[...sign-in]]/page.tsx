import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-800 font-serif mb-2">
            NutriFit
          </h1>
          <p className="text-gray-600">
            Faça login para acessar sua jornada de saúde
          </p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-sm normal-case',
              card: 'shadow-lg',
              headerTitle: 'text-emerald-800',
              headerSubtitle: 'text-gray-600',
              socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50',
              formFieldInput: 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500',
              footerActionLink: 'text-emerald-600 hover:text-emerald-700'
            }
          }}
        />
      </div>
    </div>
  );
}