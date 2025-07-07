'use client';

import { Image as ImageIcon, Video, Headphones, FileText } from 'lucide-react';

export function SupportedFormats() {
  const formats = [
    {
      type: 'Images',
      icon: ImageIcon,
      formats: ['JPG', 'PNG', 'GIF', 'WebP', 'SVG'],
      maxSize: '10MB',
      color: 'blue'
    },
    {
      type: 'Videos',
      icon: Video,
      formats: ['MP4', 'WebM', 'MOV', 'AVI'],
      maxSize: '100MB',
      color: 'purple'
    },
    {
      type: 'Audio',
      icon: Headphones,
      formats: ['MP3', 'WAV', 'OGG', 'M4A'],
      maxSize: '50MB',
      color: 'green'
    },
    {
      type: 'Documents',
      icon: FileText,
      formats: ['HTML', 'Text'],
      maxSize: '5MB',
      color: 'orange'
    }
  ];

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported File Formats</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formats.map((format) => {
          const Icon = format.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-700 border-blue-200',
            purple: 'bg-purple-100 text-purple-700 border-purple-200',
            green: 'bg-green-100 text-green-700 border-green-200',
            orange: 'bg-orange-100 text-orange-700 border-orange-200'
          };
          
          return (
            <div key={format.type} className={`border rounded-lg p-4 ${colorClasses[format.color]}`}>
              <div className="flex items-center space-x-3 mb-2">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{format.type}</span>
              </div>
              <div className="text-sm space-y-1">
                <p>Formats: {format.formats.join(', ')}</p>
                <p>Max size: {format.maxSize}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          💡 <strong>Pro Tip:</strong> For best quality, use MP4 for videos and JPG/PNG for images. 
          Large files may take longer to upload and load for viewers.
        </p>
      </div>
    </div>
  );
}
