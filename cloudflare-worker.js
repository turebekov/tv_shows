addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Если запрос к API, проксируем на TVMaze
  if (url.pathname.startsWith('/api/')) {
    const apiUrl = url.pathname.replace('/api', 'https://api.tvmaze.com')
    const apiRequest = new Request(apiUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    })
    
    try {
      const response = await fetch(apiRequest)
      const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...response.headers,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      })
      return newResponse
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Proxy error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
  
  // Для всех остальных запросов возвращаем index.html
  return new Response('Not found', { status: 404 })
}
