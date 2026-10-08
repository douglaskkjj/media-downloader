FROM node:22-bookworm

WORKDIR /app

RUN apt-get update \
    && apt-get install -y ffmpeg python3 python3-pip \
    && pip3 install --break-system-packages yt-dlp \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]