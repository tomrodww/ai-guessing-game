import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create themes
  const mysteryTheme = await prisma.theme.upsert({
    where: { name: 'Mystery' },
    update: {},
    create: {
      name: 'Mystery',
      description: 'Puzzling cases and unexplained phenomena',
      color: 'purple',
      icon: 'Eye',
    },
  })

  const sciFiTheme = await prisma.theme.upsert({
    where: { name: 'Sci-Fi' },
    update: {},
    create: {
      name: 'Sci-Fi',
      description: 'Futuristic scenarios and space mysteries',
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
          title: 'Tenth Floor',
          context: 'A man lives on the tenth floor. To go to work, he takes the elevator down. When he returns, he takes the elevator to the seventh floor and uses the stairs for the rest. On rainy days, he takes the elevator all the way to the tenth floor. Why?',
          hints: ['Physical stature', 'An object for rain', 'Button height'],
          themeId: mysteryTheme.id,
          phrases: [
            'The man is a person of very short stature.',
            'He cannot reach the tenth-floor button.',
            'He can only reach the seventh-floor button.',
            'On rainy days, he carries an umbrella.',
            'He uses the umbrella to press the tenth-floor button.'
          ]
        },
        {
          title: 'Forest Diver',
          context: 'A man is found dead in a forest, wearing a full scuba diving suit. The forest is miles away from the nearest large body of water. Why?',
          hints: ['Emergency services', 'Water transport', 'Fire'],
          themeId: mysteryTheme.id,
          phrases: [
            'A forest fire was raging nearby.',
            'A helicopter was fighting the fire.',
            'The helicopter used lake water.',
            'The man was diving in that lake.',
            'He was accidentally scooped up with the water.',
            'He was dropped over the forest.',
            'The fall was fatal.'
          ]
        },
        {
          title: 'Music Stops',
          context: 'The music stopped. She died. Why?',
          hints: ['Performance', 'Guidance', 'Blindness'],
          themeId: mysteryTheme.id,
          phrases: [
            'She was a circus tightrope walker.',
            'She performed her act blindfolded.',
            'The live music was her timing cue.',
            'She lost her auditory guide.',
            'She misjudged her position and fell.'
          ]
        },
        {
          title: 'Bankrupt Driver',
          context: 'A man pushes his car, stops at a hotel, and is suddenly bankrupt. Why?',
          hints: ['Plastic', 'Board', 'Rent'],
          themeId: mysteryTheme.id,
          phrases: [
            'The man is playing Monopoly.',
            'His game piece is the car token.',
            'The property he landed on has a hotel.',
            'Another player owns the property.',
            'The rent is extremely high.',
            'He cannot afford to pay the rent.'
          ]
        },
        {
          title: 'Gun',
          context: 'A man enters a restaurant and asks for water. The waiter points a revolver at him. The man thanks the waiter and leaves. Why?',
          hints: ['Condition', 'Shock', 'Friendly'],
          themeId: mysteryTheme.id,
          phrases: [
            'The man had the hiccups.',
            'The waiter noticed the man was hiccuping.',
            'The waiter decided to give him a fright.',
            'The shock successfully cured the hiccups.'
          ]
        },
        {
          title: 'Two Bodies',
          context: 'Romeo & Juliet are found dead in a room. Nearby are a puddle, stones, and shards of glass. Why?',
          hints: ['Fish', 'Shattered', 'Pet'],
          themeId: mysteryTheme.id,
          phrases: [
            'Romeo & Juliet were two pet fish.',
            'They lived in a glass fishbowl.',
            'A cat entered the room.',
            'The cat knocked the fishbowl off a table.',
            'They died from lack of water.'
          ]
        },
        {
          title: 'Desert Stick',
          context: 'A naked man is found dead in the desert. Next to him is a small stick. Why?',
          hints: ['Decision', 'Not alone', 'Weight'],
          themeId: adventureTheme.id,
          phrases: [
            'The man was in a hot air balloon.',
            'Several other people were with him.',
            'The balloon began to lose altitude.',
            'They threw out all their possessions.',
            'They threw out their clothes.',
            'The balloon was still falling.',
            'One person had to jump.',
            'They drew sticks to decide.',
            'He drew the short stick.'
          ]
        },
        {
          title: 'Train To City',
          context: 'A man took a train to a big city. On the return trip, he was overjoyed, but then suddenly committed suicide. The region was mountainous. Why?',
          hints: ['Medical', 'Temporary', 'Misunderstanding'],
          themeId: mysteryTheme.id,
          phrases: [
            'The man had been blind since birth.',
            'He traveled for a revolutionary operation.',
            'The operation successfully restored his sight.',
            'The train entered a dark mountain tunnel.',
            'He thought the operation had failed.',
            'He believed he had gone blind again.',
            'In despair, he took his own life.'
          ]
        },
        {
          title: 'Adam',
          context: 'An adventurer sees two bodies preserved in an iceberg. He gets closer and shouts, "It\'s Adam & Eve!". Why?',
          hints: ['Anatomical', 'Birth', 'Unaltered'],
          themeId: mysteryTheme.id,
          phrases: [
            'Adam and Eve were directly created.',
            'They were not born from a mother.',
            'They would not have navels.',
            'The adventurer saw the bodies lacked navels.'
          ]
        },
        {
          title: 'Blind Man',
          context: 'The world\'s smallest dwarf, who was blind, was found dead on a deserted street. Near him was sawdust. Why?',
          hints: ['Perception', 'Rival', 'Cane'],
          themeId: mysteryTheme.id,
          phrases: [
            'He was proud of his title.',
            'His rival was the second smallest dwarf.',
            'The rival was intensely jealous.',
            'The rival secretly sawed off his cane\'s end.',
            'The next day, he used his shortened cane.',
            'He felt taller than usual.',
            'He believed he had grown.',
            'Despairing over his lost title, he took his life.'
          ]
        },
        {
          title: 'Space Station',
          context: 'On a space station, an astronaut is found dead alone in his quarters. The airlock was sealed and there are no signs of struggle. Why?',
          hints: ['Experiment', 'Light', 'Automatic'],
          themeId: sciFiTheme.id,
          phrases: [
            'He was conducting crystal experiments.',
            'One crystal focused a beam of light.',
            'The beam concentrated sunlight.',
            'The light heated a pressurized container.',
            'The container exploded.',
            'A metal shard pierced the wall.',
            'The shard struck him while he slept.',
            'The explosion caused a hull breach.',
            'The breach triggered emergency sealing.'
          ]
        },
        {
          title: 'Library',
          context: 'A librarian is found dead in a locked, windowless library room. The key is in his pocket. Beside him is an old book and warm tea. Why?',
          hints: ['Ancient', 'Metal', 'Toxic'],
          themeId: mysteryTheme.id,
          phrases: [
            'He was studying a rare medieval book.',
            'The book\'s pages were preserved with mercury.',
            'Over centuries, the preservative became toxic.',
            'Turning pages made mercury particles airborne.',
            'The sealed room had no ventilation.',
            'He inhaled the accumulated mercury vapor.',
            'He was too absorbed to notice symptoms.',
            'He was slowly poisoned.'
          ]
        },
        {
          title: 'Ice',
          context: 'A meatpacking plant owner is found hanging three meters off the ground in a refrigerated room. The power is off, and there is a puddle of water below him. Why?',
          hints: ['Issue', 'Block', 'Slow'],
          themeId: mysteryTheme.id,
          phrases: [
            'The owner was facing business problems.',
            'He stood on a massive block of ice.',
            'He tied a noose around his neck.',
            'He attached the rope to the ceiling.',
            'The ice block slowly melted away.'
          ]
        },
        {
          title: 'Island',
          context: 'A month after a shipwreck, four survivors are found on an island. Two have one arm missing, one is missing an arm and a leg, and the fourth is whole. Why?',
          hints: ['Profession', 'Sacrifice', 'Resources'],
          themeId: adventureTheme.id,
          phrases: [
            'They arrived on the island intact.',
            'They ran out of food.',
            'They resorted to cannibalism to survive.',
            'One survivor was a doctor.',
            'The doctor amputated limbs for food.',
            'They drew lots to decide whose limb.',
            'The doctor needed his arms to operate.',
            'So they took the doctor\'s leg instead.'
          ]
        },
        {
          title: 'Light Flicker',
          context: 'A man runs down a hallway with a piece of paper. The lights flicker. He immediately turns around and walks away slowly. Why?',
          hints: ['Professional', 'Paper', 'Event'],
          themeId: mysteryTheme.id,
          phrases: [
            'The man was a lawyer in a prison.',
            'He was rushing to deliver a document.',
            'The document would cancel an execution.',
            'The execution was by electric chair.',
            'An electric chair causes a power surge.',
            'The flickering lights signaled the execution.',
            'He knew he was too late.'
          ]
        },
        {
          title: 'Pheasant',
          context: 'A couple orders pheasant at a restaurant. The man takes one bite and faints. Why?',
          hints: ['Traumatic', 'Fooled', 'Meat'],
          themeId: mysteryTheme.id,
          phrases: [
            'The man was a shipwreck survivor.',
            'On the island, his wife disappeared.',
            'Other survivors returned with strange meat.',
            'They claimed it was pheasant.',
            'He ate the meat they brought.',
            'He was now tasting real pheasant.',
            'He realized the island meat was different.',
            'He understood he had eaten his wife.'
          ]
        },
        {
          title: 'Call',
          context: 'Every day at the same time, a man gets home, calls another man, and they hang up without a word. Why?',
          hints: ['Noise', 'Non-verbal', 'Neighbors'],
          themeId: mysteryTheme.id,
          phrases: [
            'His neighbor is a musician.',
            'They have a pre-arranged agreement.',
            'The musician stops practicing when he gets home.',
            'The silent phone call is the signal.'
          ]
        },
        {
          title: 'Radio',
          context: 'A man is listening to music in his car when it suddenly rewinds. He takes out a gun and kills himself. Why?',
          hints: ['Profession', 'Alibi', 'Technical'],
          themeId: mysteryTheme.id,
          phrases: [
            'The man was a radio host.',
            'He had just murdered his wife.',
            'His alibi was a pre-recorded music show.',
            'The show was airing at that moment.',
            'He was listening to his own broadcast.',
            'He heard the recording glitch and rewind.',
            'He knew his alibi was exposed.'
          ]
        },
        {
          title: 'Jungle',
          context: 'A man is rescued from the jungle, seemingly insane. He has a wound on his arm and dirty fingernails. A hut is found nearby. Why?',
          hints: ['Not alone', 'Unconscious', 'Recurring'],
          themeId: mysteryTheme.id,
          phrases: [
            'He was lost in the jungle with a friend.',
            'His friend died.',
            'He tried to bury his friend.',
            'His shovel broke, so he used his hands.',
            'The man is a sleepwalker.',
            'At night, he unconsciously digs up the body.',
            'He brings the corpse back into the hut.',
            'Each morning, he wakes up terrified.',
            'He finds the corpse beside him daily.',
            'He has no memory of the event.'
          ]
        },
        {
          title: 'Watchman',
          context: 'A watchman tells his boss: "Boss, don\'t take your usual road home." The next day, the boss fires him. Why?',
          hints: ['Words', 'Job', 'Irrelevant'],
          themeId: mysteryTheme.id,
          phrases: [
            'He is a night watchman.',
            'Last night the watchman dreamt of a landslide.',
            'The road the boss takes home was the one in the dream.',
            'He implicitly confessed to sleeping on the job.',
            'He was fired for neglecting his duty.'
          ]
        },
        {
          title: 'Light',
          context: 'A man turns off a light, goes to a bar, sees a TV report, returns home, turns on the light, and commits suicide. Why?',
          hints: ['Important', 'Job', 'Fatal'],
          themeId: mysteryTheme.id,
          phrases: [
            'The man was a lighthouse keeper.',
            'He irresponsibly turned off the beacon.',
            'The TV news reported a shipwreck.',
            'The ship crashed on nearby reefs.',
            'He realized the accident was his fault.',
            'Consumed by guilt, he took his life.'
          ]
        },
        {
          title: 'Phone',
          context: 'A man jumps from the 10th floor to kill himself. Halfway down, he hears a telephone ring and instantly regrets his decision. Why?',
          hints: ['Assumption', 'Sign', 'Global'],
          themeId: sciFiTheme.id,
          phrases: [
            'A global catastrophe had occurred.',
            'He believed he was the last human alive.',
            'He was overwhelmed by loneliness.',
            'The ringing phone meant someone else survived.',
            'He was no longer alone.'
          ]
        },
        {
          title: 'Lighter',
          context: 'A man lights a lighter, looks to his side, and dies. Why?',
          hints: ['Plan', 'Not alone', 'Dead'],
          themeId: mysteryTheme.id,
          phrases: [
            'The man was a prisoner.',
            'His escape plan involved a coffin.',
            'He had an agreement with the gravedigger.',
            'The gravedigger would dig him up later.',
            'He hid inside a coffin next to a corpse.',
            'The coffin was buried.',
            'He lit his lighter to see the body.',
            'The dead man was the gravedigger.'
          ]
        },
        {
          title: 'Three',
          context: 'In a boarding house live a dentist student, a medical student, a woman, and a blind man. After the woman showers, something happens, she is horrified and becomes a recluse. That same day, the others start their careers. Why?',
          hints: ['Good news', 'Wrong assumptions', 'Final downfall'],
          themeId: mysteryTheme.id,
          phrases: [
            'The dentist knocked to announce his graduation.',
            'She answered the door in a towel.',
            'The doctor knocked to announce his graduation.',
            'She answered again in a towel.',
            'A third knock came.',
            'Assuming it was the blind man, she answered naked.',
            'It was the formerly blind man.',
            'He announced his sight was just restored.'
          ]
        }
      ]

  // Create all stories
  for (const storyData of stories) {
    await prisma.story.create({
      data: {
        title: storyData.title,
        context: storyData.context,
        hints: storyData.hints,
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