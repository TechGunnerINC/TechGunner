FROM oven/bun:alpine

WORKDIR /app

COPY package.json ./

COPY bun.lockb .

RUN bun install

COPY . .

EXPOSE 5173

CMD bun --bun run dev