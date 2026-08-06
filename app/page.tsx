import { getSession } from './login/actions';
import DashboardClient from '@/components/DashboardClient';

export default async function HomePage() {
  const session = await getSession();
  
  // Temporarily bypass login redirect for previewing the dashboard
  const user = session || {
    userId: 'demo-user-123',
    email: 'demo@cybersafe.org',
    name: 'Demo Analyst',
  };

  return <DashboardClient user={user} />;
}
