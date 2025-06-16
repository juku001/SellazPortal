import { CONFIG } from 'src/config-global';

import { RequestView } from 'src/sections/request/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Requests - ${CONFIG.appName}`}</title>

      <RequestView />
    </>
  );
}
