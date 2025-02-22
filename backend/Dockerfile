FROM node:20-alpine

WORKDIR /var/www/html

COPY package.json package-lock.json ./

RUN npm install

COPY src ./

EXPOSE 3000
EXPOSE 9876
EXPOSE 8080

CMD ["node", "index.mjs"]
