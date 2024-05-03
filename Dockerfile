FROM node:18-alpine as BUILD_IMAGE

ARG VITE_SPEECH_KEY
ARG VITE_SPEECH_REGION
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_KEY

ENV VITE_SPEECH_KEY=$VITE_SPEECH_KEY
ENV VITE_SPEECH_REGION=$VITE_SPEECH_REGION
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_KEY=$VITE_SUPABASE_KEY

WORKDIR /app/lps_translation

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine as PROD_IMAGE

WORKDIR /app/lps_translation_prod

COPY --from=BUILD_IMAGE /app/lps_translation/dist/ /app/lps_translation_prod/dist/

COPY package.json .

COPY vite.config.js .

RUN npm install vite -g

RUN npm cache clean --force

RUN npm install npm@latest -g

RUN chmod 755 /app/lps_translation_prod/

EXPOSE 8080

CMD ["npm", "run", "preview"]
