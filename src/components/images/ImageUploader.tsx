'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

interface ImageUploaderProps {
  parentId: number;
  parentType: 'camper' | 'station' | 'addon';
}

export default function ImageUploader({ parentId, parentType }: ImageUploaderProps) {
  const t = useTranslations('import');
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [altText, setAltText] = useState('');
  const [copyright, setCopyright] = useState('');
  const [category, setCategory] = useState('');
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setWidth(img.width);
          setHeight(img.height);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setFeedback({ type: 'error', message: 'Please select a file to upload.' });
      return;
    }

    setLoading(true);
    setFeedback({ type: '', message: '' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('parentId', parentId.toString());
    formData.append('parentType', parentType);
    formData.append('description', description);
    formData.append('author', author);
    formData.append('altText', altText);
    formData.append('copyright', copyright);
    formData.append('category', category);
    if (width !== null) formData.append('width', width.toString());
    if (height !== null) formData.append('height', height.toString());

    try {
      const res = await fetch(`/${locale}/api/provider/image`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setFeedback({ type: 'success', message: 'Image uploaded successfully!' });
        // Clear form
        setFile(null);
        setDescription('');
        setAuthor('');
        setAltText('');
        setCopyright('');
        setCategory('');
      } else {
        const data = await res.json();
        setFeedback({ type: 'error', message: data.error || 'Failed to upload image.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  const categories = ['exterior', 'mood', 'kitchen', 'sleeping_area', 'bath', 'driver_cabin', 'seating_dining_area'];

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200 mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload Image or Video</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">File</label>
          <input type="file" id="file" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
        </div>
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
          <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
        </div>
        <div>
          <label htmlFor="altText" className="block text-sm font-medium text-gray-700">Alt Text</label>
          <input type="text" id="altText" value={altText} onChange={(e) => setAltText(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
        </div>
        <div>
          <label htmlFor="copyright" className="block text-sm font-medium text-gray-700">Copyright</label>
          <input type="text" id="copyright" value={copyright} onChange={(e) => setCopyright(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="">Select a category</option>
            {categories.map(cat => <option key={cat} value={cat}>{t(cat)}</option>)}
          </select>
        </div>
        <div>
          <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        {feedback.message && (
          <div className={`text-sm text-center ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {feedback.message}
          </div>
        )}
      </form>
    </div>
  );
}
