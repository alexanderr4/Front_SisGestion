import { publicClient, privateClient, xmlClient } from './AxiosClients';

/**
 * Devuelve el cliente adecuado según autenticación y tipo de contenido.
 *
 * @param {Object} options
 * @param {boolean} options.authenticated - Si la solicitud requiere autenticación.
 * @param {'json' | 'xml'} options.type - Tipo de contenido ('json' por defecto).
 * @returns AxiosInstance
 */
export function apiFactory( authenticated = false, type = 'json' ) {
  if (type === 'xml') {
    return xmlClient;
  }

  return authenticated ? privateClient : publicClient;
}