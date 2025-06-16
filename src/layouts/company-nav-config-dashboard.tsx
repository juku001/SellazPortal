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

// Dynamically generates nav items based on companyId
export const getCompanyNav = (companyId: string): NavItem[] => [
  {
    title: '← Back to Companies',
    path: '/dashboard/company',
    icon: icon('ic-back'),
  },
  {
    title: 'Company Dashboard',
    path: `/company/${companyId}`,
    icon: icon('ic-analytics'),
  },
  {
    title: 'Super Dealer',
    path: `/company/${companyId}/superdealers`,
    icon: icon('ic-user'),
  },
  {
    title: 'Biker',
    path: `/company/${companyId}/bikers`,
    icon: icon('ic-office-building'),
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ),
  },
  {
    title: 'Products',
    path: `/company/${companyId}/products`,
    icon: icon('ic-user'),
  },
  {
    title: 'Report',
    path: `/company/${companyId}/report`,
    icon: icon('ic-request'),
  },
];
