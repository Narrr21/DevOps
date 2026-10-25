FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY server.js ./
COPY clock.js ./
COPY client ./client

ENV NODE_ENV=production
EXPOSE 3000

USER node

CMD ["node", "server.js"]
