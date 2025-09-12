// Простой CORS прокси для GitHub Pages
// Используем публичный CORS прокси

const CORS_PROXY_URLS = [
  'https://cors-anywhere.herokuapp.com/',
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://thingproxy.freeboard.io/fetch/'
];

class CORSProxy {
  constructor() {
    this.currentProxyIndex = 0;
  }

  async fetchWithProxy(url) {
    const proxyUrl = CORS_PROXY_URLS[this.currentProxyIndex] + encodeURIComponent(url);
    
    try {
      const response = await fetch(proxyUrl);
      if (response.ok) {
        return response;
      } else {
        throw new Error(`Proxy ${this.currentProxyIndex} failed`);
      }
    } catch (error) {
      console.warn(`Proxy ${this.currentProxyIndex} failed:`, error);
      this.currentProxyIndex = (this.currentProxyIndex + 1) % CORS_PROXY_URLS.length;
      
      if (this.currentProxyIndex === 0) {
        throw new Error('All proxies failed');
      }
      
      return this.fetchWithProxy(url);
    }
  }

  async searchShows(query) {
    const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`;
    return this.fetchWithProxy(url);
  }

  async getCast(showId) {
    const url = `https://api.tvmaze.com/shows/${showId}/cast`;
    return this.fetchWithProxy(url);
  }
}

// Экспортируем для использования
window.CORSProxy = CORSProxy;
