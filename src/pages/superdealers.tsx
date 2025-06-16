import { CONFIG } from 'src/config-global';

import { SuperdealerView } from 'src/sections/superdealer/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Super dealer - ${CONFIG.appName}`}</title>

      <SuperdealerView />
    </>
  );
}
