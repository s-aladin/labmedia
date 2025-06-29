import { ref, Ref } from 'vue';

interface ApiOptions {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
}

interface ApiResponse<T> {
    data: Ref<T | null>;
    error: Ref<string | null>;
    loading: Ref<boolean>;
    request: () => Promise<void>;
}

export function useApi<T>(options: ApiOptions): ApiResponse<T> {
    const data = ref<T | null>(null) as Ref<T | null>;
    const error = ref<string | null>(null);
    const loading = ref(false);

    const request = async () => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(options.url, {
                method: options.method || 'GET',
                headers: options.headers || {},
                body: options.body ? JSON.stringify(options.body) : null,
            });

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }

            data.value = await response.json() as T;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Неизвестная ошибка';
        } finally {
            loading.value = false;
        }
    };

    return { data, error, loading, request };
}