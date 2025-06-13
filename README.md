# AI Guessing Game

An interactive AI-powered story guessing game built with Next.js, TypeScript, and Tailwind CSS. Players ask yes/no questions to uncover hidden mysteries and solve engaging stories across different themes.

## 🎮 Features

### Core Gameplay
- **Interactive Mystery Solving**: Ask yes/no questions to uncover story secrets
- **AI-Powered Responses**: Gemini AI evaluates questions and provides intelligent answers
- **Progressive Revelation**: Stories unfold in blocks with discoveries that update hints
- **Multiple Themes**: Mystery, Sci-Fi, and Adventure stories
- **Difficulty Levels**: Short, Medium, and Long stories for different experience levels

### Story System
- **Multi-Block Stories**: Each story is divided into chapters/blocks
- **Discovery Mechanics**: Find hidden facts to progress through the story
- **Dynamic Hints**: Story hints update as you make discoveries
- **Progress Tracking**: Visual progress bars and completion tracking

### User Experience
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Real-time Chat**: Interactive question-answer interface
- **Filtering System**: Filter stories by theme and difficulty
- **Game Statistics**: Track time, questions asked, and discoveries made

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM (Docker containerized)
- **AI Integration**: Google Gemini API
- **Icons**: Lucide React
- **Styling**: Custom Tailwind CSS components
- **Development**: Docker Compose for local database

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google Gemini API key

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-guessing-game
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ai_guessing_game"

# AI Service (Gemini)
GEMINI_API_KEY="your_gemini_api_key_here"

# Optional: For image generation
STABILITY_AI_API_KEY="your_stability_ai_key_here"

# Next.js
NEXTAUTH_SECRET="your_nextauth_secret_here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed the database with sample data
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── ask-question/  # Question evaluation endpoint
│   ├── story/[id]/        # Individual story pages
│   ├── create/            # Story creation page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── GameInterface.tsx  # Main game component
│   ├── StoryCard.tsx     # Story display cards
│   ├── StoryFilters.tsx  # Filter components
│   ├── Header.tsx        # Navigation header
│   └── ...               # Other components
├── lib/                  # Utility libraries
│   ├── prisma.ts         # Database client
│   ├── gemini.ts         # AI integration
│   └── utils.ts          # Helper functions
├── types/                # TypeScript type definitions
│   └── index.ts          # Shared types
prisma/
├── schema.prisma         # Database schema
└── seed.ts              # Database seeding script
```

## 🎯 How to Play

1. **Choose a Story**: Browse stories on the homepage and filter by theme or difficulty
2. **Read the Hint**: Each story block starts with an initial hint
3. **Ask Questions**: Type yes/no questions to gather information
4. **Make Discoveries**: When your questions match story facts, you'll unlock discoveries
5. **Progress Through Blocks**: Complete all discoveries in a block to move to the next
6. **Solve the Mystery**: Uncover all secrets to complete the story

### Example Questions
- "Was the door locked?"
- "Did someone break the window?"
- "Is there evidence of a struggle?"
- "Was it raining that night?"

## 🔧 API Endpoints

### POST `/api/ask-question`
Evaluates a player's question against the current story context.

**Request Body:**
```json
{
  "question": "Was the door locked?",
  "storyId": "story_id",
  "blockId": "block_id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "answer": "Yes",
    "explanation": "The door was indeed locked from the inside.",
    "discoveryMade": {
      "fact": "The door was locked from the inside",
      "blockId": "block_id"
    },
    "blockCompleted": false,
    "storyCompleted": false
  }
}
```

## 🎨 Customization

### Adding New Themes
1. Create a new theme in the database
2. Add corresponding color classes in `tailwind.config.js`
3. Update the `getThemeColors` function in `src/lib/utils.ts`

### Creating New Stories
Use the `/create` page to add new stories with multiple blocks and discoveries.

### AI Configuration
Modify the prompts in `src/lib/gemini.ts` to customize how the AI evaluates questions.

## 🧪 Development

### Database Operations
```bash
# Reset database
npm run db:push -- --force-reset

# View database in Prisma Studio
npx prisma studio

# Generate new migration
npx prisma migrate dev --name migration_name
```

### Building for Production
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini for AI question evaluation
- Lucide React for beautiful icons
- Tailwind CSS for styling utilities
- Next.js team for the amazing framework 