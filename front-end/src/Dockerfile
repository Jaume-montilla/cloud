FROM node:22.11.0

WORKDIR /var/www/html

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]
