FROM oven/bun:latest

WORKDIR /app

COPY package.json ./

COPY bun.lockb .

RUN bun install

COPY *.config .

COPY tsconfig.json .

COPY src src

COPY static static

EXPOSE 5173

CMD bun run dev