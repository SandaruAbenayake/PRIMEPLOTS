FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

ENV PORT=300

EXPOSE $PORT

CMD ["npm", "start"]
