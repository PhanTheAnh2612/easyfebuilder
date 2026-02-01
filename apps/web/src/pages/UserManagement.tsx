import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUsers, useInvites, useInviteUser, useCancelInvite, useUpdateUserRole, useToggleUserActive } from '../hooks/useUsers';

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
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>

      {/* Invite Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Invite New User</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
            {inviteUrl && (
              <div className="mt-2">
                <p className="text-sm font-medium">Invitation link:</p>
                <input
                  type="text"
                  readOnly
                  value={inviteUrl}
                  className="mt-1 w-full px-3 py-2 border rounded-lg bg-white text-sm"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleInvite} className="flex gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {isSuperAdmin && (
            <div className="w-40">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Invite'}
          </button>
        </form>
      </div>

      {/* Pending Invites */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Pending Invites</h2>
        
        {invites.length === 0 ? (
          <p className="text-gray-500">No pending invites</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2">Email</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Expires</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invites.map((invite) => (
                <tr key={invite.id} className="border-b last:border-b-0">
                  <td className="py-3">{invite.email}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                      {invite.role}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">
                    {new Date(invite.expiresAt).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleCancelInvite(invite.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* All Users (SUPER_ADMIN only) */}
      {isSuperAdmin && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">All Users</h2>
          
          {users.length === 0 ? (
            <p className="text-gray-500">No users found</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b last:border-b-0">
                    <td className="py-3">{u.email}</td>
                    <td className="py-3">{u.name || '-'}</td>
                    <td className="py-3">
                      {u.role === 'SUPER_ADMIN' ? (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded">
                          {u.role}
                        </span>
                      ) : u.id !== user?.id ? (
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                          className="px-2 py-1 border rounded text-sm"
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      ) : (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                          {u.role}
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-sm rounded ${
                        u.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3">
                      {u.role !== 'SUPER_ADMIN' && u.id !== user?.id && (
                        <button
                          onClick={() => handleToggleActive(u.id, u.isActive)}
                          className={`text-sm ${
                            u.isActive 
                              ? 'text-red-600 hover:text-red-800' 
                              : 'text-green-600 hover:text-green-800'
                          }`}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
