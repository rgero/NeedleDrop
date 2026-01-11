# ---------- BUILD ----------
FROM node:22.14 AS build

WORKDIR /needledrop

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# ---------- SERVE ----------
FROM node:22.14-alpine AS serve

RUN npm install -g serve

WORKDIR /needledrop

COPY --from=build /needledrop/dist ./dist
COPY serve.json ./dist/serve.json

EXPOSE 3345

CMD ["serve", "-s", "dist", "-l", "3345"]
