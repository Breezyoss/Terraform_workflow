FROM node:20
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev
RUN npm i prisma 

COPY prisma/ ./prisma/
RUN npx prisma generate --schema ./prisma/schema/

# Install system packages (for Playwright or headless browsers)
RUN apt-get -y update
RUN apt-get install -y apt-transport-https
RUN apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

# 🛠️ Build the app here
RUN npm run build
COPY . .


ENV PUBLIC_URL="example.com"
ENV PROTOCOL_HEADER='x-forwarded-proto'
ENV HOST_HEADER='x-forwarded-host'
ENV ORIGIN='https://localhost:3002'
# ENV REDIRECT_URL="http://172.104.240.207/authenticate"
ENV REMEDIUM_SECRET_KEY=''
ENV API_URL='http://host.docker.internal:8000'
ENV DEBUG=true
ENV PORT=3000


EXPOSE 3002

CMD [ "node", "." ]