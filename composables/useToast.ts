import type { ToastOptions } from '~/types/models';

export function useToast() {
  return {
    success: (message: string, options?: Partial<Omit<ToastOptions, 'message' | 'type'>>) => {
      console.log('Success:', message);
      // Here you would implement actual toast notification
      // using a UI library like Nuxt's built-in or a third-party library
    },
    error: (message: string, options?: Partial<Omit<ToastOptions, 'message' | 'type'>>) => {
      console.error('Error:', message);
      // Here you would implement actual toast notification
      // using a UI library like Nuxt's built-in or a third-party library
    },
    warning: (message: string, options?: Partial<Omit<ToastOptions, 'message' | 'type'>>) => {
      console.warn('Warning:', message);
      // Here you would implement actual toast notification
      // using a UI library like Nuxt's built-in or a third-party library
    },
    info: (message: string, options?: Partial<Omit<ToastOptions, 'message' | 'type'>>) => {
      console.info('Info:', message);
      // Here you would implement actual toast notification
      // using a UI library like Nuxt's built-in or a third-party library
    }
  };
} 