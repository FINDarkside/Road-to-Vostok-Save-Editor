export type TraderKey = 'generalist' | 'doctor' | 'gunsmith' | 'grandma'

export interface QuestItem {
  name: string
  count: number
}

export interface QuestDef {
  trader: TraderKey
  name: string
  difficulty: 'Easy' | 'Intermediate' | 'Hard'
  isTutorial: boolean
  order: number
  deliver: QuestItem[]
  receive: QuestItem[]
  rewardKeys: string[]
}

export interface TraderDef {
  key: TraderKey
  displayName: string
}

export const TRADERS: TraderDef[] = [
  { key: 'generalist', displayName: 'Generalist' },
  { key: 'doctor', displayName: 'Doctor' },
  { key: 'gunsmith', displayName: 'Gunsmith' },
  { key: 'grandma', displayName: 'Grandma' }
]

export const QUESTS: QuestDef[] = [
  // Doctor quests
  {
    trader: 'doctor',
    name: 'Nasty Draft',
    difficulty: 'Easy',
    isTutorial: false,
    order: 1,
    deliver: [{ name: 'Duct Tape', count: 1 }],
    receive: [{ name: 'Tissues', count: 1 }],
    rewardKeys: []
  },
  {
    trader: 'doctor',
    name: 'Steady Hands',
    difficulty: 'Easy',
    isTutorial: false,
    order: 2,
    deliver: [{ name: 'Cigars', count: 1 }],
    receive: [{ name: 'Thermal Blanket', count: 1 }],
    rewardKeys: []
  },
  {
    trader: 'doctor',
    name: 'Bookworm',
    difficulty: 'Easy',
    isTutorial: false,
    order: 3,
    deliver: [
      { name: 'Book (Children)', count: 1 },
      { name: 'Book (Cooking)', count: 1 },
      { name: 'Book (Fishing)', count: 1 },
      { name: 'Book (Religion)', count: 1 }
    ],
    receive: [{ name: 'Cabinet (Medical)', count: 1 }],
    rewardKeys: []
  },
  {
    trader: 'doctor',
    name: 'Dice Master',
    difficulty: 'Easy',
    isTutorial: false,
    order: 4,
    deliver: [{ name: 'Board Game', count: 1 }],
    receive: [
      { name: 'Locker', count: 1 },
      { name: 'Trolley (Tall)', count: 1 }
    ],
    rewardKeys: []
  },
  {
    trader: 'doctor',
    name: 'Night Surgery',
    difficulty: 'Intermediate',
    isTutorial: false,
    order: 5,
    deliver: [
      { name: 'Polaris', count: 1 },
      { name: 'Batteries', count: 1 }
    ],
    receive: [{ name: 'Energy Drink', count: 1 }],
    rewardKeys: []
  },
  {
    trader: 'doctor',
    name: 'Infections',
    difficulty: 'Intermediate',
    isTutorial: false,
    order: 6,
    deliver: [
      { name: 'Antiseptic', count: 1 },
      { name: 'Antibiotics', count: 1 }
    ],
    receive: [
      { name: 'Bandage', count: 1 },
      { name: 'Painkill.', count: 1 },
      { name: 'Rags', count: 1 }
    ],
    rewardKeys: []
  },
  {
    trader: 'doctor',
    name: 'Hypovolemia',
    difficulty: 'Intermediate',
    isTutorial: false,
    order: 7,
    deliver: [{ name: 'Saline', count: 3 }],
    receive: [{ name: 'Water Lock', count: 1 }],
    rewardKeys: []
  },
  {
    trader: 'doctor',
    name: 'Mouth Organ',
    difficulty: 'Hard',
    isTutorial: false,
    order: 8,
    deliver: [{ name: 'Harmonica', count: 1 }],
    receive: [{ name: 'Medkit', count: 3 }],
    rewardKeys: []
  },
  {
    trader: 'doctor',
    name: 'Patient Report',
    difficulty: 'Hard',
    isTutorial: false,
    order: 9,
    deliver: [{ name: 'Patient Report', count: 1 }],
    receive: [
      { name: 'AFAK', count: 1 },
      { name: 'Poster (Posture)', count: 1 }
    ],
    rewardKeys: []
  },
  {
    trader: 'doctor',
    name: 'Substance',
    difficulty: 'Hard',
    isTutorial: false,
    order: 10,
    deliver: [{ name: 'Oil Sample', count: 3 }],
    receive: [{ name: 'Classroom Key', count: 1 }],
    rewardKeys: ['Key_Classroom']
  },

  // Generalist quests
  {
    trader: 'generalist',
    name: 'Prime Time',
    difficulty: 'Easy',
    isTutorial: false,
    order: 1,
    deliver: [{ name: 'Toilet Paper', count: 1 }],
    receive: [{ name: 'Television', count: 1 }],
    rewardKeys: []
  },
  {
    trader: 'generalist',
    name: 'Bad Habits',
    difficulty: 'Easy',
    isTutorial: false,
    order: 2,
    deliver: [
      { name: 'Cigarettes', count: 1 },
      { name: 'Matches', count: 1 }
    ],
    receive: [{ name: 'Alarm Clock', count: 1 }],
    rewardKeys: []
  },
  {
    trader: 'generalist',
    name: 'Backpains',
    difficulty: 'Easy',
    isTutorial: false,
    order: 3,
    deliver: [
      { name: 'Pillow', count: 1 },
      { name: 'Lotion', count: 1 },
      { name: 'Painkill.', count: 1 }
    ],
    receive: [
      { name: 'Narva', count: 1 },
      { name: 'Batteries', count: 1 }
    ],
    rewardKeys: []
  },
  {
    trader: 'generalist',
    name: 'Coffee Reserve',
    difficulty: 'Easy',
    isTutorial: false,
    order: 4,
    deliver: [
      { name: 'Coffee', count: 1 },
      { name: 'Coffee Filter', count: 1 }
    ],
    receive: [
      { name: 'Map', count: 1 },
      { name: 'Mess Kit', count: 1 },
      { name: 'Water Bottle', count: 1 }
    ],
    rewardKeys: []
  },
  {
    trader: 'generalist',
    name: 'Sweaty Business',
    difficulty: 'Intermediate',
    isTutorial: false,
    order: 5,
    deliver: [
      { name: 'Deodorant', count: 1 },
      { name: 'Wipes', count: 1 }
    ],
    receive: [
      { name: 'Fishing Vest', count: 1 },
      { name: 'Fishing Rod', count: 1 },
      { name: 'Tackle Box', count: 1 },
      { name: 'Jaeger 140', count: 1 }
    ],
    rewardKeys: []
  },
  {
    trader: 'generalist',
    name: 'Handyman',
    difficulty: 'Intermediate',
    isTutorial: false,
    order: 6,
    deliver: [
      { name: 'Lumber', count: 1 },
      { name: 'Toolbox', count: 1 },
      { name: 'Bucket', count: 1 },
      { name: 'Duct Tape', count: 1 },
      { name: 'Nails', count: 1 }
    ],
    receive: [
      { name: 'Table (Office)', count: 1 },
      { name: 'Cabinet (Office)', count: 1 },
      { name: 'Chair (Office)', count: 1 },
      { name: 'Carpet (Persian)', count: 1 }
    ],
    rewardKeys: []
  },
  {
    trader: 'generalist',
    name: 'Six Pack',
    difficulty: 'Hard',
    isTutorial: false,
    order: 7,
    deliver: [{ name: 'Beer', count: 6 }],
    receive: [
      { name: 'Mosin', count: 1 },
      { name: 'PU Scope', count: 1 },
      { name: '7.62x54R', count: 3 }
    ],
    rewardKeys: []
  },
  {
    trader: 'generalist',
    name: 'Old Friend',
    difficulty: 'Hard',
    isTutorial: false,
    order: 8,
    deliver: [
      { name: 'KP-31', count: 1 },
      { name: 'KP-31 Drum', count: 1 }
    ],
    receive: [
      { name: 'M78', count: 1 },
      { name: 'M78 Magazine', count: 1 },
      { name: '.308', count: 1 }
    ],
    rewardKeys: []
  },
  {
    trader: 'generalist',
    name: 'Road Trip',
    difficulty: 'Hard',
    isTutorial: false,
    order: 9,
    deliver: [
      { name: 'Battery', count: 1 },
      { name: 'Battery Cables', count: 1 },
      { name: 'Inverter', count: 1 },
      { name: 'Jerry Can', count: 1 },
      { name: 'Oil Filter', count: 1 }
    ],
    receive: [
      { name: 'Casette Player', count: 1 },
      { name: 'Casette (Radio Hits)', count: 1 }
    ],
    rewardKeys: []
  },
  {
    trader: 'generalist',
    name: 'Homemade',
    difficulty: 'Hard',
    isTutorial: false,
    order: 10,
    deliver: [{ name: 'Kilju', count: 1 }],
    receive: [{ name: 'Attic Key', count: 1 }],
    rewardKeys: ['Key_Attic']
  },

  // Generalist tutorial quests
  {
    trader: 'generalist',
    name: 'Tutorial Task 1 (Simple)',
    difficulty: 'Easy',
    isTutorial: true,
    order: 1,
    deliver: [{ name: 'Canned Pea Soup', count: 1 }],
    receive: [{ name: 'Potato', count: 1 }],
    rewardKeys: []
  },
  {
    trader: 'generalist',
    name: 'Tutorial Task 2 (Complex)',
    difficulty: 'Intermediate',
    isTutorial: true,
    order: 2,
    deliver: [{ name: 'Meatballs (Cooked)', count: 1 }],
    receive: [{ name: 'Potato', count: 1 }],
    rewardKeys: []
  },
  {
    trader: 'generalist',
    name: 'Tutorial Task 3 (Furniture)',
    difficulty: 'Hard',
    isTutorial: true,
    order: 3,
    deliver: [{ name: 'Potato', count: 1 }],
    receive: [{ name: 'Fridge', count: 1 }],
    rewardKeys: []
  },

  // Gunsmith quests
  {
    trader: 'gunsmith',
    name: 'Bloodsuckers',
    difficulty: 'Easy',
    isTutorial: false,
    order: 1,
    deliver: [{ name: 'Mosquito Hat', count: 1 }],
    receive: [
      { name: 'RK Magazine', count: 1 },
      { name: '7.62x39', count: 1 }
    ],
    rewardKeys: []
  },
  {
    trader: 'gunsmith',
    name: 'Warm Meal',
    difficulty: 'Easy',
    isTutorial: false,
    order: 2,
    deliver: [
      { name: 'Pea Soup (Cooked)', count: 1 },
      { name: 'Mustard', count: 1 }
    ],
    receive: [
      { name: 'Crate (Military)', count: 1 },
      { name: 'Sleeping Bag', count: 1 }
    ],
    rewardKeys: []
  },
  {
    trader: 'gunsmith',
    name: 'Nordic Trade',
    difficulty: 'Intermediate',
    isTutorial: false,
    order: 3,
    deliver: [{ name: 'Snus', count: 3 }],
    receive: [{ name: 'M43', count: 3 }],
    rewardKeys: []
  },
  {
    trader: 'gunsmith',
    name: 'Big Blades',
    difficulty: 'Intermediate',
    isTutorial: false,
    order: 4,
    deliver: [
      { name: 'Skrama 200', count: 1 },
      { name: 'Skrama 240', count: 1 }
    ],
    receive: [
      { name: 'SSh-39 (II)', count: 1 },
      { name: 'Field Ration', count: 1 },
      { name: '.223', count: 1 },
      { name: '9x19', count: 1 }
    ],
    rewardKeys: []
  },
  {
    trader: 'gunsmith',
    name: 'Ammo Delivery',
    difficulty: 'Intermediate',
    isTutorial: false,
    order: 5,
    deliver: [
      { name: '4.6x30', count: 1 },
      { name: '9x39', count: 1 },
      { name: '7.62x54R', count: 1 }
    ],
    receive: [
      { name: 'LVPC (Winter)', count: 1 },
      { name: 'Armor Plate (IV)', count: 1 }
    ],
    rewardKeys: []
  },
  {
    trader: 'gunsmith',
    name: 'Weapon Delivery',
    difficulty: 'Intermediate',
    isTutorial: false,
    order: 6,
    deliver: [
      { name: 'KAS-74U', count: 1 },
      { name: 'KA-M', count: 1 },
      { name: 'KA-12', count: 1 }
    ],
    receive: [
      { name: 'Crate (Special)', count: 1 },
      { name: 'Target Stand', count: 1 }
    ],
    rewardKeys: []
  },
  {
    trader: 'gunsmith',
    name: 'Medic',
    difficulty: 'Hard',
    isTutorial: false,
    order: 7,
    deliver: [{ name: 'IFAK', count: 3 }],
    receive: [
      { name: 'KM18', count: 1 },
      { name: 'STANAG Magazine', count: 1 },
      { name: 'ATOG', count: 1 }
    ],
    rewardKeys: []
  },
  {
    trader: 'gunsmith',
    name: 'Home Collection',
    difficulty: 'Hard',
    isTutorial: false,
    order: 8,
    deliver: [
      { name: 'SSV', count: 1 },
      { name: 'SS Magazine', count: 1 }
    ],
    receive: [{ name: 'Weapon Repair Kit', count: 1 }],
    rewardKeys: []
  },
  {
    trader: 'gunsmith',
    name: "Everyman's Right",
    difficulty: 'Hard',
    isTutorial: false,
    order: 9,
    deliver: [{ name: 'PV7', count: 1 }],
    receive: [{ name: 'Sign (Border Zone)', count: 1 }],
    rewardKeys: []
  },
  {
    trader: 'gunsmith',
    name: 'Hitman',
    difficulty: 'Hard',
    isTutorial: false,
    order: 10,
    deliver: [{ name: 'Flame Beanie', count: 1 }],
    receive: [{ name: 'Bunker Key', count: 1 }],
    rewardKeys: ['Key_Bunker']
  }
]

// Quests grouped by trader, sorted by order, tutorial quests filtered out
export const QUESTS_BY_TRADER = new Map<TraderKey, QuestDef[]>()
for (const trader of TRADERS) {
  QUESTS_BY_TRADER.set(
    trader.key,
    QUESTS.filter((q) => q.trader === trader.key && !q.isTutorial).sort((a, b) => a.order - b.order)
  )
}
