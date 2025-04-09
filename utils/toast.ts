import { createApp, reactive, h } from 'vue';
import Toast from '../components/Toast.vue';

interface ToastInstance {
  success: (title: string, message?: string, duration?: number) => number;
  error: (title: string, message?: string, duration?: number) => number;
  warning: (title: string, message?: string, duration?: number) => number;
  info: (title: string, message?: string, duration?: number) => number;
  removeToast: (id: number) => void;
  clearToasts: () => void;
}

let toastInstance: ToastInstance | null = null;

function createToast(): ToastInstance {
  if (toastInstance) return toastInstance;

  // Create a div to mount the Toast component
  const containerDiv = document.createElement('div');
  document.body.appendChild(containerDiv);

  // Create Toast component instance
  const app = createApp(Toast);
  const vm = app.mount(containerDiv);

  // Create a reactive proxy to the Toast methods
  toastInstance = {
    success: (title, message, duration) => (vm as any).success(title, message, duration),
    error: (title, message, duration) => (vm as any).error(title, message, duration),
    warning: (title, message, duration) => (vm as any).warning(title, message, duration),
    info: (title, message, duration) => (vm as any).info(title, message, duration),
    removeToast: (id) => (vm as any).removeToast(id),
    clearToasts: () => (vm as any).clearToasts(),
  };

  return toastInstance;
}

export const toast = {
  success(title: string, message?: string, duration?: number) {
    const normalizedTitle = title?.replace(/\n/g, ' ');
    const normalizedMessage = message?.replace(/\n/g, ' ');
    return createToast().success(normalizedTitle, normalizedMessage, duration);
  },
  error(title: string, message?: string, duration?: number) {
    const normalizedTitle = title?.replace(/\n/g, ' ');
    const normalizedMessage = message?.replace(/\n/g, ' ');
    return createToast().error(normalizedTitle, normalizedMessage, duration);
  },
  warning(title: string, message?: string, duration?: number) {
    const normalizedTitle = title?.replace(/\n/g, ' ');
    const normalizedMessage = message?.replace(/\n/g, ' ');
    return createToast().warning(normalizedTitle, normalizedMessage, duration);
  },
  info(title: string, message?: string, duration?: number) {
    const normalizedTitle = title?.replace(/\n/g, ' ');
    const normalizedMessage = message?.replace(/\n/g, ' ');
    return createToast().info(normalizedTitle, normalizedMessage, duration);
  },
  remove(id: number) {
    if (toastInstance) {
      toastInstance.removeToast(id);
    }
  },
  clear() {
    if (toastInstance) {
      toastInstance.clearToasts();
    }
  }
};

export default toast; 