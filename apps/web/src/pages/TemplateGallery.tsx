import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Loader2 } from 'lucide-react';
import { useTemplates } from '../hooks/useTemplates';

const categories = [
  { id: 'all', name: 'All Templates' },
  { id: 'saas', name: 'SaaS' },
  { id: 'portfolio', name: 'Portfolio' },
  { id: 'ecommerce', name: 'E-commerce' },
  { id: 'business', name: 'Business' },
];

export function TemplateGallery() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const category = selectedCategory === 'all' ? undefined : selectedCategory;
  const { data: templates = [], isLoading: loading, error: queryError } = useTemplates(category);
  
  const error = queryError ? 'Failed to load templates' : '';

  const filteredTemplates = templates.filter((template) => {
    return template.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Template Gallery</h2>
        <p className="text-gray-600">Choose a template to start building your landing page</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:w-64"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-lg bg-red-50 p-4 text-center text-red-700">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredTemplates.length === 0 && (
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <p className="text-gray-600">No templates found</p>
        </div>
      )}

      {/* Template Grid */}
      {!loading && !error && filteredTemplates.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={template.thumbnail || 'https://placehold.co/400x300/e5e7eb/9ca3af?text=Template'}
                  alt={template.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Link
                    to={`/builder/${template.id}`}
                    className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                  >
                    Use Template
                  </Link>
                  <button className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  {!template.isPublic && (
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                      Private
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">{template.description || 'No description'}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {template.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
