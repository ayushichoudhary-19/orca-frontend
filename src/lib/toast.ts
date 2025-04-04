import { toast as hotToast } from 'react-hot-toast';

type ToastOptions = {
  duration?: number;
};

export const toast = {
  success: (message: string, options?: ToastOptions) =>
    hotToast.success(message, {
      duration: options?.duration ?? 3000,
    }),

  error: (message: string, options?: ToastOptions) =>
    hotToast.error(message, {
      duration: options?.duration ?? 3000,
    }),

  loading: (message: string, options?: ToastOptions) =>
    hotToast.loading(message, {
      duration: options?.duration ?? 10000,
    }),

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: ToastOptions
  ) =>
    hotToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    }, {
      duration: options?.duration ?? 3000,
    }),
};
