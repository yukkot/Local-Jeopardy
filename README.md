# Jeopardy Casero

Tablero estilo Jeopardy para jugar en grupo, con panel de administración para crear tableros propios (categorías, preguntas, imágenes/audio/video). Un jugador a la vez, respuestas por tarjetas de opción, puntaje manual por jugador.

## Stack (fijo, no se modifica durante el proyecto)

| Capa | Tecnología |
|---|---|
| Frontend | Next.js + Tailwind CSS |
| Backend | Next.js API Routes |
| Tipo de API | REST |
| Base de datos | Supabase (Postgres) |
| Storage de archivos | Supabase Storage |
| Autenticación al panel | Contraseña simple (env var + cookie) |
| Hosting | Ninguno — corre local en tu PC |



## Cómo correr el proyecto

1. Crear un proyecto en [supabase.com](https://supabase.com), y correr el contenido de `supabase/schema.sql` en su SQL Editor.
2. Copiar `.env.example` a `.env.local` y completar:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   ADMIN_PASSWORD=una-contraseña-a-elección
   ```
3. Instalar dependencias:
   ```
   npm install
   ```
4. Levantar en modo desarrollo:
   ```
   npm run dev
   ```
   Abrir [http://localhost:3000](http://localhost:3000)

## Correr con Docker

Requiere tener el `.env.local` creado (paso 2 de arriba).

```
docker compose --env-file .env.local up --build
```

Esto dockeriza el proyecto completo (frontend + API Routes) y lo expone en `localhost:3000`.

> El `--env-file .env.local` es obligatorio al construir: las variables `NEXT_PUBLIC_*` se incrustan en la imagen durante el build. El `.env.local` no se copia a la imagen, para no dejar las claves adentro.
>
> Si ya tienes `npm run dev` corriendo, deténlo antes: ambos usan el puerto 3000.

## Tests y coverage

```
npm test
```

Corre todos los tests con `--coverage`. El umbral mínimo configurado es 60% (statements, branches, functions, lines) sobre los archivos en `src/lib/`. A medida que se agregue lógica de negocio nueva (hito 1 en adelante), hay que sumarla a `collectCoverageFrom` en `jest.config.js` y escribirle sus tests correspondientes.
