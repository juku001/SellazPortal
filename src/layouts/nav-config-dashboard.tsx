import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Super Admin',
    path: '/dashboard/user', 
    icon: icon('users-solid'),
  },
  {
    title: 'Company',
    path: '/dashboard/company', 
    icon: icon('house-solid'),
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ),
  },
  {
    title: 'Request',
    path: '/dashboard/request',
    icon: icon('file-solid'),
  },
  /*{
    title: 'Sign in',
    path: '/',
    icon: icon('ic-lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic-disabled'),
  },*/
];
