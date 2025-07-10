import { prisma } from '@/lib/prisma';
import TakvimTable from './TakvimTable';

export default async function AdminTakvimPage() {
  const events = await prisma.event.findMany({ orderBy: { date: 'asc' } });
  return <TakvimTable events={events} />;
} 