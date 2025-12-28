import DanismanlikTable from './DanismanlikTable';

export default async function AdminDanismanlikPage() {
  const res = await fetch('http://localhost:3004/api/forms', { cache: 'no-store' });
  const forms = await res.json();
  return <DanismanlikTable forms={forms} />;
} 