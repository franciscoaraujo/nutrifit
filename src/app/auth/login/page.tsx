import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-emerald-800 font-serif">Entrar na sua conta</h2>
            <p className="mt-2 text-sm text-gray-600">
              Ou{" "}
              <Link href="/auth/register" className="font-medium text-emerald-600 hover:text-emerald-500">
                criar uma nova conta
              </Link>
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </MainLayout>
  );
}