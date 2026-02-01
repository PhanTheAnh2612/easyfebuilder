import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, TrendingUp, Eye, Loader2, Trash2, Globe, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePages, useDeletePage, usePublishPage } from '../hooks/usePages';
import { formatDistanceToNow } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../lib/component-library/primitives';

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
    { 
      name: 'Total Pages', 
      value: pages.length.toString(), 
      icon: FileText, 
      description: `${draftCount} drafts`,
      color: 'text-blue-600 bg-blue-50'
    },
    { 
      name: 'Published', 
      value: publishedCount.toString(), 
      icon: TrendingUp, 
      description: pages.length > 0 ? `${Math.round((publishedCount / pages.length) * 100)}% of total` : '0% of total',
      color: 'text-green-600 bg-green-50'
    },
    { 
      name: 'Drafts', 
      value: draftCount.toString(), 
      icon: Eye, 
      description: 'Unpublished pages',
      color: 'text-yellow-600 bg-yellow-50'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || user?.email}! Here's an overview of your pages.
          </p>
        </div>
        {canCreatePages && (
          <Button asChild>
            <Link to="/templates" className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Page
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Pages</CardTitle>
          <CardDescription>
            Manage and organize all your landing pages
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && !loading && (
            <div className="py-8 text-center">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {!loading && !error && pages.length === 0 && (
            <div className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No pages yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get started by creating your first landing page.
              </p>
              {canCreatePages && (
                <Button asChild className="mt-4">
                  <Link to="/templates" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create your first page
                  </Link>
                </Button>
              )}
            </div>
          )}

          {!loading && !error && pages.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
                          /{page.slug}
                        </code>
                        {page.isPublished && (
                          <a
                            href={`/p/${page.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <Globe className="h-3 w-3" />
                            View
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={page.isPublished ? 'default' : 'secondary'}>
                        {page.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/builder/${page.id}?edit=true`}>
                              Edit page
                            </Link>
                          </DropdownMenuItem>
                          {page.isPublished && (
                            <DropdownMenuItem asChild>
                              <Link to={`/preview/${page.id}`} target="_blank">
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {page.isPublished && (
                            <DropdownMenuItem asChild>
                              <a href={`/p/${page.slug}`} target="_blank" rel="noopener noreferrer">
                                <Globe className="mr-2 h-4 w-4" />
                                View live
                              </a>
                            </DropdownMenuItem>
                          )}
                          {!page.isPublished && canPublishPages && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handlePublish(page.id)}
                                disabled={publishingId === page.id}
                              >
                                {publishingId === page.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <TrendingUp className="mr-2 h-4 w-4" />
                                )}
                                Publish
                              </DropdownMenuItem>
                            </>
                          )}
                          {canDeletePages && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(page.id)}
                                disabled={deletingId === page.id}
                                className="text-destructive focus:text-destructive"
                              >
                                {deletingId === page.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="mr-2 h-4 w-4" />
                                )}
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
