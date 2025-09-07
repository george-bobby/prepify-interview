import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to dashboard as the new default landing page
  redirect('/dashboard');
}
