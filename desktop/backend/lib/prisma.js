require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

// Prevent multiple instances during hot-reload in development
const globalForPrisma = global;

let prisma;

if (!globalForPrisma.prisma) {
  // Resolve db path relative to this file so it works regardless of process.cwd().
  // Forward slashes required — the adapter strips 'file:' and passes the remainder
  // directly to better-sqlite3 as an OS path.
  const dbPath = path.resolve(__dirname, '..', 'invoice.db').replace(/\\/g, '/');
  const dbUrl = `file:${dbPath}`;
  console.log(`[Prisma] Connecting to local SQLite database at: ${dbUrl}`);

  // PrismaBetterSqlite3 constructor takes a config object { url, ...betterSqlite3Options }.
  // Its connect() method calls createBetterSQLite3Client(this.#config) directly —
  // it does NOT receive the URL as a connect() parameter.
  const adapter = new PrismaBetterSqlite3({ url: dbUrl });

  prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }
} else {
  prisma = globalForPrisma.prisma;
}

module.exports = prisma;
