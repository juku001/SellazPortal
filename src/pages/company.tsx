import { CONFIG } from 'src/config-global';

import { CompanyView } from 'src/sections/company/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Companys - ${CONFIG.appName}`}</title>

      <CompanyView />
    </>
  );
}
