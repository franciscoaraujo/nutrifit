import { redirect } from 'next/navigation';

export default function LoginPage() {
  // Redirecionar para a página de sign-in do Clerk
  redirect('/sign-in');
}