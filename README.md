# THANUVERSE

THANUVERSE supports private rooms for two people. The person creating a room chooses a unique code of 8–18 letters or numbers, then shares that code or the invite link with the other person; no separate password is needed. Anyone with the code can join, so share it only with the intended person and do not post it publicly. Each person chooses the name shown for their side when joining and can change it later using “Edit my side.”

## Run locally

```sh
npm install
npm run dev
```

Open `http://localhost:3000`. The development server also provides the room API and WebSocket connection.

## Host for remote access

Deploy this as a Node.js app on a host that supports WebSockets and PostgreSQL:

```sh
npm ci
npm run build
npm run start
```

The included `render.yaml` configures a Render web service and prompts for `DATABASE_URL`. Create a PostgreSQL database with a provider of your choice and set its connection URL as a secret environment variable in Render. Use a TLS-enabled connection URL. The service requires this variable at startup so it cannot silently fall back to temporary storage.

To deploy from the GitHub repository, open the Render dashboard, choose **New → Blueprint**, select `akbarshah-s/Thanuverse`, and apply the `render.yaml` blueprint. Set `DATABASE_URL` to the connection string for your PostgreSQL database in Render's environment settings; do not share the value publicly. Once the service reports **Live**, use its `onrender.com` URL as the website link.

For local development without `DATABASE_URL`, room data is stored in `data/rooms.json`. Put any public deployment behind HTTPS before sharing it.

Room content is stored in PostgreSQL (or in the local JSON file during development), so use a database provider you trust and protect its credentials. The server allows at most two simultaneous connections per room.
