import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, TrendingUp, Eye, Loader2, Trash2, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePages, useDeletePage, usePublishPage } from '../hooks/usePages';
import { formatDistanceToNow } from 'date-fns';

export function Dashboard() {
  const { user } = useAuth();
  const { data: pages = [], isLoading: loading, error: queryError } = usePages();
  const deletePageMutation = useDeletePage();
  const publishPageMutation = usePublishPage();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const canCreatePages = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const canDeletePages = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const canPublishPages = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const error = queryError ? 'Failed to load pages' : '';

  async function handleDelete(pageId: string) {
    if (!confirm('Are you sure you want to delete this page?')) return;
    
    setDeletingId(pageId);
    try {
      await deletePageMutation.mutateAsync(pageId);
    } catch (err) {
      console.error('Failed to delete page:', err);
      alert('Failed to delete page');
    } finally {
      setDeletingId(null);
    }
  }

  async function handlePublish(pageId: string) {
    setPublishingId(pageId);
    try {
      await publishPageMutation.mutateAsync(pageId);
    } catch (err) {
      console.error('Failed to publish page:', err);
      alert('Failed to publish page');
    } finally {
      setPublishingId(null);
    }
  }

  const publishedCount = pages.filter(p => p.isPublished).length;
  const draftCount = pages.filter(p => !p.isPublished).length;

  const stats = [
    { name: 'Total Pages', value: pages.length.toString(), icon: FileText, change: `${draftCount} drafts` },
    { name: 'Published', value: publishedCount.toString(), icon: TrendingUp, change: pages.length > 0 ? `${Math.round((publishedCount / pages.length) * 100)}% of total` : '0% of total' },
    { name: 'Draft', value: draftCount.toString(), icon: Eye, change: 'Unpublished pages' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Welcome back, {user?.name || user?.email}! Here's what's happening with your pages.</p>
        </div>
        {canCreatePages && (
          <Link
            to="/templates"
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Create New Page
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary-50 p-3">
                <stat.icon className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pages List */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Pages</h3>
        </div>
        
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        )}

        {error && !loading && (
          <div className="p-6 text-center text-red-600">{error}</div>
        )}

        {!loading && !error && pages.length === 0 && (
          <div className="p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-gray-600">No pages yet</p>
            {canCreatePages && (
              <Link
                to="/templates"
                className="mt-4 inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
              >
                <Plus className="h-4 w-4" />
                Create your first page
              </Link>
            )}
          </div>
        )}

        {!loading && !error && pages.length > 0 && (
          <div className="divide-y divide-gray-200">
            {pages.map((page) => (
              <div key={page.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium text-gray-900">{page.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>/{page.slug}</span>
                    {page.isPublished && (
                      <a
                        href={`/p/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
                        title="View public page"
                      >
                        <Globe className="h-3 w-3" />
                        <span className="text-xs">View live</span>
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      page.isPublished
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {page.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true })}
                  </span>
                  <div className="flex items-center gap-2">
                    {page.isPublished && (
                      <Link
                        to={`/preview/${page.id}`}
                        target="_blank"
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    )}
                    {!page.isPublished && canPublishPages && (
                      <button
                        onClick={() => handlePublish(page.id)}
                        disabled={publishingId === page.id}
                        className="text-sm font-medium text-green-600 hover:text-green-700 disabled:opacity-50"
                        title="Publish"
                      >
                        {publishingId === page.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Publish'
                        )}
                      </button>
                    )}
                    <Link
                      to={`/builder/${page.id}?edit=true`}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      Edit
                    </Link>
                    {canDeletePages && (
                      <button
                        onClick={() => handleDelete(page.id)}
                        disabled={deletingId === page.id}
                        className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === page.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
