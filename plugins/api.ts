import { useApi } from '~/composables/useApi';

type ApiType = ReturnType<typeof useApi>;

declare module '#app' {
  interface NuxtApp {
    $api: ApiType
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $api: ApiType
  }
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      api: useApi()
    }
  };
}); 