declare module '@mateoaranda/jikanjs' {
  /**
   * Raw API call with URL parts and parameters
   * @param urlParts Array of URL parts to compose the endpoint
   * @param params Parameters or function that returns parameters
   * @param mal Whether to use MAL API instead of Jikan
   */
  function raw(
    urlParts: (string | number)[],
    params?: object | (() => object),
    mal?: boolean
  ): Promise<any>;

  /**
   * Load anime details
   * @param id Anime ID
   * @param request Request type
   * @param parameters Additional parameters
   */
  function loadAnime(
    id: number,
    request?: string,
    parameters?: any
  ): Promise<any>;

  /**
   * Load seasonal anime
   * @param year Year
   * @param season Season name
   * @param page Page number
   */
  function loadSeason(
    year: number, 
    season: string, 
    page?: number
  ): Promise<any>;

  /**
   * Load current season anime
   * @param page Page number
   */
  function loadCurrentSeason(page?: number): Promise<any>;

  /**
   * Settings object for configuring the client
   */
  const settings: {
    setBaseURL: (url: string) => void;
  };

  export {
    raw,
    loadAnime,
    loadSeason,
    loadCurrentSeason,
    settings
  };

  export default {
    raw,
    loadAnime,
    loadSeason,
    loadCurrentSeason,
    settings
  };
} 