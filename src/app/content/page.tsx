'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { ContentList } from '@/components/content/ContentList';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function ContentPage() {
  return (
    <PageLayout 
      title="My Content" 
      description="Manage all your content and track performance"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Content Library</h2>
              <p className="text-gray-600">Create, edit and manage your content</p>
            </div>
            <Link
              href="/content/create"
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Create New</span>
            </Link>
          </div>
          <ContentList showCreatorOnly={true} />
        </div>
      </div>
    </PageLayout>
  );
}
