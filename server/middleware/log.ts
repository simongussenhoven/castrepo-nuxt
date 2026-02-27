export default defineEventHandler((event) => {
    const method = event.method
    const path = getRequestURL(event).pathname
    const query = getQuery(event)
    const queryString = Object.keys(query).length
        ? ` | query: ${JSON.stringify(query)}`
        : ''

    console.log(`[API] ${method} ${path}${queryString}`)
})
