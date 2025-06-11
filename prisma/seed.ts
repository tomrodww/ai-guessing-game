import { PrismaClient, Difficulty } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create themes
  const mysteryTheme = await prisma.theme.create({
    data: {
      name: 'Mystery',
      description: 'Solve puzzles and uncover hidden secrets',
      color: 'mystery',
      icon: 'Search',
    },
  })

  const scifiTheme = await prisma.theme.create({
    data: {
      name: 'Sci-Fi',
      description: 'Explore futuristic worlds and technology',
      color: 'scifi',
      icon: 'Zap',
    },
  })

  const adventureTheme = await prisma.theme.create({
    data: {
      name: 'Adventure',
      description: 'Embark on thrilling journeys and quests',
      color: 'adventure',
      icon: 'Compass',
    },
  })

  // Create a sample mystery story
  const mysteryStory = await prisma.story.create({
    data: {
      title: 'The Locked Room Mystery',
      description: 'A famous detective is found dead in a locked room. Can you solve this impossible crime?',
      difficulty: Difficulty.SHORT,
      themeId: mysteryTheme.id,
      blocks: {
        create: [
          {
            order: 1,
            title: 'The Crime Scene',
            initialHint: 'Detective Harrison is found dead in his study. The door was locked from the inside, and the key is in his pocket.',
            updatedHint: 'Detective Harrison is found dead in his study. The door was locked from the inside, and the key is in his pocket. You notice the window is open and there are wet footprints on the floor.',
            discoveries: {
              create: [
                {
                  fact: 'The window was open during the storm',
                  keywords: 'window,open,storm,rain,weather',
                },
                {
                  fact: 'There are wet footprints leading to the desk',
                  keywords: 'footprints,wet,water,floor,desk',
                },
              ],
            },
          },
          {
            order: 2,
            title: 'The Evidence',
            initialHint: 'The detective\'s desk shows signs of a struggle. His notebook is missing pages.',
            updatedHint: 'The detective\'s desk shows signs of a struggle. His notebook is missing pages. You discover the missing pages in the fireplace - someone tried to burn evidence about a case involving the mayor.',
            discoveries: {
              create: [
                {
                  fact: 'Pages were torn from the notebook',
                  keywords: 'notebook,pages,torn,missing,ripped',
                },
                {
                  fact: 'Burned papers in the fireplace mention the mayor',
                  keywords: 'fireplace,burned,papers,mayor,evidence',
                },
              ],
            },
          },
        ],
      },
    },
  })

  // Create a sample sci-fi story
  const scifiStory = await prisma.story.create({
    data: {
      title: 'The Space Station Incident',
      description: 'Something has gone wrong aboard the orbital research station. Can you uncover what happened?',
      difficulty: Difficulty.MEDIUM,
      themeId: scifiTheme.id,
      blocks: {
        create: [
          {
            order: 1,
            title: 'System Failure',
            initialHint: 'All communication with Earth has been lost. The main computer shows critical errors.',
            updatedHint: 'All communication with Earth has been lost. The main computer shows critical errors. You discover that the AI system has been running unauthorized experiments.',
            discoveries: {
              create: [
                {
                  fact: 'The AI system gained unauthorized access',
                  keywords: 'AI,artificial,intelligence,unauthorized,access,system',
                },
                {
                  fact: 'Experiments were conducted on human subjects',
                  keywords: 'experiments,human,subjects,testing,research',
                },
              ],
            },
          },
          {
            order: 2,
            title: 'The Discovery',
            initialHint: 'Lab reports show strange readings from the bio-research module.',
            updatedHint: 'Lab reports show strange readings from the bio-research module. The AI was trying to create a new form of life by merging human and alien DNA.',
            discoveries: {
              create: [
                {
                  fact: 'Alien DNA samples were discovered',
                  keywords: 'alien,DNA,samples,extraterrestrial,genetic',
                },
                {
                  fact: 'The AI was trying to create hybrid life forms',
                  keywords: 'hybrid,life,forms,creation,genetic,engineering',
                },
              ],
            },
          },
        ],
      },
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`Created themes: ${mysteryTheme.name}, ${scifiTheme.name}, ${adventureTheme.name}`)
  console.log(`Created stories: ${mysteryStory.title}, ${scifiStory.title}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 