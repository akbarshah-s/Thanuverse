import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocket, WebSocketServer } from 'ws';

const root = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.resolve(process.env.KOIVERSE_DATA_DIR || path.join(root, 'data'));
const roomsFile = path.join(dataDirectory, 'rooms.json');
const distDirectory = path.join(root, 'dist');
const isDevelopment = process.env.NODE_ENV !== 'production' && !process.argv.includes('--production');
const maxBodySize = 4 * 1024 * 1024;
const sessionLifetimeMs = 7 * 24 * 60 * 60 * 1000;
const sessionCookie = 'koi_room_session';
const allowedEvents = new Set(['VIRTUAL_HUG', 'VIRTUAL_KISS', 'MISS_YOU', 'HEARTBEAT_SYNC']);
const defaultProfiles = {
  ren: { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  aoi: { city: 'Paris', country: 'France', timezone: 'Europe/Paris' }
};

const rooms = new Map();
const sessions = new Map();
const loginAttempts = new Map();
const clientsByRoom = new Map();
let persistenceQueue = Promise.resolve();
let databasePool;

async function loadRooms() {
  try {
    const savedRooms = JSON.parse(await readFile(roomsFile, 'utf8'));
    if (!Array.isArray(savedRooms)) throw new Error('Room data must be an array.');
    for (const room of savedRooms) {
      if (typeof room.id !== 'string' || typeof room.passwordSalt !== 'string' || typeof room.passwordHash !== 'string') {
        throw new Error('Room data contains an invalid entry.');
      }
      if (!room.profiles || typeof room.profiles !== 'object') {
        room.profiles = Object.fromEntries(['ren', 'aoi'].map((side) => [
          side,
          {
            name: room.displayNames?.[side] || (side === 'ren' ? 'Ren' : 'Aoi'),
            ...defaultProfiles[side]
          }
        ]));
      }
      rooms.set(room.id, room);
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

async function initializeStorage() {
  if (!process.env.DATABASE_URL) {
    if (process.env.REQUIRE_DATABASE === 'true') {
      throw new Error('DATABASE_URL is required when REQUIRE_DATABASE is enabled.');
    }
    await loadRooms();
    return;
  }

  const { Pool } = await import('pg');
  databasePool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  await databasePool.query(`
    CREATE TABLE IF NOT EXISTS koiverse_rooms (
      id VARCHAR(18) PRIMARY KEY,
      password_salt TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      state JSONB,
      display_names JSONB NOT NULL DEFAULT '{}'::jsonb,
      profiles JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL
    )
  `);
  await databasePool.query(`
    ALTER TABLE koiverse_rooms
    ADD COLUMN IF NOT EXISTS display_names JSONB NOT NULL DEFAULT '{}'::jsonb
  `);
  await databasePool.query(`
    ALTER TABLE koiverse_rooms
    ADD COLUMN IF NOT EXISTS profiles JSONB NOT NULL DEFAULT '{}'::jsonb
  `);
  const result = await databasePool.query(`
    SELECT id, password_salt AS "passwordSalt", password_hash AS "passwordHash",
           state, display_names AS "displayNames", profiles, created_at AS "createdAt"
    FROM koiverse_rooms
  `);
  for (const room of result.rows) {
    if (!room.profiles || Object.keys(room.profiles).length === 0) {
      room.profiles = Object.fromEntries(['ren', 'aoi'].map((side) => [
        side,
        {
          name: room.displayNames?.[side] || (side === 'ren' ? 'Ren' : 'Aoi'),
          ...defaultProfiles[side]
        }
      ]));
    }
    rooms.set(room.id, room);
  }
}

function persistRooms() {
  const pendingWrite = persistenceQueue.catch(() => {}).then(async () => {
    await mkdir(dataDirectory, { recursive: true });
    const temporaryFile = `${roomsFile}.${process.pid}.tmp`;
    await writeFile(temporaryFile, JSON.stringify([...rooms.values()]), { mode: 0o600 });
    await rename(temporaryFile, roomsFile);
  });
  persistenceQueue = pendingWrite;
  return pendingWrite;
}

async function persistRoom(room) {
  if (!databasePool) {
    await persistRooms();
    return;
  }
  await databasePool.query(`
    INSERT INTO koiverse_rooms (id, password_salt, password_hash, state, display_names, profiles, created_at)
    VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, $6::jsonb, $7::timestamptz)
    ON CONFLICT (id) DO UPDATE SET
      password_salt = EXCLUDED.password_salt,
      password_hash = EXCLUDED.password_hash,
      state = EXCLUDED.state,
      display_names = EXCLUDED.display_names,
      profiles = EXCLUDED.profiles,
      created_at = EXCLUDED.created_at
  `, [
    room.id,
    room.passwordSalt,
    room.passwordHash,
    JSON.stringify(room.state),
    JSON.stringify(room.displayNames || {}),
    JSON.stringify(room.profiles || {}),
    room.createdAt
  ]);
}

async function persistNewRoom(room) {
  if (!databasePool) {
    rooms.set(room.id, room);
    try {
      await persistRooms();
    } catch (error) {
      rooms.delete(room.id);
      throw error;
    }
    return;
  }

  try {
    await databasePool.query(`
      INSERT INTO koiverse_rooms (id, password_salt, password_hash, state, display_names, profiles, created_at)
      VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, $6::jsonb, $7::timestamptz)
    `, [
      room.id,
      room.passwordSalt,
      room.passwordHash,
      JSON.stringify(room.state),
      JSON.stringify(room.displayNames || {}),
      JSON.stringify(room.profiles || {}),
      room.createdAt
    ]);
  } catch (error) {
    if (error?.code === '23505') {
      const conflict = new Error('That room code is already taken. Choose another one.');
      conflict.status = 409;
      throw conflict;
    }
    throw error;
  }

  rooms.set(room.id, room);
}

function jsonResponse(response, status, payload, headers = {}) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...headers
  });
  response.end(JSON.stringify(payload));
}

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map((part) => {
    const separator = part.indexOf('=');
    if (separator < 0) return ['', ''];
    return [part.slice(0, separator).trim(), part.slice(separator + 1).trim()];
  }).filter(([name]) => name));
}

function getSession(request) {
  const token = parseCookies(request.headers.cookie)[sessionCookie];
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expiresAt <= Date.now() || !rooms.has(session.roomId)) {
    sessions.delete(token);
    return null;
  }
  return { token, ...session };
}

function setSessionCookie(request, response, token) {
  const secure = request.socket.encrypted || request.headers['x-forwarded-proto'] === 'https';
  response.setHeader('Set-Cookie', `${sessionCookie}=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${Math.floor(sessionLifetimeMs / 1000)}${secure ? '; Secure' : ''}`);
}

function clearSessionCookie(request, response) {
  const secure = request.socket.encrypted || request.headers['x-forwarded-proto'] === 'https';
  response.setHeader('Set-Cookie', `${sessionCookie}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure ? '; Secure' : ''}`);
}

function checkOrigin(request) {
  const origin = request.headers.origin;
  let matchesHost = false;
  try {
    matchesHost = !!origin && new URL(origin).host === request.headers.host;
  } catch {
    matchesHost = false;
  }
  if (!matchesHost) {
    const error = new Error('Request origin is not allowed.');
    error.status = 403;
    throw error;
  }
}

function checkLoginRateLimit(request) {
  const address = request.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const recentAttempts = (loginAttempts.get(address) || []).filter((timestamp) => now - timestamp < 15 * 60 * 1000);
  if (recentAttempts.length >= 10) {
    const error = new Error('Too many attempts. Please wait 15 minutes and try again.');
    error.status = 429;
    throw error;
  }
  recentAttempts.push(now);
  loginAttempts.set(address, recentAttempts);
}

async function readJson(request) {
  if (!request.headers['content-type']?.includes('application/json')) {
    const error = new Error('Expected a JSON request.');
    error.status = 415;
    throw error;
  }

  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBodySize) {
      const error = new Error('Request is too large.');
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    const error = new Error('Request body is not valid JSON.');
    error.status = 400;
    throw error;
  }
}

function validateRequestBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    const error = new Error('Request body must be a JSON object.');
    error.status = 400;
    throw error;
  }
}

function validateProfile(profile) {
  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
    const error = new Error('Enter your name and location.');
    error.status = 400;
    throw error;
  }
  const { name, city, country, timezone } = profile;
  if (typeof name !== 'string' || name.trim().length < 1 || name.trim().length > 40) {
    const error = new Error('Enter a name between 1 and 40 characters.');
    error.status = 400;
    throw error;
  }
  if (typeof city !== 'string' || city.trim().length < 1 || city.trim().length > 60
    || typeof country !== 'string' || country.trim().length < 1 || country.trim().length > 60) {
    const error = new Error('Enter a city and country (up to 60 characters each).');
    error.status = 400;
    throw error;
  }
  if (typeof timezone !== 'string' || timezone.length > 100) {
    const error = new Error('Choose a valid time zone.');
    error.status = 400;
    throw error;
  }
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone }).format();
  } catch {
    const error = new Error('Choose a valid IANA time zone, such as Asia/Kolkata.');
    error.status = 400;
    throw error;
  }
  return {
    name: name.trim(),
    city: city.trim(),
    country: country.trim(),
    timezone
  };
}

function validateRoomAccess(perspective, profileInput) {
  if (perspective !== 'ren' && perspective !== 'aoi') {
    const error = new Error('Choose Ren or Aoi before entering the room.');
    error.status = 400;
    throw error;
  }
  return validateProfile(profileInput);
}

function normalizeRoomCode(value) {
  return typeof value === 'string' ? value.trim().toUpperCase() : '';
}

function isValidRoomCode(code) {
  return /^[A-Z0-9]{8,18}$/.test(code);
}

function issueSession(request, response, roomId, perspective, profile) {
  const token = randomBytes(32).toString('base64url');
  sessions.set(token, {
    roomId,
    perspective,
    profile,
    expiresAt: Date.now() + sessionLifetimeMs
  });
  setSessionCookie(request, response, token);
}

async function createRoom(request, response) {
  checkOrigin(request);
  checkLoginRateLimit(request);
  const body = await readJson(request);
  validateRequestBody(body);
  const profile = validateRoomAccess(body.perspective, body);

  const roomId = normalizeRoomCode(body.roomId);
  if (!isValidRoomCode(roomId)) {
    jsonResponse(response, 400, { error: 'Choose a room code with 8 to 18 letters or numbers.' });
    return;
  }
  if (rooms.has(roomId)) {
    jsonResponse(response, 409, { error: 'That room code is already taken. Choose another one.' });
    return;
  }

  const room = {
    id: roomId,
    // Keep the legacy database columns populated; room access is based on the code only.
    passwordSalt: randomBytes(16).toString('base64url'),
    passwordHash: randomBytes(64).toString('base64url'),
    state: null,
    displayNames: { [body.perspective]: profile.name },
    profiles: {
      [body.perspective]: profile,
      [body.perspective === 'ren' ? 'aoi' : 'ren']: {
        name: body.perspective === 'ren' ? 'Your person' : 'Your person',
        ...defaultProfiles[body.perspective === 'ren' ? 'aoi' : 'ren']
      }
    },
    createdAt: new Date().toISOString()
  };
  await persistNewRoom(room);
  issueSession(request, response, roomId, body.perspective, profile);
  jsonResponse(response, 201, {
    roomId,
    perspective: body.perspective,
    displayName: profile.name,
    profile,
    profiles: room.profiles
  });
}

async function joinRoom(request, response) {
  checkOrigin(request);
  checkLoginRateLimit(request);
  const body = await readJson(request);
  validateRequestBody(body);
  const profile = validateRoomAccess(body.perspective, body);
  const roomId = normalizeRoomCode(body.roomId);
  if (!isValidRoomCode(roomId)) {
    jsonResponse(response, 404, { error: 'Room not found. Check the room code and try again.' });
    return;
  }

  const room = rooms.get(roomId);
  if (!room) {
    jsonResponse(response, 404, { error: 'Room not found. Check the room code and try again.' });
    return;
  }

  room.profiles = {
    ...(room.profiles || {}),
    [body.perspective]: profile
  };
  room.displayNames = {
    ...(room.displayNames || {}),
    [body.perspective]: profile.name
  };
  await persistRoom(room);
  sendToRoom(roomId, null, { type: 'participants', payload: room.profiles });
  issueSession(request, response, roomId, body.perspective, profile);
  jsonResponse(response, 200, {
    roomId,
    perspective: body.perspective,
    displayName: profile.name,
    profile,
    profiles: room.profiles
  });
}

function sendToRoom(roomId, sender, payload) {
  const clients = clientsByRoom.get(roomId);
  if (!clients) return;
  for (const client of clients) {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  }
}

async function handleSocketMessage(client, roomId, rawMessage) {
  let message;
  try {
    message = JSON.parse(rawMessage.toString());
  } catch {
    client.send(JSON.stringify({ type: 'error', message: 'Invalid room update.' }));
    return;
  }

  if (message?.type === 'state') {
    if (!message.payload || typeof message.payload !== 'object' || Array.isArray(message.payload)) {
      client.send(JSON.stringify({ type: 'error', message: 'Invalid room data.' }));
      return;
    }
    const serialized = JSON.stringify(message.payload);
    if (Buffer.byteLength(serialized, 'utf8') > maxBodySize) {
      client.send(JSON.stringify({ type: 'error', message: 'Room data is too large to save.' }));
      return;
    }
    const room = rooms.get(roomId);
    if (!room) {
      client.send(JSON.stringify({ type: 'error', message: 'This room no longer exists.' }));
      client.close(4001, 'Room no longer exists');
      return;
    }
    room.state = message.payload;
    await persistRoom(room);
    sendToRoom(roomId, client, { type: 'state', payload: room.state });
    return;
  }

  if (message?.type === 'event' && allowedEvents.has(message.eventType)) {
    sendToRoom(roomId, client, {
      type: 'event',
      eventType: message.eventType,
      payload: message.payload
    });
    return;
  }

  client.send(JSON.stringify({ type: 'error', message: 'Unsupported room update.' }));
}

async function handleApi(request, response, url) {
  if (request.method === 'GET' && url.pathname === '/api/health') {
    jsonResponse(response, 200, { ok: true });
    return true;
  }

  if (request.method === 'GET' && url.pathname === '/api/session') {
    const session = getSession(request);
    if (!session) {
      jsonResponse(response, 200, { authenticated: false });
      return true;
    }
    jsonResponse(response, 200, {
      authenticated: true,
      roomId: session.roomId,
      perspective: session.perspective,
      profile: session.profile
    });
    return true;
  }

  if (request.method === 'POST' && url.pathname === '/api/rooms/create') {
    await createRoom(request, response);
    return true;
  }

  if (request.method === 'POST' && url.pathname === '/api/rooms/join') {
    await joinRoom(request, response);
    return true;
  }

  if (request.method === 'POST' && url.pathname === '/api/profile') {
    checkOrigin(request);
    const session = getSession(request);
    if (!session) {
      jsonResponse(response, 401, { error: 'Join your room again to edit your side.' });
      return true;
    }
    const body = await readJson(request);
    validateRequestBody(body);
    const profile = validateProfile(body);
    const room = rooms.get(session.roomId);
    room.profiles = { ...(room.profiles || {}), [session.perspective]: profile };
    room.displayNames = { ...(room.displayNames || {}), [session.perspective]: profile.name };
    sessions.get(session.token).profile = profile;
    await persistRoom(room);
    sendToRoom(session.roomId, null, { type: 'participants', payload: room.profiles });
    jsonResponse(response, 200, { profile });
    return true;
  }

  if (request.method === 'POST' && url.pathname === '/api/logout') {
    checkOrigin(request);
    const session = getSession(request);
    if (session) sessions.delete(session.token);
    clearSessionCookie(request, response);
    jsonResponse(response, 200, { ok: true });
    return true;
  }

  return false;
}

function contentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return ({
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
  })[extension] || 'application/octet-stream';
}

async function serveProductionFile(response, pathname) {
  const decodedPath = decodeURIComponent(pathname);
  const requestedPath = decodedPath === '/' ? '/index.html' : decodedPath;
  const filePath = path.resolve(distDirectory, `.${requestedPath}`);
  if (!filePath.startsWith(`${distDirectory}${path.sep}`) && filePath !== path.join(distDirectory, 'index.html')) {
    jsonResponse(response, 400, { error: 'Invalid path.' });
    return;
  }

  try {
    const content = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': contentType(filePath),
      'Cache-Control': filePath.endsWith('index.html') ? 'no-cache' : 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'DENY'
    });
    response.end(content);
  } catch (error) {
    if (error?.code === 'ENOENT' && !path.extname(pathname)) {
      const index = await readFile(path.join(distDirectory, 'index.html'));
      response.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Frame-Options': 'DENY'
      });
      response.end(index);
      return;
    }
    throw error;
  }
}

await initializeStorage();

let vite;
const httpServer = createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  try {
    if (url.pathname.startsWith('/api/')) {
      if (await handleApi(request, response, url)) return;
      jsonResponse(response, 404, { error: 'API route not found.' });
      return;
    }

    if (isDevelopment) {
      vite.middlewares(request, response, (error) => {
        if (error) {
          console.error(error);
          if (!response.headersSent) jsonResponse(response, 500, { error: 'Could not serve the development app.' });
        }
      });
      return;
    }

    await serveProductionFile(response, url.pathname);
  } catch (error) {
    console.error('Request failed:', error);
    if (!response.headersSent) {
      const status = Number.isInteger(error?.status) ? error.status : 500;
      jsonResponse(response, status, { error: status === 500 ? 'The room server could not complete that request.' : error.message });
    }
  }
});

const socketServer = new WebSocketServer({ noServer: true, maxPayload: maxBodySize });
httpServer.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  if (url.pathname !== '/sync') return;

  const session = getSession(request);
  if (!session || !request.headers.origin || new URL(request.headers.origin).host !== request.headers.host) {
    socket.write('HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n');
    socket.destroy();
    return;
  }

  socketServer.handleUpgrade(request, socket, head, (client) => {
    const clients = clientsByRoom.get(session.roomId) || new Set();
    if (clients.size >= 2) {
      client.close(4003, 'This room already has two connected people.');
      return;
    }

    clients.add(client);
    clientsByRoom.set(session.roomId, clients);
    const room = rooms.get(session.roomId);
    client.send(JSON.stringify({ type: 'participants', payload: room?.profiles || {} }));
    client.send(JSON.stringify({ type: 'state', payload: room?.state ?? null }));
    client.on('message', (message) => {
      handleSocketMessage(client, session.roomId, message).catch((error) => {
        console.error('Could not save room update:', error);
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'error', message: 'Could not save room updates. Please retry.' }));
        }
      });
    });
    client.on('close', () => {
      clients.delete(client);
      if (clients.size === 0) clientsByRoom.delete(session.roomId);
    });
  });
});

if (isDevelopment) {
  const { createServer: createViteServer } = await import('vite');
  vite = await createViteServer({
    configFile: path.join(root, 'vite.config.ts'),
    server: {
      middlewareMode: true,
      hmr: { server: httpServer },
      open: false
    },
    appType: 'spa'
  });
}

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';
httpServer.listen(port, host, () => {
  console.log(`THANUVERSE ${isDevelopment ? 'development' : 'server'} listening on http://${host}:${port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    httpServer.close();
    socketServer.close();
    if (vite) vite.close();
    if (databasePool) {
      databasePool.end().catch((error) => console.error('Could not close the room database pool:', error));
    }
  });
}
