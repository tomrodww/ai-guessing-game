import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanup() {
  console.log('🧹 Starting database cleanup...')

  try {
    // Delete all player questions first (due to foreign key constraints)
    const deletedQuestions = await prisma.playerQuestion.deleteMany({})
    console.log(`🗑️ Deleted ${deletedQuestions.count} player questions`)

    // Delete all game sessions
    const deletedSessions = await prisma.gameSession.deleteMany({})
    console.log(`🗑️ Deleted ${deletedSessions.count} game sessions`)

    // Delete all story phrases
    const deletedPhrases = await prisma.storyPhrase.deleteMany({})
    console.log(`🗑️ Deleted ${deletedPhrases.count} story phrases`)

    // Delete all stories
    const deletedStories = await prisma.story.deleteMany({})
    console.log(`🗑️ Deleted ${deletedStories.count} stories`)

    console.log('✅ Database cleanup completed successfully!')
    console.log('📊 All stories and related data have been removed')
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanup()
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
