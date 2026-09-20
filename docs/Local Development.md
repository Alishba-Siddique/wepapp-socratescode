# Local development
[[Home]] ? [[Architecture]] ? [[Testing]]

Use Node from `.node-version`, npm and PostgreSQL 17. On Windows use `npm.cmd` if PowerShell blocks npm.ps1.

## Guest application
```sh
cd frontend
npm ci
npm run dev -- --port 3001
```
`predev` and `prebuild` prepare local runtime assets from locked npm dependencies. No external editor CDN is required. The Python runtime is loaded only when a learner runs code.

## Account service
From the repository root, run `docker compose up -d` for local PostgreSQL and Mailpit. These bind to loopback; this compose file is not a production deployment.

Copy `gateway/.env.example` to `gateway/.env`, then replace `BETTER_AUTH_SECRET` with a random value of at least 32 characters. Example generator: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Keep secrets local.

```sh
cd gateway
npm ci
npm run db:generate
npm run db:deploy
npm run dev
```

The Prisma config loads `.env` if present. The gateway listens on 127.0.0.1:4000. Copy `frontend/.env.example` to `frontend/.env.local`, then restart the frontend on port 3001. `APP_ORIGIN` and `BETTER_AUTH_URL` must be `http://localhost:3001`; the proxy's `GATEWAY_URL` is `http://127.0.0.1:4000`. Do not interchange localhost and 127.0.0.1 for the public origin.

Mailpit captures development mail at http://localhost:8025; no outside email is required. Production requires HTTPS, a managed secret, authenticated SMTP and email verification. These are not production-configured by the code alone.

## Production build locally
```sh
cd gateway
npm run build
npm start
```
In a separate terminal:
```sh
cd frontend
npm run build
npm start -- --port 3001
```

Run gateway commands from `gateway` because the GraphQL schema is read from `../contracts`. Include both directories in its deployment artifact. Next.js also requires access to sibling `contracts` while building.
