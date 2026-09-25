FROM node:22-alpine

WORKDIR /app

# Las variables NEXT_PUBLIC_* se incrustan en el bundle durante el build,
# por eso se pasan como build args en vez de copiar .env.local a la imagen.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Se copian solo los archivos necesarios para el build
COPY next.config.js postcss.config.js tailwind.config.ts tsconfig.json next-env.d.ts ./
COPY src ./src

RUN npm run build && chown -R node:node /app/.next

USER node

EXPOSE 3000

CMD ["npm", "start"]
