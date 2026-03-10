# ---------- BUILD ----------
FROM node:24-slim AS build

WORKDIR /needledrop

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- SERVE ----------
FROM node:24-alpine AS serve

USER node

WORKDIR /home/node/app

COPY --from=build /needledrop/dist ./dist
COPY --from=build /needledrop/serve.json ./dist/serve.json

EXPOSE 3345

CMD ["npx", "serve", "-s", "dist", "-l", "3345"]