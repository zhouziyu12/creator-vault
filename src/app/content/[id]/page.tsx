'use client';

import { ContentViewer } from '@/components/content/ContentViewer';

interface ContentPageProps {
  params: {
    id: string;
  };
}

export default function ContentPage({ params }: ContentPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <ContentViewer contentId={params.id} />
      </div>
    </div>
  );
}
