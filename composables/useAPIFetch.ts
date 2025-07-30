import type { UseFetchOptions } from 'nuxt/app'
import { defu } from 'defu'
import { notify } from "notiwind";

export function useAPIFetch<T> (url: string | (() => string), options: UseFetchOptions<T> = {}) {
  const config = useRuntimeConfig()

  const defaults: UseFetchOptions<T> = {
    headers: {
        Authorization: config.public.apiKey,
    },
    timeout: 60000 * 60,
    cache: 'default',  
    onResponse: ({response, request, options}) => {
      if (response._data.MTY !== 'SUCCESS') {
        if (request === '/api/IS_GNR_PAGELOADER_GET') {
          const payload = JSON.parse(options.body as string)
          notify({
            group: 'error',
            title: 'Error',
            text: response._data?.MSG + ' for ' + payload.UIUX_CODE,
          }, 4000)
        } else {
          notify({
            group: 'error',
            title: 'Error',
            text: response._data?.MSG,
          }, 4000)
        }
      }
    }
  }
  const params = defu(options, defaults)
  return useFetch(`/api${url}`, params)
}
