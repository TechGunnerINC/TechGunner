FROM oven/bun:alpine

WORKDIR /app

COPY *.json ./

COPY bun.lockb .

RUN bun install

COPY .svelte-kit .svelte-kit
COPY *.config.* ./
COPY static static
COPY src src

EXPOSE 5173

CMD bun --bun run dev