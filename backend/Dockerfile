FROM ubuntu

WORKDIR /app

RUN apt-get update -y

RUN apt-get upgrade -y

RUN apt-get install curl -y

RUN curl -fsSL https://deb.nodesource.com/setup_21.x | bash - && apt-get install -y nodejs

RUN npm i -g bun

COPY package.json ./

COPY bun.lockb .

RUN bun install

COPY prisma prisma

RUN bunx prisma generate

COPY src src

COPY tsconfig.json .

EXPOSE 3000

CMD bun run dev