import { CONFIG } from 'src/config-global';

import { UserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Companies - ${CONFIG.appName}`}</title>

      <UserView />
    </>
  );
}
