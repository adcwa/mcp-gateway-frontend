export interface Toast {
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

export function useToast(): Toast {
  return {
    success: (message: string, title?: string) => {
      console.log(`%c SUCCESS ${title ? `[${title}]` : ''}: ${message}`, 'color: green; font-weight: bold');
      // Here you would implement actual toast notifications
      // For example using a UI library like vue-toastification
    },
    error: (message: string, title?: string) => {
      console.error(`%c ERROR ${title ? `[${title}]` : ''}: ${message}`, 'color: red; font-weight: bold');
      // Here you would implement actual toast notifications
    },
    info: (message: string, title?: string) => {
      console.info(`%c INFO ${title ? `[${title}]` : ''}: ${message}`, 'color: blue; font-weight: bold');
      // Here you would implement actual toast notifications
    },
    warning: (message: string, title?: string) => {
      console.warn(`%c WARNING ${title ? `[${title}]` : ''}: ${message}`, 'color: orange; font-weight: bold');
      // Here you would implement actual toast notifications
    }
  };
} 