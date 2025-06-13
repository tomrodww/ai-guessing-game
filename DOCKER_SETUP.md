# 🐳 Docker Setup Guide for AI Guessing Game

This guide will help you set up PostgreSQL using Docker for local development.

## 📋 Prerequisites

- **Docker Desktop** installed and running
- **Node.js 18+** installed
- **Git** (to clone the repository)

## 🚀 Quick Start

### 1. Start the Database
```bash
# Start PostgreSQL container
npm run db:up

# Or manually:
docker-compose up -d
```

### 2. Set Up Environment
Copy the environment template and configure:
```bash
# Copy template to .env.local
cp env.template .env.local
```

Your `.env.local` should contain:
```env
DATABASE_URL="postgresql://gameuser:gamepassword@localhost:5432/ai_guessing_game"
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 3. Initialize Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Start the Application
```bash
npm run dev
```

Visit `http://localhost:3000` to see your app!

## 🛠 Docker Commands

### Database Management
```bash
# Start database
npm run db:up

# Stop database (keeps data)
npm run db:down

# Reset database (deletes all data)
npm run db:reset

# View database logs
npm run db:logs

# Check container status
docker ps
```

### Manual Docker Commands
```bash
# Start container
docker-compose up -d

# Stop container
docker-compose down

# Remove container and data
docker-compose down -v

# View logs
docker logs ai-game-db

# Access PostgreSQL shell
docker exec -it ai-game-db psql -U gameuser -d ai_guessing_game
```

## 📊 Database Connection Details

When the container is running, you can connect to PostgreSQL using:

- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `ai_guessing_game`
- **Username:** `gameuser`
- **Password:** `gamepassword`

## 🔧 Troubleshooting

### Container Won't Start
```bash
# Check if port 5432 is already in use
netstat -an | findstr :5432

# Stop any existing PostgreSQL services
# Windows: Stop PostgreSQL service in Services.msc
# Or use a different port in docker-compose.yml
```

### Database Connection Issues
```bash
# Test connection
npm run db:push

# Check container health
docker ps

# View container logs
npm run db:logs
```

### Reset Everything
```bash
# Complete reset
npm run db:reset
npm run db:generate
npm run db:push
npm run db:seed
```

## 🎯 Development Workflow

### Daily Development
1. **Start coding session:**
   ```bash
   npm run db:up
   npm run dev
   ```

2. **End coding session:**
   ```bash
   npm run db:down
   ```

### Working with Schema Changes
1. **Update `prisma/schema.prisma`**
2. **Push changes:**
   ```bash
   npm run db:push
   ```
3. **Regenerate client:**
   ```bash
   npm run db:generate
   ```

### Adding Sample Data
```bash
# Re-seed database
npm run db:seed
```

## 📁 Docker Files Explained

### `docker-compose.yml`
- **PostgreSQL 15** container
- **Persistent data** storage
- **Health checks** for reliability
- **Custom credentials** for security

### Container Details
- **Image:** `postgres:15`
- **Container Name:** `ai-game-db`
- **Volume:** `postgres_data` (persists data)
- **Network:** Isolated Docker network

## 🔒 Security Notes

### Development vs Production
- These credentials are for **development only**
- **Never use these in production**
- Production should use:
  - Strong, unique passwords
  - Environment-specific secrets
  - SSL connections
  - Network restrictions

### Local Network Access
- Database is only accessible from `localhost`
- Container is isolated from external networks
- Data persists between container restarts

## 🎨 Alternative Setups

### Different Port
If port 5432 is in use, modify `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Use port 5433 instead
```

Then update your `DATABASE_URL`:
```env
DATABASE_URL="postgresql://gameuser:gamepassword@localhost:5433/ai_guessing_game"
```

### Different Credentials
Modify environment variables in `docker-compose.yml`:
```yaml
environment:
  POSTGRES_USER: your_username
  POSTGRES_PASSWORD: your_password
  POSTGRES_DB: your_database_name
```

## 📈 Next Steps

Once your database is running:

1. **Get Gemini API Key:** Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Add to `.env.local`:** Set your `GEMINI_API_KEY`
3. **Start developing:** Your AI-powered guessing game is ready!

## 🆘 Need Help?

- **Docker Issues:** Check [Docker Documentation](https://docs.docker.com/)
- **Database Issues:** Run `npm run db:logs` to see error messages
- **App Issues:** Check the Next.js console output

Happy coding! 🎮 