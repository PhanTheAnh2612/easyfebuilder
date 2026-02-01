import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUsers, useInvites, useInviteUser, useCancelInvite, useUpdateUserRole, useToggleUserActive } from '../hooks/useUsers';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../lib/component-library/primitives';

export default function UserManagement() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isAdmin = user?.role === 'ADMIN' || isSuperAdmin;

  const { data: invites = [] } = useInvites();
  const { data: users = [] } = useUsers();
  const inviteUserMutation = useInviteUser();
  const cancelInviteMutation = useCancelInvite();
  const updateRoleMutation = useUpdateUserRole();
  const toggleActiveMutation = useToggleUserActive();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [inviteUrl, setInviteUrl] = useState('');

  const loading = inviteUserMutation.isPending;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setInviteUrl('');

    try {
      const result = await inviteUserMutation.mutateAsync({ email, role });
      setSuccess(`Invitation sent to ${email}`);
      setInviteUrl(result.invite.setupUrl);
      setEmail('');
      setRole('USER');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Failed to send invite');
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    try {
      await cancelInviteMutation.mutateAsync(inviteId);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Failed to cancel invite');
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await updateRoleMutation.mutateAsync({ userId, role: newRole });
      setSuccess('Role updated successfully');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Failed to update role');
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    try {
      await toggleActiveMutation.mutateAsync({ userId, isActive: !isActive });
      setSuccess(isActive ? 'User deactivated' : 'User activated');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Failed to update user status');
    }
  };

  if (!isAdmin) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Invite users and manage their roles and permissions</p>
      </div>

      {/* Invite Form */}
      <Card>
        <CardHeader>
          <CardTitle>Invite New User</CardTitle>
          <CardDescription>Send an invitation link to add a new user</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-3">
              {success}
              {inviteUrl && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Invitation link:</p>
                  <Input
                    readOnly
                    value={inviteUrl}
                    className="mt-1"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleInvite} className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>

            {isSuperAdmin && (
              <div className="w-40 space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Invite'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Pending Invites */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Invites</CardTitle>
          <CardDescription>Invitations waiting for users to accept</CardDescription>
        </CardHeader>
        <CardContent>
          {invites.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">No pending invites</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="font-medium">{invite.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{invite.role}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(invite.expiresAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelInvite(invite.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* All Users (SUPER_ADMIN only) */}
      {isSuperAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage user roles and account status</CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">No users found</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.email}</TableCell>
                      <TableCell>{u.name || '-'}</TableCell>
                      <TableCell>
                        {u.role === 'SUPER_ADMIN' ? (
                          <Badge variant="default" className="bg-purple-600">
                            {u.role}
                          </Badge>
                        ) : u.id !== user?.id ? (
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                            className="flex h-8 rounded-md border border-input bg-background px-2 py-1 text-sm"
                          >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        ) : (
                          <Badge variant="secondary">{u.role}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={u.isActive ? 'default' : 'destructive'}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {u.role !== 'SUPER_ADMIN' && u.id !== user?.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(u.id, u.isActive)}
                            className={u.isActive ? 'text-destructive hover:text-destructive' : 'text-green-600 hover:text-green-700'}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
