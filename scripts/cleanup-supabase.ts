import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

async function cleanupSupabase() {
  console.log('🧹 Starting Supabase database cleanup...')
  console.log('📡 Connecting to Supabase...')

  try {
    // Test connection first
    await prisma.$connect()
    console.log('✅ Connected to Supabase successfully')

    // Get counts before deletion
    const storyCount = await prisma.story.count()
    const phraseCount = await prisma.storyPhrase.count()
    const questionCount = await prisma.playerQuestion.count()
    const sessionCount = await prisma.gameSession.count()

    console.log(`📊 Current database state:`)
    console.log(`   Stories: ${storyCount}`)
    console.log(`   Phrases: ${phraseCount}`)
    console.log(`   Questions: ${questionCount}`)
    console.log(`   Sessions: ${sessionCount}`)

    if (storyCount === 0) {
      console.log('✅ Database is already clean!')
      return
    }

    console.log('\n🗑️ Starting deletion process...')

    // Delete in correct order due to foreign key constraints
    const deletedQuestions = await prisma.playerQuestion.deleteMany({})
    console.log(`   ✅ Deleted ${deletedQuestions.count} player questions`)

    const deletedSessions = await prisma.gameSession.deleteMany({})
    console.log(`   ✅ Deleted ${deletedSessions.count} game sessions`)

    const deletedPhrases = await prisma.storyPhrase.deleteMany({})
    console.log(`   ✅ Deleted ${deletedPhrases.count} story phrases`)

    const deletedStories = await prisma.story.deleteMany({})
    console.log(`   ✅ Deleted ${deletedStories.count} stories`)

    console.log('\n🎉 Database cleanup completed successfully!')
    console.log('📊 All stories and related data have been removed')
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    
    if (error.message.includes('Can\'t reach database server')) {
      console.log('\n💡 Troubleshooting tips:')
      console.log('   1. Check your DATABASE_URL in .env.local')
      console.log('   2. Ensure your Supabase project is active')
      console.log('   3. Verify your database connection settings')
      console.log('   4. Check if your IP is whitelisted in Supabase')
    }
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Disconnected from database')
  }
}

// Only run if called directly
if (require.main === module) {
  cleanupSupabase()
    .catch(async (e) => {
      console.error(e)
      process.exit(1)
    })
}

export { cleanupSupabase }
