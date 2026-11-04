// The provider SDK owns token storage, rotation, refresh locking, and local sign-out.
import { AuthClient } from '@supabase/auth-js';
export function connect(config) {
  return new AuthClient({
    url:config.url+'/auth/v1',headers:{apikey:config.key},
    storageKey:'sunzi.email.'+new URL(config.url).hostname,
    persistSession:true,autoRefreshToken:true,detectSessionInUrl:false
  });
}
