import { StorageSerializers } from '@vueuse/core';
import type { UseFetchOptions } from "nuxt/app";
import { useSessionStorage } from '@vueuse/core'

export default async <T>(url: string, options: UseFetchOptions<T> = {}, useCache: boolean) => {
  // Use sessionStorage to cache data
  const cached = useSessionStorage<T>(useKebabCase(url + '/' + JSON.stringify(options.body)), null, {
    serializer: StorageSerializers.object,
  });

  if (!useCache) {
    const { data } = await useAPIFetch<T>(url, options);

    // Update the cache
    cached.value = data.value as T;

    return cached.value;
  }

  if (!cached.value) {
    const { data } = await useAPIFetch<T>(url, options);

    // Update the cache
    cached.value = data.value as T;
  }

  return cached.value;
};
