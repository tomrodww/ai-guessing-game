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
      title: 'Elevator',
      context: 'A man who lives on the tenth floor of a building takes the elevator every day to go to work. When he returns, he takes the elevator to the seventh floor and then walks up the remaining three floors. Why does he do this?',
      hints: ['Think about physical limitations.', 'Consider what changes on rainy days.', 'The answer involves reaching something.'],
      themeId: mysteryTheme.id,
      phrases: [
        'The man is a person of very short stature.',
        'He can comfortably reach the ground floor button.',
        'When returning he can only reach the seventh floor button.',
        'He gets off at the seventh floor and walks up.',
        'On rainy days he uses his umbrella to reach the tenth floor button.'
      ]
    },
    {
      title: 'Scuba Diver',
      context: 'A man is found dead in a forest, wearing a full scuba diving suit. The forest is miles away from the nearest large body of water. How did he die?',
      hints: ['Think about emergency services.', 'Consider how water is transported.', 'The forest fire is key to the solution.'],
      themeId: adventureTheme.id,
      phrases: [
        'A forest fire had broken out in the area.',
        'A helicopter with a large water bucket was dispatched to fight the fire.',
        'The helicopter collected water from a nearby lake.',
        'A scuba diver was diving in that lake.',
        'The diver was accidentally scooped up along with the water.',
        'He was dropped over the burning forest.',
        'The diver died from the fall.'
      ]
    },
    {
      title: 'Interrupted Music',
      context: 'The music stopped. She died. What happened?',
      hints: ['The woman was performing a dangerous act.', 'She relied on sound for guidance.', 'The music was crucial for her safety.'],
      themeId: mysteryTheme.id,
      phrases: [
        'The woman was a tightrope walker in a circus.',
        'Her act was performed blindfolded.',
        'The live music was her cue for timing.',
        'The musician unexpectedly stopped playing.',
        'She lost her auditory guide.',
        'She misjudged her position and fell.',
        'She died from the fall.'
      ]
    },
    {
      title: 'Fortune',
      context: 'A man pushes his car. He stops at a hotel and is suddenly bankrupt. What happened?',
      hints: ['This is not a real car or hotel.', 'Think about board games.', 'The bankruptcy is part of a game.'],
      themeId: mysteryTheme.id,
      phrases: [
        'The man is playing a game of Monopoly.',
        'His game piece is the car token.',
        'He moves his car token around the board.',
        'He lands on a property with a hotel.',
        'The property is owned by another player.',
        'The rent is extremely high.',
        'He cannot afford to pay the rent.',
        'He goes bankrupt in the game.'
      ]
    },
    {
      title: 'Unconventional Cure',
      context: 'A man walks into a restaurant and asks the waiter for a glass of water. The waiter, after observing the man, points a revolver at him. The man thanks him and leaves. Why did the waiter do that?',
      hints: ['The man had a medical condition.', 'The waiter was trying to help.', 'A sudden shock can cure certain conditions.'],
      themeId: mysteryTheme.id,
      phrases: [
        'A man developed a case of the hiccups.',
        'He entered a restaurant hoping water would cure them.',
        'The waiter noticed the man was hiccuping.',
        'The waiter realized the man was not thirsty.',
        'The waiter decided to give him a sudden fright.',
        'The shock successfully stopped the hiccups.',
        'The man thanked the waiter and left.'
      ]
    },
    {
      title: 'Fallen Couple',
      context: 'Romeo & Juliet were found dead in a room with an open door and a window to the garden. Next to them was a puddle, stones, and shards of glass. How did Romeo & Juliet die?',
      hints: ['Romeo & Juliet are not human.', 'The glass shards are from their home.', 'A pet caused the accident.'],
      themeId: mysteryTheme.id,
      phrases: [
        'Romeo & Juliet were two pet fish.',
        'They lived in a fishbowl on a table.',
        'A cat entered the room.',
        'The cat knocked the fishbowl off the table.',
        'The fishbowl shattered on the floor.',
        'Romeo & Juliet died of asphyxiation out of water.'
      ]
    },
    {
      title: 'Short Straw',
      context: 'A naked man was found dead in the middle of a large desert. Next to him was a small stick. Why was he found dead in the desert in that manner?',
      hints: ['The stick was used for decision making.', 'He was not alone initially.', 'They needed to reduce weight urgently.'],
      themeId: adventureTheme.id,
      phrases: [
        'The man was traveling in a hot air balloon.',
        'Several other people were with him.',
        'The balloon began to lose altitude.',
        'This created a dangerous situation.',
        'They threw out all the sandbags to reduce weight.',
        'They threw out their clothes to reduce weight.',
        'The balloon continued to fall.',
        'They decided one person had to jump.',
        'They drew straws to choose who would sacrifice themselves.',
        'He drew the short straw and lost.'
      ]
    },
    {
      title: 'Lights\' Trick',
      context: 'He lived in a small town. One day, he took a train to a big city. On the return trip, also by train, he was overjoyed when suddenly, he committed suicide. The region between the two cities was mountainous. Why did he kill himself?',
      hints: ['He had a medical condition that was treated.', 'The mountains created a temporary situation.', 'He misunderstood what happened to him.'],
      themeId: mysteryTheme.id,
      phrases: [
        'The man had been blind since birth.',
        'He traveled to the big city for a revolutionary operation.',
        'The operation successfully restored his sight.',
        'On the train ride home he was ecstatic.',
        'He was finally able to see the world.',
        'The train entered a dark tunnel through the mountains.',
        'The sudden blackness made him think the operation had failed.',
        'He believed he had gone blind again.',
        'He was so devastated that he took his own life.'
      ]
    },
    {
      title: 'First Humans',
      context: 'An adventurer walking through the arctic sees two bodies perfectly preserved inside an iceberg. As he gets closer, he shouts, "It\'s them! I\'ve found Adam & Eve!" How was the young man so certain?',
      hints: ['The answer lies in a unique anatomical detail.', 'Think about how all other humans are born.', 'The bodies were complete and unaltered.'],
      themeId: mysteryTheme.id,
      phrases: [
        'According to biblical tradition Adam and Eve were created directly.',
        'They were not born from a mother.',
        'They would be the only humans to exist without navels.',
        'The adventurer noticed the bodies lacked navels.',
        'He drew his conclusion from this observation.'
      ]
    },
    {
      title: 'Matter of Pride',
      context: 'The world\'s smallest dwarf was found dead on a deserted street. Near him was sawdust. Why did he kill himself? Detail: the dwarf was blind.',
      hints: ['His death was caused by a false perception.', 'His rival\'s jealousy was the root cause.', 'The sawdust is a clue to the sabotage.'],
      themeId: mysteryTheme.id,
      phrases: [
        'The world\'s smallest dwarf was immensely proud of his title.',
        'His rival was the second smallest dwarf.',
        'The rival was intensely jealous.',
        'The rival wanted to crush his spirit.',
        'The rival secretly sawed off the end of the blind dwarf\'s cane.',
        'The next day the blind dwarf used his shortened cane.',
        'He felt taller than usual.',
        'He believed he had grown and lost his title.',
        'He was consumed by despair.',
        'He took his own life.'
      ]
    },
    {
      title: 'Space Station',
      context: 'On a space station orbiting Earth, an astronaut is found dead in his quarters. The airlock was sealed, no one else was aboard, and there are no signs of struggle. How did he die?',
      hints: ['The death was caused by his own experiment.', 'Light and heat played a crucial role.', 'The automatic systems responded to an emergency.'],
      themeId: sciFiTheme.id,
      phrases: [
        'The astronaut was conducting crystallization experiments in zero gravity.',
        'One experimental crystal created a focused beam of light.',
        'The crystal was exposed to specific lighting conditions.',
        'The beam concentrated sunlight like a magnifying glass.',
        'The sunlight came from the observation window.',
        'The concentrated light heated a pressurized container.',
        'The container was in his lab.',
        'The container eventually exploded.',
        'A metal shard pierced through the wall.',
        'The shard went into his sleeping quarters.',
        'The shard struck him fatally while he slept.',
        'The explosion caused a hull breach.',
        'This triggered automatic emergency sealing.'
      ]
    },
    {
      title: 'Locked Room Library',
      context: 'A librarian is found dead in a locked library room with no windows. The door was locked from the inside, the key was in the dead man\'s pocket, and there was no other way in or out. Near him was an old leather book and a cup of tea that was still warm. How did he die?',
      hints: ['The book itself was dangerous.', 'Old preservation methods used toxic materials.', 'He was poisoned by something he touched and breathed.'],
      themeId: mysteryTheme.id,
      phrases: [
        'The librarian was studying a rare medieval book.',
        'The book was about ancient poisons.',
        'The book\'s pages had been preserved with mercury compounds.',
        'This was done centuries ago.',
        'Over time these preservatives became highly toxic.',
        'As he turned each page mercury particles became airborne.',
        'He had been working for hours in the sealed room.',
        'The room had no ventilation.',
        'The accumulated mercury vapor slowly poisoned him.',
        'He inhaled the mercury vapors.',
        'The mercury also entered through skin contact.',
        'He was too absorbed in research to notice symptoms.',
        'He did not recognize the poisoning until too late.'
      ]
    },
    {
      title: 'Melting Block',
      context: 'The owner of a large meatpacking plant is found dead inside one of his refrigerated rooms. He was found hanging by his neck, three meters off the ground. The refrigerator was off. A famous detective looked at the scene and a puddle of water below the body and said, "This was a suicide." How did the detective reach this conclusion?',
      hints: ['The water puddle is the key clue.', 'He created his own platform.', 'The refrigeration was turned off intentionally.'],
      themeId: mysteryTheme.id,
      phrases: [
        'The owner was facing personal and business problems.',
        'He decided to end his life in a unique way.',
        'He stood on top of a massive block of ice.',
        'He tied a noose around his neck.',
        'He tied the noose to the ceiling.',
        'He turned off the refrigeration unit.',
        'The ice block slowly melted.',
        'He was eventually left hanging.',
        'The puddle was all that remained of his platform.'
      ]
    },
    {
      title: 'Island Rules',
      context: 'A month after a shipwreck, four survivors were found on a deserted island. Two of them were missing one arm, another was missing an arm and a leg, and the fourth had all his limbs. Why were they found in this state?',
      hints: ['They were not injured during the shipwreck.', 'One survivor\'s profession was crucial.', 'The missing limbs were a necessary sacrifice.'],
      themeId: adventureTheme.id,
      phrases: [
        'The four survivors arrived on the island intact after the shipwreck.',
        'They ran out of food as time passed.',
        'They resorted to cannibalism to survive.',
        'One of the survivors was a doctor.',
        'They decided to amputate limbs for food.',
        'The doctor performed the procedures to ensure their survival.',
        'They drew lots to decide whose limb would be taken.',
        'When it was the doctor\'s turn they spared his arms.',
        'The doctor needed his arms to continue operating.',
        'They took the doctor\'s leg instead.',
        'Rescue arrived soon after.'
      ]
    },
    {
      title: 'Flicker of Doom',
      context: 'A man is running down a hallway in the United States with a piece of paper in his hand when suddenly the lights flicker. The man\'s reaction is immediate; he turns around and walks away slowly. Why did he react this way?',
      hints: ['The location is a place of incarceration.', 'The paper was a document of reprieve.', 'The power surge signaled a final event.'],
      themeId: mysteryTheme.id,
      phrases: [
        'The man was a lawyer inside a prison.',
        'He was rushing to deliver a document.',
        'The document would cancel an execution.',
        'A prisoner on death row was about to be executed.',
        'The execution was scheduled at that very moment.',
        'The execution would happen by electric chair.',
        'An electric chair uses a massive amount of power.',
        'This causes the lights to flicker when activated.',
        'He saw the lights flicker.',
        'He knew he was too late.',
        'The prisoner was already dead.'
      ]
    },
    {
      title: 'Taste',
      context: 'A couple enters a restaurant, they sit down and order pheasant. The man puts the first bite in his mouth and faints. Why?',
      hints: ['The man had a traumatic past.', 'The taste triggered a horrifying memory.', 'His previous meal was a lie.'],
      themeId: mysteryTheme.id,
      phrases: [
        'This was the second time the man had eaten pheasant.',
        'The first time was years ago.',
        'He was a survivor of a shipwreck on a deserted island.',
        'His first wife had disappeared while looking for food.',
        'The other survivors returned with strange meat.',
        'They claimed the meat was pheasant.',
        'He ate the meat they brought.',
        'Now he was tasting real pheasant for the first time.',
        'He realized the island meat tasted completely different.',
        'He understood he had eaten his wife.'
      ]
    },
    {
      title: 'Silent Agreement',
      context: 'A man gets home at the same time every day, calls another man, and they both hang up without saying a word. Why?',
      hints: ['The call is about noise.', 'The two men are neighbors.', 'It\'s a non-verbal cue.'],
      themeId: mysteryTheme.id,
      phrases: [
        'The man has a neighbor who is a musician.',
        'They have a pre-arranged agreement.',
        'The musician stops practicing when the man gets home from work.',
        'This allows the man to rest.',
        'The daily silent phone call is the signal.',
        'The call tells the musician to stop playing.'
      ]
    },
    {
      title: 'Local Suspects',
      context: 'There was a bank robbery in a small town. Despite leaving no clues and wearing masks, the robbers were arrested an hour later. Why?',
      hints: ['The robbers had a very distinct shared trait.', 'The size of the town was a key factor.', 'The masks couldn\'t hide everything.'],
      themeId: mysteryTheme.id,
      phrases: [
        'The three robbers were brothers.',
        'It was a very small rural town.',
        'They were the only three dwarfs living there.',
        'Their unique physical characteristic made them suspects.',
        'They became the immediate and only suspects for the police.'
      ]
    },
    {
      title: 'Weather Vane',
      context: 'A man lives on the 16th floor of a building. On sunny days, he takes the stairs to his apartment. On rainy days, he takes the elevator. Why does he have this strange habit?',
      hints: ['His routine depends on an object he carries.', 'His physical stature presents a challenge.', 'The weather dictates his tool of choice.'],
      themeId: mysteryTheme.id,
      phrases: [
        'The man was a dwarf.',
        'He was too short to reach the button for the 16th floor.',
        'On rainy days he carried an umbrella.',
        'He could use the umbrella to reach the button.',
        'This allowed him to take the elevator.',
        'On sunny days he had no umbrella.',
        'He had no way to press the button.',
        'He was forced to take the stairs.'
      ]
    },
    {
      title: 'Alibi\'s Flaw',
      context: 'A man was in his car in traffic, listening to music, when the music started to rewind. He then took out a gun and killed himself. Why?',
      hints: ['The man\'s profession is crucial.', 'The music was his alibi.', 'A technical error sealed his fate.'],
      themeId: mysteryTheme.id,
      phrases: [
        'The man was a radio host.',
        'He had just murdered his wife.',
        'His alibi was a pre-recorded music show.',
        'The show was set to air at that exact time.',
        'This was meant to prove he was at the radio station working.',
        'While driving away he was listening to his own show.',
        'He wanted to confirm his alibi was working.',
        'He heard the recording glitch and rewind.',
        'He knew his alibi was exposed.',
        'He killed himself.'
      ]
    },
    {
      title: 'Nightly Ritual',
      context: 'A madman is rescued in the middle of the jungle. He has a wound on his arm and his fingernails are full of dirt. At the site where he was found, there was a hut built for two people. Why was the man found insane?',
      hints: ['He wasn\'t always alone.', 'He was not responsible for his nightly actions.', 'His insanity came from a recurring, unexplained horror.'],
      themeId: adventureTheme.id,
      phrases: [
        'Two men were lost in the jungle.',
        'One of them died.',
        'The survivor began to bury his friend.',
        'His shovel broke.',
        'He was forced to dig with his hands.',
        'The survivor was a sleepwalker.',
        'Every night he was tormented by his friend\'s death.',
        'He would sleepwalk and dig up the body.',
        'He would bring the corpse back into the hut.',
        'Each morning he would wake up terrified.',
        'He would find his dead friend beside him.',
        'He had no memory of how it happened.',
        'This repeated cycle drove him insane.'
      ]
    },
    {
      title: 'Sleeper\'s Confession',
      context: 'A gold mine owner worked every day and always saw the night watchman leaving his shift. One day, the watchman told him: "Boss, don\'t take your usual road home today. I dreamt last night that a landslide would fall on your car and you would die." The boss thanked him and went to work. The next day, upon seeing the watchman again, he fired him. Why?',
      hints: ['The reason for dismissal is in the watchman\'s own words.', 'Consider the responsibilities of a night watchman.', 'The dream itself is irrelevant.'],
      themeId: mysteryTheme.id,
      phrases: [
        'The watchman\'s job was to be awake all night.',
        'He was supposed to guard the premises.',
        'He told his boss he had a dream last night.',
        'This inadvertently confessed to sleeping on the job.',
        'The boss fired him for failing to perform his duties.'
      ]
    },
    {
      title: 'Darkened Beacon',
      context: 'A man turns off a light and leaves home for a beer at the bar. He sees something on TV, returns home, turns on the light, and commits suicide. Why?',
      hints: ['The "light" was of great importance to others.', 'His home was also his workplace.', 'A news report revealed his fatal error.'],
      themeId: mysteryTheme.id,
      phrases: [
        'The man was a lighthouse keeper.',
        'He believed no more ships were due that night.',
        'He irresponsibly turned off the lighthouse beacon.',
        'He went to a bar.',
        'At the bar a news report came on the TV.',
        'The report announced a ship had crashed on the nearby reefs.',
        'The man realized the accident was his fault.',
        'The light was out when the ship crashed.',
        'He rushed back home.',
        'He turned the light back on to prevent more accidents.',
        'He was consumed by guilt.',
        'He took his own life.'
      ]
    },
    {
      title: 'Last Survivor',
      context: 'A man is on the 10th floor of a building when he jumps, intending to kill himself. In the middle of his fall, around the 5th floor, he hears a telephone ringing. At that moment, he regrets his decision. Why did he regret it?',
      hints: ['His decision was based on a false assumption.', 'The sound he heard was a sign of life.', 'He thought humanity had ended.'],
      themeId: sciFiTheme.id,
      phrases: [
        'A global catastrophe had occurred.',
        'The man believed he was the last human being alive on Earth.',
        'He was overwhelmed by loneliness.',
        'He decided to end his life.',
        'He heard the telephone ring.',
        'He realized someone else had survived.',
        'He was no longer alone.',
        'This caused him to instantly regret his jump.'
      ]
    },
    {
      title: 'Coffin Companion',
      context: 'A man lights a lighter, looks to his side, and dies.',
      hints: ['The man was trying to escape.', 'He was not alone in the box.', 'His only hope for rescue was dead.'],
      themeId: mysteryTheme.id,
      phrases: [
        'A man was in prison.',
        'He devised an escape plan.',
        'He would hide in the coffin of the next prisoner who died.',
        'He had an agreement with the prison gravedigger.',
        'The gravedigger would dig him up later that night.',
        'A prisoner died.',
        'The man snuck into the mortuary.',
        'He hid inside the coffin next to the body.',
        'The coffin was closed and buried as planned.',
        'He was lying in the darkness.',
        'He became curious about who was in the coffin with him.',
        'He lit his lighter.',
        'He saw the face of the dead man beside him.',
        'It was the gravedigger.'
      ]
    },
    {
      title: 'Third Knock',
      context: 'In a four-story boarding house lived a dentist, a doctor, a woman, and a blind man. The woman took a shower and was horrified, never leaving her house again. On that same day, the others all started their careers. Why?',
      hints: ['Three people received good news that day.', 'The woman made a series of assumptions.', 'Her final assumption was her downfall.'],
      themeId: mysteryTheme.id,
      phrases: [
        'The dentist and doctor were not yet qualified.',
        'The blind man had not yet been cured.',
        'The woman was in the shower.',
        'The dentist knocked announcing he had just graduated.',
        'She answered in a towel.',
        'Minutes later the doctor knocked.',
        'He announced he had also just graduated.',
        'She again answered in a towel.',
        'The doorbell rang a third time.',
        'She assumed it was the blind man.',
        'She answered the door completely naked.',
        'It was the formerly blind man.',
        'He announced his sight had just been restored.',
        'She was so mortified she became a recluse.'
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