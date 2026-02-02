import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Loader2, Plus, Pencil } from 'lucide-react';
import { useTemplates } from '../hooks/useTemplates';
import { useAuth } from '../contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
} from '../lib/component-library/primitives';

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
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  
  const category = selectedCategory === 'all' ? undefined : selectedCategory;
  const { data: templates = [], isLoading: loading, error: queryError } = useTemplates(category);
  
  const error = queryError ? 'Failed to load templates' : '';

  const filteredTemplates = templates.filter((template) => {
    return template.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Template Gallery</h2>
          <p className="text-muted-foreground">Choose a template to start building your landing page</p>
        </div>
        {isSuperAdmin && (
          <Button asChild>
            <Link to="/template-builder/new">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              variant={selectedCategory === cat.id ? 'default' : 'secondary'}
              size="sm"
            >
              {cat.name}
            </Button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="border-destructive">
          <CardContent className="pt-6 text-center text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No templates found</p>
          </CardContent>
        </Card>
      )}

      {/* Template Grid */}
      {!loading && !error && filteredTemplates.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="group overflow-hidden transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={template.thumbnail || 'https://placehold.co/400x300/e5e7eb/9ca3af?text=Template'}
                  alt={template.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button asChild>
                    <Link to={`/builder/${template.id}`}>
                      Use Template
                    </Link>
                  </Button>
                  {isSuperAdmin && (
                    <Button variant="secondary" size="icon" asChild title="Edit Template">
                      <Link to={`/template-builder/${template.id}?edit=true`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button variant="secondary" size="icon" title="Preview">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  {!template.isPublic && (
                    <Badge variant="outline">Private</Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-2">
                  {template.description || 'No description'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Badge variant="secondary">{template.category}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
