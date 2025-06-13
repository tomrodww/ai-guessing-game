import { PrismaClient, Difficulty } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create themes
  const mysteryTheme = await prisma.theme.upsert({
    where: { name: 'Mystery' },
    update: {},
    create: {
      name: 'Mystery',
      description: 'Puzzling scenarios that challenge your deductive reasoning',
      color: 'purple',
      icon: 'Search',
    },
  })

  const sciFiTheme = await prisma.theme.upsert({
    where: { name: 'Sci-Fi' },
    update: {},
    create: {
      name: 'Sci-Fi',
      description: 'Futuristic scenarios with technological twists',
      color: 'blue',
      icon: 'Rocket',
    },
  })

  const adventureTheme = await prisma.theme.upsert({
    where: { name: 'Adventure' },
    update: {},
    create: {
      name: 'Adventure',
      description: 'Exciting journeys and daring escapades',
      color: 'green',
      icon: 'Map',
    },
  })

  console.log('✅ Themes created')

  // Create stories with phrases, full text, and hints
  const stories = [
    {
      title: 'The Man in the Elevator',
      context: 'A man who lives on the tenth floor of a building takes the elevator every day to go to work. When he returns, he takes the elevator to the seventh floor and then walks up the remaining three floors. Why does he do this?',
      fullText: 'The man is a person of very short stature. Each morning, he has no problem reaching the ground floor button to go to work. However, upon his return, his reach is limited, and he can only press the button for the seventh floor. Consequently, he rides the elevator to the seventh floor and climbs the stairs for the final three floors to his apartment. On rainy days, he has a simple solution: he uses his umbrella to press the button for the tenth floor.',
      hints: ['His daily routine changes under certain conditions.', 'It\'s a matter of accessibility.', 'Think about his physical characteristics.'],
      difficulty: Difficulty.MEDIUM,
      themeId: mysteryTheme.id,
      phrases: [
        'The man is a person of very short stature.',
        'He can comfortably reach the button for the ground floor to go to work.',
        'When returning, he can only reach the button for the seventh floor.',
        'He has to get off at the seventh floor and walk the rest of the way.',
        'If it\'s raining, he uses his umbrella to press the tenth-floor button.'
      ]
    },
    {
      title: 'The Scuba Diver',
      context: 'A man is found dead in a forest, wearing a full scuba diving suit. The forest is miles away from the nearest large body of water. How did he die?',
      fullText: 'A devastating forest fire was raging. To combat the blaze, a helicopter equipped with a massive bucket was sent to collect water from a nearby lake. As it scooped up a large volume of water, it unknowingly captured a scuba diver who was exploring the lake\'s depths at that exact moment. The helicopter then flew over the fire and released its contents, and the unfortunate diver fell to his death from a great height in the middle of the forest.',
      hints: ['The man did not walk to the forest.', 'His death was accidental and involved a natural disaster.', 'Consider the methods used to fight large fires.'],
      difficulty: Difficulty.MEDIUM,
      themeId: adventureTheme.id,
      phrases: [
        'A forest fire had broken out in the area.',
        'A helicopter with a large water bucket was dispatched to fight the fire.',
        'The helicopter collected water from a nearby lake.',
        'The scuba diver, who was diving in that lake, was accidentally scooped up along with the water.',
        'He was then tragically dropped over the burning forest and died from the fall.'
      ]
    },
    {
      title: 'The Interrupted Music',
      context: 'The music stopped. She died. What happened?',
      fullText: 'The woman was a blindfolded tightrope walker performing in a circus. Her entire act was timed to a live musical piece, which she used as an auditory cue to know when she had reached the end of the rope. During one performance, the musician abruptly stopped playing. This sudden silence caused her to lose her sense of timing and position on the rope. She took another step, believing she had reached the platform, but instead fell to her death.',
      hints: ['Her life depended on sound.', 'Her profession involves balance and risk.', 'The silence was the direct cause of the tragedy.'],
      difficulty: Difficulty.MEDIUM,
      themeId: mysteryTheme.id,
      phrases: [
        'The woman was a tightrope walker in a circus.',
        'Her act was performed blindfolded.',
        'The live music was her cue for how much further she had to walk.',
        'The musician unexpectedly stopped playing.',
        'Losing her auditory guide, she misjudged her position, fell, and died.'
      ]
    },
    {
      title: 'A Push for a Fortune',
      context: 'A man pushes his car. He stops at a hotel and is suddenly bankrupt. What happened?',
      fullText: 'The man is not in a real car but is instead engrossed in a game of Monopoly. His chosen token on the board is the miniature car. During his turn, he moves, or "pushes," his car piece along the squares. His move unfortunately lands him on a property where another player has built a hotel. The resulting rent is astronomically high, and he does not have enough Monopoly money to pay the debt, forcing him into bankruptcy and out of the game.',
      hints: ['The car and the hotel are not life-sized.', 'The situation involves a popular board game.', 'Losing all your money is part of the game.'],
      difficulty: Difficulty.MEDIUM,
      themeId: mysteryTheme.id,
      phrases: [
        'The man is playing a game of Monopoly.',
        'His game piece is the car token.',
        'He "pushes" his car token by moving it around the board.',
        'He lands on a property with a hotel owned by another player.',
        'The rent is so high that he cannot afford to pay, making him bankrupt in the game.'
      ]
    },
    {
      title: 'An Unconventional Cure',
      context: 'A man walks into a restaurant and asks the waiter for a glass of water. The waiter, after observing the man, points a revolver at him. The man thanks him and leaves. Why did the waiter do that?',
      fullText: 'A man was walking down the street when he developed a case of the hiccups. He entered a restaurant hoping a glass of water would cure them. The waiter noticed the man was hiccuping, not thirsty. To provide a cure, the waiter decided to give him a sudden fright. The shock successfully stopped the hiccups, so the man thanked him and left.',
      hints: ['The man\'s request was not about thirst.', 'The waiter\'s action was a form of treatment.', 'A sudden emotion was the key.'],
      difficulty: Difficulty.MEDIUM,
      themeId: mysteryTheme.id,
      phrases: [
        'A man was walking down the street when he developed a case of the hiccups.',
        'He entered a restaurant hoping a glass of water would cure them.',
        'The waiter noticed the man was hiccuping, not thirsty.',
        'To provide a cure, the waiter decided to give him a sudden fright.',
        'The shock successfully stopped the hiccups, so the man thanked him and left.'
      ]
    },
    {
      title: 'The Fallen Couple',
      context: 'Romeo & Juliet were found dead in a room with an open door and a window to the garden. Next to them was a puddle, stones, and shards of glass. How did Romeo & Juliet die?',
      fullText: 'Romeo & Juliet were not people, but two pet fish. They lived in a fishbowl that sat on a table in the room. A cat entered the room and knocked the fishbowl off the table. The fishbowl shattered on the floor, leaving glass, stones, and a puddle. Out of the water, Romeo & Juliet died of asphyxiation.',
      hints: ['The victims were not human.', 'An animal was the unintentional culprit.', 'Their names are a classic misdirection.'],
      difficulty: Difficulty.MEDIUM,
      themeId: mysteryTheme.id,
      phrases: [
        'Romeo & Juliet were not people, but two pet fish.',
        'They lived in a fishbowl that sat on a table in the room.',
        'A cat entered the room and knocked the fishbowl off the table.',
        'The fishbowl shattered on the floor, leaving glass, stones, and a puddle.',
        'Out of the water, Romeo & Juliet died of asphyxiation.'
      ]
    },
    {
      title: 'The Short Straw',
      context: 'A naked man was found dead in the middle of a large desert. Next to him was a small stick. Why was he found dead in the desert in that manner?',
      fullText: 'The man was traveling with several others in a hot air balloon. The balloon began to lose altitude, creating a dangerous situation. To reduce weight, the passengers first threw out all the sandbags, then their clothes. As the balloon continued to fall, they decided one person had to jump. They drew straws to choose who would sacrifice themselves, and he lost.',
      hints: ['He did not travel to the desert on foot.', 'His death was a sacrifice to save others.', 'The stick was used for a fateful decision.'],
      difficulty: Difficulty.MEDIUM,
      themeId: adventureTheme.id,
      phrases: [
        'The man was traveling with several others in a hot air balloon.',
        'The balloon began to lose altitude, creating a dangerous situation.',
        'To reduce weight, the passengers first threw out all the sandbags, then their clothes.',
        'As the balloon continued to fall, they decided one person had to jump.',
        'They drew straws to choose who would sacrifice themselves, and he lost.'
      ]
    },
    {
      title: 'A Trick of the Light',
      context: 'He lived in a small town. One day, he took a train to a big city. On the return trip, also by train, he was overjoyed when suddenly, he committed suicide. The region between the two cities was mountainous. Why did he kill himself?',
      fullText: 'The man had been blind since birth. He traveled to the big city for a revolutionary operation that successfully restored his sight. On the train ride home, he was ecstatic to finally be able to see the world. As the train entered a dark tunnel through the mountains, the sudden blackness made him think the operation had failed. Believing he had gone blind again, he was so devastated that he took his own life.',
      hints: ['His happiness was linked to a newfound sense.', 'A temporary change in environment led to his despair.', 'He misinterpreted darkness.'],
      difficulty: Difficulty.MEDIUM,
      themeId: mysteryTheme.id,
      phrases: [
        'The man had been blind since birth.',
        'He traveled to the big city for a revolutionary operation that successfully restored his sight.',
        'On the train ride home, he was ecstatic to finally be able to see the world.',
        'As the train entered a dark tunnel through the mountains, the sudden blackness made him think the operation had failed.',
        'Believing he had gone blind again, he was so devastated that he took his own life.'
      ]
    },
    {
      title: 'The First Humans',
      context: 'An adventurer walking through the arctic sees two bodies perfectly preserved inside an iceberg. As he gets closer, he shouts, "It\'s them! I\'ve found Adam & Eve!" How was the young man so certain?',
      fullText: 'According to biblical tradition, Adam and Eve were created directly, not born from a mother. This means they would be the only two humans to have ever existed without navels. The adventurer noticed the two perfectly preserved bodies lacked navels and drew his conclusion.',
      hints: ['The answer lies in a unique anatomical detail.', 'Think about how all other humans are born.', 'The bodies were complete and unaltered.'],
      difficulty: Difficulty.SHORT,
      themeId: mysteryTheme.id,
      phrases: [
        'According to biblical tradition, Adam and Eve were created directly, not born from a mother.',
        'This means they would be the only two humans to have ever existed without navels.',
        'The adventurer noticed the two perfectly preserved bodies lacked navels and drew his conclusion.'
      ]
    },
    {
      title: 'A Matter of Pride',
      context: 'The world\'s smallest dwarf was found dead on a deserted street. Near him was sawdust. Why did he kill himself? Detail: the dwarf was blind.',
      fullText: 'The world\'s smallest dwarf was immensely proud of his title. His rival, the second smallest dwarf, was intensely jealous. To crush his spirit, the rival secretly sawed a small piece off the end of the blind dwarf\'s cane. The next day, as the blind dwarf used his shortened cane, he felt taller. Believing he had grown and lost his title, he was so consumed by despair that he took his own life.',
      hints: ['His death was caused by a false perception.', 'His rival\'s jealousy was the root cause.', 'The sawdust is a clue to the sabotage.'],
      difficulty: Difficulty.MEDIUM,
      themeId: mysteryTheme.id,
      phrases: [
        'The world\'s smallest dwarf was immensely proud of his title.',
        'His rival, the second smallest dwarf, was intensely jealous.',
        'To crush his spirit, the rival secretly sawed a small piece off the end of the blind dwarf\'s cane.',
        'The next day, as the blind dwarf used his shortened cane, he felt taller.',
        'Believing he had grown and lost his title, he was so consumed by despair that he took his own life.'
      ]
    }
  ]

  // Create all stories
  for (const storyData of stories) {
    await prisma.story.create({
      data: {
        title: storyData.title,
        context: storyData.context,
        fullText: storyData.fullText,
        hints: storyData.hints,
        difficulty: storyData.difficulty,
        themeId: storyData.themeId,
        phrases: {
          create: storyData.phrases.map((phrase, index) => ({
            order: index + 1,
            text: phrase
          }))
        }
      }
    })
  }

  console.log('✅ Stories with phrases created')
  console.log(`📊 Created ${await prisma.theme.count()} themes`)
  console.log(`📊 Created ${await prisma.story.count()} stories`)
  console.log(`📊 Created ${await prisma.storyPhrase.count()} phrases`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('🎉 Database seeded successfully!')
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  }) 