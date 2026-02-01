import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Palette, Settings, Layers, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Templates', href: '/templates', icon: Palette },
  { name: 'Customizations', href: '/customizations', icon: Settings },
];

const adminNavigation = [
  { name: 'User Management', href: '/users', icon: Users, roles: ['ADMIN', 'SUPER_ADMIN'] },
];

export function Sidebar() {
  const { user } = useAuth();
  
  // Filter admin navigation based on user role
  const visibleAdminNav = adminNavigation.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <aside className="w-64 border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
        <Layers className="h-8 w-8 text-primary-600" />
        <span className="text-xl font-bold text-gray-900">ezfebuilder</span>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
        
        {visibleAdminNav.length > 0 && (
          <>
            <div className="my-2 border-t border-gray-200" />
            <span className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase">Admin</span>
            {visibleAdminNav.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}
