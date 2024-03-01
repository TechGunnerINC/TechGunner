FROM ubuntu

WORKDIR /app

RUN apt-get update -y
RUN apt-get install curl -y

RUN curl -fsSL https://deb.nodesource.com/setup_21.x | bash - && apt-get install -y nodejs
RUN apt-get upgrade -y

RUN npm i -g bun

COPY *.json ./
COPY bun.lockb .

RUN bun install

COPY prisma prisma
RUN bunx prisma generate

COPY src src

EXPOSE 3000

CMD bun run dev