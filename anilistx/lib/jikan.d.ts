declare module '@mateoaranda/jikanjs' {
  export interface JikanResponse<T> {
    pagination: {
      last_visible_page: number;
      has_next_page: boolean;
      current_page: number;
      items: {
        count: number;
        total: number;
        per_page: number;
      };
    };
    data: T;
  }

  interface Jikanjs {
    raw(urlParts: (string | number)[], queryParameter?: Record<string, unknown>, mal?: boolean): Promise<unknown>;
    settings: {
      setBaseURL(url: string): void;
    };
  }

  const jikanjs: Jikanjs;
  
  export default jikanjs;
} 