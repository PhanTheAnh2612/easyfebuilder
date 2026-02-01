import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Palette, Settings, Layers, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Separator } from '../../lib/component-library/primitives';
import { cn } from '../../lib/component-library/utils/cn';

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
    <aside className="w-64 border-r bg-card">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Layers className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold">ezfebuilder</span>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
        
        {visibleAdminNav.length > 0 && (
          <>
            <Separator className="my-2" />
            <span className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Admin
            </span>
            {visibleAdminNav.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )
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
