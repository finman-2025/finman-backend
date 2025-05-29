# Build Stage
FROM node:lts-alpine AS build

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

RUN npm ci --only=production && npm cache clean --force

# Production Stage
FROM node:lts-alpine AS production

WORKDIR /app

COPY --from=build /app/package*.json .
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

RUN mkdir -p /app/uploads

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push && node dist/prisma/seed.js && npm run start:prod"]