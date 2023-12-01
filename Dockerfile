FROM node:18

WORKDIR /usr/src/app

EXPOSE 3000

COPY package*.json ./

RUN npm install --only-production

COPY . .

RUN npm run build
CMD ["npm", "run", "start"]
