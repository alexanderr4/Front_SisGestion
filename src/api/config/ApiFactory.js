// apiFactory.js
import { publicClient, privateClient } from './AxiosClients';

export function apiFactory(authenticated = false) {
  return authenticated ? privateClient : publicClient;
}
