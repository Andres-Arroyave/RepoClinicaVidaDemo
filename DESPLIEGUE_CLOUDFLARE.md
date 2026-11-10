# Guía Rápida de Despliegue en Cloudflare (100% Gratuito y en 3 Minutos)

Este proyecto cuenta con arquitectura **Full-Stack Serverless Edge**:
- **Frontend:** Vue 3 + Vite + Leaflet Maps.
- **Backend & APIs de IA:** Cloudflare Functions (`functions/api/[[route]].ts`).
- **Persistencia:** Compatible con Cloudflare D1 / LocalStorage / SQLite.

---

## Método 1: Conectar con GitHub (El más fácil y automático)

1. Sube tu código a un repositorio en **GitHub**.
2. Entra a tu cuenta en [dash.cloudflare.com](https://dash.cloudflare.com/).
3. En el menú lateral izquierdo, haz clic en **Compute (Workers) > Workers & Pages**.
4. Haz clic en **Create application** > pestaña **Pages** > **Connect to Git**.
5. Selecciona tu repositorio de GitHub y configura lo siguiente:
   - **Framework preset:** `Vue.js` (o `Vite`)
   - **Root directory:** `front-clinicavida`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
6. Haz clic en **Save and Deploy**.

¡Listo! Cloudflare compilará el frontend, activará automáticamente el backend en el Edge (`functions/api`) y te entregará una URL pública y segura como:
👉 `https://clinica-vida-medellin.pages.dev`

---

## Método 2: Despliegue Directo desde tu Terminal (con Wrangler)

Si no quieres usar GitHub y prefieres subirlo directamente desde tu computadora:

1. Instala el CLI de Cloudflare:
   ```bash
   npm install -g wrangler
   ```
2. Inicia sesión en tu cuenta:
   ```bash
   npx wrangler login
   ```
3. Compila y publica con un solo comando desde la raíz:
   ```bash
   npm --prefix front-clinicavida run build
   npx wrangler pages deploy front-clinicavida/dist --project-name=clinica-vida-medellin
   ```
Cloudflare te imprimirá la URL en tu consola en menos de 10 segundos.
