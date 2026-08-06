import { getSession } from './login/actions';
import { redirect } from 'next/navigation';
import DashboardClient from '@/components/DashboardClient';

export default async function HomePage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  return <DashboardClient user={session} />;
}
