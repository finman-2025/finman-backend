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

RUN mkdir -p /app/uploads

EXPOSE 8080

CMD ["npm", "run", "start:prod"]

ENTRYPOINT ["docker-entrypoint.sh"]