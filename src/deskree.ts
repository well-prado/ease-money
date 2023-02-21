import createClient from "@deskree/deskree-js";
import type { ClientOptions } from "@deskree/deskree-js/build/client-options";
import api from "@/api";
import { useCookies } from "@vueuse/integrations/useCookies";

const options: ClientOptions = {
  projectId: import.meta.env.VITE_APP_DESKREE_PROJECT_ID as string,
  axios: api,
  userToken: useCookies().get("access_token"),
};

const deskree = createClient(options);

export { deskree, options };
