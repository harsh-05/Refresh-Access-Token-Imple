FROM node:alpine 

WORKDIR /app/

COPY package* .

RUN npm install

COPY tsconfig*.json ./
COPY prisma.config*.ts ./
COPY ./prisma ./prisma

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN  npx prisma generate

COPY ./src ./src    

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
