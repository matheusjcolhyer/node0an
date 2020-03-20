export const environment = {
    server: { port: process.env.SERVER_PORT || 3001 },
    db: {url: process.env.DB_URL || 'mongodb://localhost/rest-api'}
} 