import { redirect } from 'next/navigation';

export default function RegisterPage() {
  // Redirecionar para a página de sign-up do Clerk
  redirect('/sign-up');
}