FROM node:alpine 

WORKDIR app/

COPY package* .

RUN npm install

COPY ./prisma .

RUN  npx prisma generate

COPY ./src .

EXPOSE 3000

