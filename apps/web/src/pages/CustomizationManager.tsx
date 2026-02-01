import { useState } from 'react';
import { Search, Eye, Edit, Trash2, RotateCcw } from 'lucide-react';

interface Customization {
  id: string;
  pageName: string;
  templateName: string;
  sectionsModified: number;
  lastUpdated: string;
  status: 'active' | 'archived';
  version: number;
}

const mockCustomizations: Customization[] = [
  {
    id: '1',
    pageName: 'SaaS Landing Page',
    templateName: 'Modern SaaS',
    sectionsModified: 4,
    lastUpdated: '2 hours ago',
    status: 'active',
    version: 3,
  },
  {
    id: '2',
    pageName: 'Portfolio v2',
    templateName: 'Creative Portfolio',
    sectionsModified: 6,
    lastUpdated: '1 day ago',
    status: 'active',
    version: 5,
  },
  {
    id: '3',
    pageName: 'Product Page',
    templateName: 'Product Showcase',
    sectionsModified: 3,
    lastUpdated: '3 days ago',
    status: 'archived',
    version: 2,
  },
  {
    id: '4',
    pageName: 'Company Site',
    templateName: 'Business Pro',
    sectionsModified: 5,
    lastUpdated: '1 week ago',
    status: 'active',
    version: 8,
  },
];

export function CustomizationManager() {
  const [customizations] = useState<Customization[]>(mockCustomizations);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');

  const filteredCustomizations = customizations.filter((c) => {
    const matchesSearch =
      c.pageName.toLowerCase().includes(search.toLowerCase()) ||
      c.templateName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Customization Manager</h2>
        <p className="text-gray-600">View and manage all your page customizations</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {(['all', 'active', 'archived'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customizations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Page
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Template
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Sections
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Version
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredCustomizations.map((customization) => (
              <tr key={customization.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <p className="font-medium text-gray-900">{customization.pageName}</p>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {customization.templateName}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {customization.sectionsModified} modified
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  v{customization.version}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {customization.lastUpdated}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      customization.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {customization.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Version History Modal would go here */}
    </div>
  );
}
