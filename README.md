# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

## Docker Setup

### Development with Docker

Run the development server in Docker:

```bash
docker-compose -f docker-compose.dev.yml up
```

### Production with Docker

Build and run the production container:

```bash
docker-compose up --build
```

Or build and run separately:

```bash
# Build the image
docker-compose build

# Run the container
docker-compose up
```

Stop the containers:

```bash
docker-compose down
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

- `NUXT_PCI_API_KEY` - Podcast Index API key
- `NUXT_PCI_API_SECRET` - Podcast Index API secret
- `NUXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NUXT_PUBLIC_SUPABASE_KEY` - Supabase anon public key
