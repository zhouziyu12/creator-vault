'use client';

import { CreateContentForm } from '@/components/content/CreateContentForm';
import { useRouter } from 'next/navigation';

export default function CreateContentPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <CreateContentForm 
          onSuccess={() => {
            router.push('/dashboard');
          }}
        />
      </div>
    </div>
  );
}
