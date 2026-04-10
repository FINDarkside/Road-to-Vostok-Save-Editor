import type { GameItem, ResolvedItemMeta } from '../lib/types'

export const ITEMS = [
  {
    category: 'Ammo',
    id: 'Ammo_12x70',
    displayName: 'Ammo 12x70',
    resourcePath: 'res://Items/Ammo/Ammo_12x70/Ammo_12x70.tres',
    stackable: true,
    showAmount: true,
    defaultAmount: 10,
    maxAmount: 300
  },
  {
    category: 'Ammo',
    id: 'Ammo_223',
    displayName: 'Ammo 223',
    resourcePath: 'res://Items/Ammo/Ammo_223/Ammo_223.tres',
    stackable: true,
    showAmount: true,
    defaultAmount: 50,
    maxAmount: 300
  },
  {
    category: 'Ammo',
    id: 'Ammo_308',
    displayName: 'Ammo 308',
    resourcePath: 'res://Items/Ammo/Ammo_308/Ammo_308.tres',
    stackable: true,
    showAmount: true,
    defaultAmount: 50,
    maxAmount: 300
  },
  {
    category: 'Ammo',
    id: 'Ammo_45ACP',
    displayName: 'Ammo 45ACP',
    resourcePath: 'res://Items/Ammo/Ammo_45ACP/Ammo_45ACP.tres',
    stackable: true,
    showAmount: true,
    defaultAmount: 50,
    maxAmount: 300
  },
  {
    category: 'Ammo',
    id: 'Ammo_46x30',
    displayName: 'Ammo 46x30',
    resourcePath: 'res://Items/Ammo/Ammo_46x30/Ammo_46x30.tres',
    stackable: true,
    showAmount: true,
    defaultAmount: 50,
    maxAmount: 300
  },
  {
    category: 'Ammo',
    id: 'Ammo_545x39',
    displayName: 'Ammo 545x39',
    resourcePath: 'res://Items/Ammo/Ammo_545x39/Ammo_545x39.tres',
    stackable: true,
    showAmount: true,
    defaultAmount: 50,
    maxAmount: 300
  },
  {
    category: 'Ammo',
    id: 'Ammo_762x39',
    displayName: 'Ammo 762x39',
    resourcePath: 'res://Items/Ammo/Ammo_762x39/Ammo_762x39.tres',
    stackable: true,
    showAmount: true,
    defaultAmount: 50,
    maxAmount: 300
  },
  {
    category: 'Ammo',
    id: 'Ammo_762x54R',
    displayName: 'Ammo 762x54R',
    resourcePath: 'res://Items/Ammo/Ammo_762x54R/Ammo_762x54R.tres',
    stackable: true,
    showAmount: true,
    defaultAmount: 50,
    maxAmount: 300
  },
  {
    category: 'Ammo',
    id: 'Ammo_9x18',
    displayName: 'Ammo 9x18',
    resourcePath: 'res://Items/Ammo/Ammo_9x18/Ammo_9x18.tres',
    stackable: true,
    showAmount: true,
    defaultAmount: 50,
    maxAmount: 300
  },
  {
    category: 'Ammo',
    id: 'Ammo_9x19',
    displayName: 'Ammo 9x19',
    resourcePath: 'res://Items/Ammo/Ammo_9x19/Ammo_9x19.tres',
    stackable: true,
    showAmount: true,
    defaultAmount: 50,
    maxAmount: 300
  },
  {
    category: 'Ammo',
    id: 'Ammo_9x39',
    displayName: 'Ammo 9x39',
    resourcePath: 'res://Items/Ammo/Ammo_9x39/Ammo_9x39.tres',
    stackable: true,
    showAmount: true,
    defaultAmount: 50,
    maxAmount: 300
  },
  {
    category: 'Armor',
    id: 'Armor_Plate_II',
    displayName: 'Armor Plate II',
    resourcePath: 'res://Items/Armor/Armor_Plate_II.tres',
    showCondition: true
  },
  {
    category: 'Armor',
    id: 'Armor_Plate_III',
    displayName: 'Armor Plate III',
    resourcePath: 'res://Items/Armor/Armor_Plate_III.tres',
    showCondition: true
  },
  {
    category: 'Armor',
    id: 'Armor_Plate_III+',
    displayName: 'Armor Plate III+',
    resourcePath: 'res://Items/Armor/Armor_Plate_III+.tres',
    showCondition: true
  },
  {
    category: 'Armor',
    id: 'Armor_Plate_IIIA',
    displayName: 'Armor Plate IIIA',
    resourcePath: 'res://Items/Armor/Armor_Plate_IIIA.tres',
    showCondition: true
  },
  {
    category: 'Armor',
    id: 'Armor_Plate_IV',
    displayName: 'Armor Plate IV',
    resourcePath: 'res://Items/Armor/Armor_Plate_IV.tres',
    showCondition: true
  },
  {
    category: 'Attachments',
    id: 'ACOG',
    displayName: 'ACOG',
    resourcePath: 'res://Items/Attachments/ACOG/ACOG.tres'
  },
  {
    category: 'Attachments',
    id: 'ANPEQ',
    displayName: 'ANPEQ',
    resourcePath: 'res://Items/Attachments/ANPEQ/ANPEQ.tres'
  },
  {
    category: 'Attachments',
    id: 'EXPS',
    displayName: 'EXPS',
    resourcePath: 'res://Items/Attachments/EXPS/EXPS.tres'
  },
  {
    category: 'Attachments',
    id: 'HMR',
    displayName: 'HMR',
    resourcePath: 'res://Items/Attachments/HMR/HMR.tres'
  },
  {
    category: 'Attachments',
    id: 'Hybrid',
    displayName: 'Hybrid',
    resourcePath: 'res://Items/Attachments/Hybrid/Hybrid.tres'
  },
  {
    category: 'Attachments',
    id: 'Kobra',
    displayName: 'Kobra',
    resourcePath: 'res://Items/Attachments/Kobra/Kobra.tres'
  },
  {
    category: 'Attachments',
    id: 'Leopard',
    displayName: 'Leopard',
    resourcePath: 'res://Items/Attachments/Leopard/Leopard.tres'
  },
  {
    category: 'Attachments',
    id: 'Micro',
    displayName: 'Micro',
    resourcePath: 'res://Items/Attachments/Micro/Micro.tres'
  },
  {
    category: 'Attachments',
    id: 'Monster',
    displayName: 'Monster',
    resourcePath: 'res://Items/Attachments/Monster/Monster.tres'
  },
  {
    category: 'Attachments',
    id: 'MRO',
    displayName: 'MRO',
    resourcePath: 'res://Items/Attachments/MRO/MRO.tres'
  },
  {
    category: 'Attachments',
    id: 'Navy',
    displayName: 'Navy',
    resourcePath: 'res://Items/Attachments/Navy/Navy.tres'
  },
  {
    category: 'Attachments',
    id: 'OZ5',
    displayName: 'OZ5',
    resourcePath: 'res://Items/Attachments/OZ5/OZ5.tres'
  },
  {
    category: 'Attachments',
    id: 'PBS',
    displayName: 'PBS',
    resourcePath: 'res://Items/Attachments/PBS/PBS.tres'
  },
  {
    category: 'Attachments',
    id: 'POSP',
    displayName: 'POSP',
    resourcePath: 'res://Items/Attachments/POSP/POSP.tres'
  },
  {
    category: 'Attachments',
    id: 'PRO',
    displayName: 'PRO',
    resourcePath: 'res://Items/Attachments/PRO/PRO.tres'
  },
  {
    category: 'Attachments',
    id: 'PTN',
    displayName: 'PTN',
    resourcePath: 'res://Items/Attachments/PTN/PTN.tres'
  },
  {
    category: 'Attachments',
    id: 'PU',
    displayName: 'PU',
    resourcePath: 'res://Items/Attachments/PU/PU.tres'
  },
  {
    category: 'Attachments',
    id: 'Rider',
    displayName: 'Rider',
    resourcePath: 'res://Items/Attachments/Rider/Rider.tres'
  },
  {
    category: 'Attachments',
    id: 'RMR',
    displayName: 'RMR',
    resourcePath: 'res://Items/Attachments/RMR/RMR.tres'
  },
  {
    category: 'Attachments',
    id: 'Salvo',
    displayName: 'Salvo',
    resourcePath: 'res://Items/Attachments/Salvo/Salvo.tres'
  },
  {
    category: 'Attachments',
    id: 'SOCOM',
    displayName: 'SOCOM',
    resourcePath: 'res://Items/Attachments/SOCOM/SOCOM.tres'
  },
  {
    category: 'Attachments',
    id: 'SRO',
    displayName: 'SRO',
    resourcePath: 'res://Items/Attachments/SRO/SRO.tres'
  },
  {
    category: 'Attachments',
    id: 'Thor',
    displayName: 'Thor',
    resourcePath: 'res://Items/Attachments/Thor/Thor.tres'
  },
  {
    category: 'Attachments',
    id: 'Vudu',
    displayName: 'Vudu',
    resourcePath: 'res://Items/Attachments/Vudu/Vudu.tres'
  },
  {
    category: 'Backpacks',
    id: 'Backpack_Jaeger_Black',
    displayName: 'Backpack Jaeger Black',
    resourcePath: 'res://Items/Backpacks/Backpack_Jaeger/Backpack_Jaeger_Black.tres'
  },
  {
    category: 'Backpacks',
    id: 'Backpack_Jaeger_Brown',
    displayName: 'Backpack Jaeger Brown',
    resourcePath: 'res://Items/Backpacks/Backpack_Jaeger/Backpack_Jaeger_Brown.tres'
  },
  {
    category: 'Backpacks',
    id: 'Backpack_Jaeger_Green',
    displayName: 'Backpack Jaeger Green',
    resourcePath: 'res://Items/Backpacks/Backpack_Jaeger/Backpack_Jaeger_Green.tres'
  },
  {
    category: 'Backpacks',
    id: 'Backpack_Jaeger_M05',
    displayName: 'Backpack Jaeger M05',
    resourcePath: 'res://Items/Backpacks/Backpack_Jaeger/Backpack_Jaeger_M05.tres'
  },
  {
    category: 'Backpacks',
    id: 'Backpack_Nomad',
    displayName: 'Backpack Nomad',
    resourcePath: 'res://Items/Backpacks/Backpack_Nomad/Backpack_Nomad.tres'
  },
  {
    category: 'Backpacks',
    id: 'Backpack_Patrol',
    displayName: 'Backpack Patrol',
    resourcePath: 'res://Items/Backpacks/Backpack_Patrol/Backpack_Patrol.tres'
  },
  {
    category: 'Backpacks',
    id: 'Duffel_Retro',
    displayName: 'Duffel Retro',
    resourcePath: 'res://Items/Backpacks/Duffel_Retro/Duffel_Retro.tres'
  },
  {
    category: 'Belts',
    id: 'Kukkaro_Black',
    displayName: 'Kukkaro Black',
    resourcePath: 'res://Items/Belts/Kukkaro/Kukkaro_Black.tres'
  },
  {
    category: 'Belts',
    id: 'Kukkaro_Brown',
    displayName: 'Kukkaro Brown',
    resourcePath: 'res://Items/Belts/Kukkaro/Kukkaro_Brown.tres'
  },
  {
    category: 'Belts',
    id: 'Kukkaro_Green',
    displayName: 'Kukkaro Green',
    resourcePath: 'res://Items/Belts/Kukkaro/Kukkaro_Green.tres'
  },
  {
    category: 'Belts',
    id: 'Kukkaro_M05',
    displayName: 'Kukkaro M05',
    resourcePath: 'res://Items/Belts/Kukkaro/Kukkaro_M05.tres'
  },
  {
    category: 'Books',
    id: 'Book_Children',
    displayName: 'Book Children',
    resourcePath: 'res://Items/Books/Book_Children.tres'
  },
  {
    category: 'Books',
    id: 'Book_Cooking',
    displayName: 'Book Cooking',
    resourcePath: 'res://Items/Books/Book_Cooking.tres'
  },
  {
    category: 'Books',
    id: 'Book_Fishing',
    displayName: 'Book Fishing',
    resourcePath: 'res://Items/Books/Book_Fishing.tres'
  },
  {
    category: 'Books',
    id: 'Book_Religion',
    displayName: 'Book Religion',
    resourcePath: 'res://Items/Books/Book_Religion.tres'
  },
  {
    category: 'Clothing',
    id: 'Beanie_Flame',
    displayName: 'Beanie Flame',
    resourcePath: 'res://Items/Clothing/Beanie_Flame/Beanie_Flame.tres'
  },
  {
    category: 'Clothing',
    id: 'Boots_Combat',
    displayName: 'Boots Combat',
    resourcePath: 'res://Items/Clothing/Boots_Combat/Boots_Combat.tres'
  },
  {
    category: 'Clothing',
    id: 'Cap_M62',
    displayName: 'Cap M62',
    resourcePath: 'res://Items/Clothing/Cap_M62/Cap_M62.tres'
  },
  {
    category: 'Clothing',
    id: 'Fleece_Tactical_Brown',
    displayName: 'Fleece Tactical Brown',
    resourcePath: 'res://Items/Clothing/Fleece_Tactical_Brown/Fleece_Tactical_Brown.tres'
  },
  {
    category: 'Clothing',
    id: 'Fleece_Tactical_Green',
    displayName: 'Fleece Tactical Green',
    resourcePath: 'res://Items/Clothing/Fleece_Tactical_Green/Fleece_Tactical_Green.tres'
  },
  {
    category: 'Clothing',
    id: 'Gloves_Leather',
    displayName: 'Gloves Leather',
    resourcePath: 'res://Items/Clothing/Gloves_Leather/Gloves_Leather.tres'
  },
  {
    category: 'Clothing',
    id: 'Gloves_Work',
    displayName: 'Gloves Work',
    resourcePath: 'res://Items/Clothing/Gloves_Work/Gloves_Work.tres'
  },
  {
    category: 'Clothing',
    id: 'Hat_Mosquito',
    displayName: 'Hat Mosquito',
    resourcePath: 'res://Items/Clothing/Hat_Mosquito/Hat_Mosquito.tres'
  },
  {
    category: 'Clothing',
    id: 'Hat_Sauna',
    displayName: 'Hat Sauna',
    resourcePath: 'res://Items/Clothing/Hat_Sauna/Hat_Sauna.tres'
  },
  {
    category: 'Clothing',
    id: 'Hoodie_Border_Zone',
    displayName: 'Hoodie Border Zone',
    resourcePath: 'res://Items/Clothing/Hoodie_Border_Zone/Hoodie_Border_Zone.tres'
  },
  {
    category: 'Clothing',
    id: 'Hoodie_Gray',
    displayName: 'Hoodie Gray',
    resourcePath: 'res://Items/Clothing/Hoodie_Gray/Hoodie_Gray.tres'
  },
  {
    category: 'Clothing',
    id: 'Jacket_M62',
    displayName: 'Jacket M62',
    resourcePath: 'res://Items/Clothing/Jacket_M62/Jacket_M62.tres'
  },
  {
    category: 'Clothing',
    id: 'Jacket_Santa',
    displayName: 'Jacket Santa',
    resourcePath: 'res://Items/Clothing/Jacket_Santa/Jacket_Santa.tres'
  },
  {
    category: 'Clothing',
    id: 'Jacket_Winter_Blue',
    displayName: 'Jacket Winter Blue',
    resourcePath: 'res://Items/Clothing/Jacket_Winter_Blue/Jacket_Winter_Blue.tres'
  },
  {
    category: 'Clothing',
    id: 'Jacket_Winter_Red',
    displayName: 'Jacket Winter Red',
    resourcePath: 'res://Items/Clothing/Jacket_Winter_Red/Jacket_Winter_Red.tres'
  },
  {
    category: 'Clothing',
    id: 'Jeans_Black',
    displayName: 'Jeans Black',
    resourcePath: 'res://Items/Clothing/Jeans_Black/Jeans_Black.tres'
  },
  {
    category: 'Clothing',
    id: 'Pants_Hiking',
    displayName: 'Pants Hiking',
    resourcePath: 'res://Items/Clothing/Pants_Hiking/Pants_Hiking.tres'
  },
  {
    category: 'Clothing',
    id: 'Windbreaker_Black',
    displayName: 'Windbreaker Black',
    resourcePath: 'res://Items/Clothing/Windbreaker_Black/Windbreaker_Black.tres'
  },
  {
    category: 'Clothing',
    id: 'Windbreaker_Green',
    displayName: 'Windbreaker Green',
    resourcePath: 'res://Items/Clothing/Windbreaker_Green/Windbreaker_Green.tres'
  },
  {
    category: 'Consumables',
    id: 'Beer',
    displayName: 'Beer',
    resourcePath: 'res://Items/Consumables/Beer/Beer.tres'
  },
  {
    category: 'Consumables',
    id: 'Can_Empty',
    displayName: 'Can Empty',
    resourcePath: 'res://Items/Consumables/Can_Empty/Can_Empty.tres'
  },
  {
    category: 'Consumables',
    id: 'Canned_Meat',
    displayName: 'Canned Meat',
    resourcePath: 'res://Items/Consumables/Canned_Meat/Canned_Meat.tres'
  },
  {
    category: 'Consumables',
    id: 'Canned_Meatballs',
    displayName: 'Canned Meatballs',
    resourcePath: 'res://Items/Consumables/Canned_Meatballs/Canned_Meatballs.tres'
  },
  {
    category: 'Consumables',
    id: 'Canned_Pea_Soup',
    displayName: 'Canned Pea Soup',
    resourcePath: 'res://Items/Consumables/Canned_Pea_Soup/Canned_Pea_Soup.tres'
  },
  {
    category: 'Consumables',
    id: 'Canned_Peaches',
    displayName: 'Canned Peaches',
    resourcePath: 'res://Items/Consumables/Canned_Peaches/Canned_Peaches.tres'
  },
  {
    category: 'Consumables',
    id: 'Canned_Pear',
    displayName: 'Canned Pear',
    resourcePath: 'res://Items/Consumables/Canned_Pear/Canned_Pear.tres'
  },
  {
    category: 'Consumables',
    id: 'Canned_Peas',
    displayName: 'Canned Peas',
    resourcePath: 'res://Items/Consumables/Canned_Peas/Canned_Peas.tres'
  },
  {
    category: 'Consumables',
    id: 'Canned_Pineapple',
    displayName: 'Canned Pineapple',
    resourcePath: 'res://Items/Consumables/Canned_Pineapple/Canned_Pineapple.tres'
  },
  {
    category: 'Consumables',
    id: 'Canned_Tomatoes',
    displayName: 'Canned Tomatoes',
    resourcePath: 'res://Items/Consumables/Canned_Tomatoes/Canned_Tomatoes.tres'
  },
  {
    category: 'Consumables',
    id: 'Canned_Tuna',
    displayName: 'Canned Tuna',
    resourcePath: 'res://Items/Consumables/Canned_Tuna/Canned_Tuna.tres'
  },
  {
    category: 'Consumables',
    id: 'Cat_Food',
    displayName: 'Cat Food',
    resourcePath: 'res://Items/Consumables/Cat_Food/Cat_Food.tres'
  },
  {
    category: 'Consumables',
    id: 'Chocolate_War',
    displayName: 'Chocolate War',
    resourcePath: 'res://Items/Consumables/Chocolate_War/Chocolate_War.tres'
  },
  {
    category: 'Consumables',
    id: 'Cigarettes',
    displayName: 'Cigarettes',
    resourcePath: 'res://Items/Consumables/Cigarettes/Cigarettes.tres'
  },
  {
    category: 'Consumables',
    id: 'Cigars',
    displayName: 'Cigars',
    resourcePath: 'res://Items/Consumables/Cigars/Cigars.tres'
  },
  {
    category: 'Consumables',
    id: 'Coffee_Brewed',
    displayName: 'Coffee Brewed',
    resourcePath: 'res://Items/Consumables/Coffee_Brewed/Coffee_Brewed.tres'
  },
  {
    category: 'Consumables',
    id: 'Coffee',
    displayName: 'Coffee',
    resourcePath: 'res://Items/Consumables/Coffee/Coffee.tres'
  },
  {
    category: 'Consumables',
    id: 'Cooked_Fish_Soup',
    displayName: 'Cooked Fish Soup',
    resourcePath: 'res://Items/Consumables/Cooked_Fish_Soup/Cooked_Fish_Soup.tres'
  },
  {
    category: 'Consumables',
    id: 'Cooked_Meatballs',
    displayName: 'Cooked Meatballs',
    resourcePath: 'res://Items/Consumables/Cooked_Meatballs/Cooked_Meatballs.tres'
  },
  {
    category: 'Consumables',
    id: 'Cooked_Pea_Soup',
    displayName: 'Cooked Pea Soup',
    resourcePath: 'res://Items/Consumables/Cooked_Pea_Soup/Cooked_Pea_Soup.tres'
  },
  {
    category: 'Consumables',
    id: 'Cooked_Tomato_Soup',
    displayName: 'Cooked Tomato Soup',
    resourcePath: 'res://Items/Consumables/Cooked_Tomato_Soup/Cooked_Tomato_Soup.tres'
  },
  {
    category: 'Consumables',
    id: 'Crackers',
    displayName: 'Crackers',
    resourcePath: 'res://Items/Consumables/Crackers/Crackers.tres'
  },
  {
    category: 'Consumables',
    id: 'Energy_Drink',
    displayName: 'Energy Drink',
    resourcePath: 'res://Items/Consumables/Energy_Drink/Energy_Drink.tres'
  },
  {
    category: 'Consumables',
    id: 'Energy_Powder',
    displayName: 'Energy Powder',
    resourcePath: 'res://Items/Consumables/Energy_Powder/Energy_Powder.tres'
  },
  {
    category: 'Consumables',
    id: 'Field_Ration',
    displayName: 'Field Ration',
    resourcePath: 'res://Items/Consumables/Field_Ration/Field_Ration.tres'
  },
  {
    category: 'Consumables',
    id: 'Juice_Orange',
    displayName: 'Juice Orange',
    resourcePath: 'res://Items/Consumables/Juice_Orange/Juice_Orange.tres'
  },
  {
    category: 'Consumables',
    id: 'Juice_Pear',
    displayName: 'Juice Pear',
    resourcePath: 'res://Items/Consumables/Juice_Pear/Juice_Pear.tres'
  },
  {
    category: 'Consumables',
    id: 'Juice_Raspberry',
    displayName: 'Juice Raspberry',
    resourcePath: 'res://Items/Consumables/Juice_Raspberry/Juice_Raspberry.tres'
  },
  {
    category: 'Consumables',
    id: 'Kilju',
    displayName: 'Kilju',
    resourcePath: 'res://Items/Consumables/Kilju/Kilju.tres'
  },
  {
    category: 'Consumables',
    id: 'Kompot',
    displayName: 'Kompot',
    resourcePath: 'res://Items/Consumables/Kompot/Kompot.tres'
  },
  {
    category: 'Consumables',
    id: 'Mustard',
    displayName: 'Mustard',
    resourcePath: 'res://Items/Consumables/Mustard/Mustard.tres'
  },
  {
    category: 'Consumables',
    id: 'Peanuts',
    displayName: 'Peanuts',
    resourcePath: 'res://Items/Consumables/Peanuts/Peanuts.tres'
  },
  {
    category: 'Consumables',
    id: 'Potato',
    displayName: 'Potato',
    resourcePath: 'res://Items/Consumables/Potato/Potato.tres'
  },
  {
    category: 'Consumables',
    id: 'Salty_Liquorice',
    displayName: 'Salty Liquorice',
    resourcePath: 'res://Items/Consumables/Salty_Liquorice/Salty_Liquorice.tres'
  },
  {
    category: 'Consumables',
    id: 'Snus',
    displayName: 'Snus',
    resourcePath: 'res://Items/Consumables/Snus/Snus.tres'
  },
  {
    category: 'Consumables',
    id: 'Soda_Lemon',
    displayName: 'Soda Lemon',
    resourcePath: 'res://Items/Consumables/Soda_Lemon/Soda_Lemon.tres'
  },
  {
    category: 'Consumables',
    id: 'Sugar',
    displayName: 'Sugar',
    resourcePath: 'res://Items/Consumables/Sugar/Sugar.tres'
  },
  {
    category: 'Consumables',
    id: 'Water_Bottle',
    displayName: 'Water Bottle',
    resourcePath: 'res://Items/Consumables/Water_Bottle/Water_Bottle.tres'
  },
  {
    category: 'Consumables',
    id: 'Yeast',
    displayName: 'Yeast',
    resourcePath: 'res://Items/Consumables/Yeast/Yeast.tres'
  },
  {
    category: 'Electronics',
    id: 'Alarm_Clock',
    displayName: 'Alarm Clock',
    resourcePath: 'res://Items/Electronics/Alarm_Clock/Alarm_Clock.tres'
  },
  {
    category: 'Electronics',
    id: 'Batteries',
    displayName: 'Batteries',
    resourcePath: 'res://Items/Electronics/Batteries/Batteries.tres'
  },
  {
    category: 'Electronics',
    id: 'Battery_Cables',
    displayName: 'Battery Cables',
    resourcePath: 'res://Items/Electronics/Battery_Cables/Battery_Cables.tres'
  },
  {
    category: 'Electronics',
    id: 'Battery',
    displayName: 'Battery',
    resourcePath: 'res://Items/Electronics/Battery/Battery.tres'
  },
  {
    category: 'Electronics',
    id: 'Casette_Electrofolk',
    displayName: 'Casette Electrofolk',
    resourcePath: 'res://Items/Electronics/Casette_Electrofolk/Casette_Electrofolk.tres'
  },
  {
    category: 'Electronics',
    id: 'Casette_Nomad',
    displayName: 'Casette Nomad',
    resourcePath: 'res://Items/Electronics/Casette_Nomad/Casette_Nomad.tres'
  },
  {
    category: 'Electronics',
    id: 'Casette_OST',
    displayName: 'Casette OST',
    resourcePath: 'res://Items/Electronics/Casette_OST/Casette_OST.tres'
  },
  {
    category: 'Electronics',
    id: 'Casette_Player',
    displayName: 'Casette Player',
    resourcePath: 'res://Items/Electronics/Casette_Player/Casette_Player.tres',
    showCondition: true
  },
  {
    category: 'Electronics',
    id: 'Casette_Radio',
    displayName: 'Casette Radio',
    resourcePath: 'res://Items/Electronics/Casette_Radio/Casette_Radio.tres'
  },
  {
    category: 'Electronics',
    id: 'Casette_Symphony',
    displayName: 'Casette Symphony',
    resourcePath: 'res://Items/Electronics/Casette_Symphony/Casette_Symphony.tres'
  },
  {
    category: 'Electronics',
    id: 'Coffeemaster',
    displayName: 'Coffeemaster',
    resourcePath: 'res://Items/Electronics/Coffeemaster/Coffeemaster.tres'
  },
  {
    category: 'Electronics',
    id: 'Cooking_Station',
    displayName: 'Cooking Station',
    resourcePath: 'res://Items/Electronics/Cooking_Station/Cooking_Station.tres'
  },
  {
    category: 'Electronics',
    id: 'Hotplate',
    displayName: 'Hotplate',
    resourcePath: 'res://Items/Electronics/Hotplate/Hotplate.tres'
  },
  {
    category: 'Electronics',
    id: 'Inverter',
    displayName: 'Inverter',
    resourcePath: 'res://Items/Electronics/Inverter/Inverter.tres'
  },
  {
    category: 'Electronics',
    id: 'Narva',
    displayName: 'Narva',
    resourcePath: 'res://Items/Electronics/Narva/Narva.tres',
    showCondition: true
  },
  {
    category: 'Electronics',
    id: 'Polaris',
    displayName: 'Polaris',
    resourcePath: 'res://Items/Electronics/Polaris/Polaris.tres',
    showCondition: true
  },
  {
    category: 'Electronics',
    id: 'PV7',
    displayName: 'PV7',
    resourcePath: 'res://Items/Electronics/PV7/PV7.tres',
    showCondition: true
  },
  {
    category: 'Fishing',
    id: 'Bream',
    displayName: 'Bream',
    resourcePath: 'res://Items/Fishing/Bream/Bream.tres'
  },
  {
    category: 'Fishing',
    id: 'Fishing_Rod',
    displayName: 'Fishing Rod',
    resourcePath: 'res://Items/Fishing/Fishing_Rod/Fishing_Rod.tres'
  },
  {
    category: 'Fishing',
    id: 'Perch',
    displayName: 'Perch',
    resourcePath: 'res://Items/Fishing/Perch/Perch.tres'
  },
  {
    category: 'Fishing',
    id: 'Pike',
    displayName: 'Pike',
    resourcePath: 'res://Items/Fishing/Pike/Pike.tres'
  },
  {
    category: 'Fishing',
    id: 'Roach',
    displayName: 'Roach',
    resourcePath: 'res://Items/Fishing/Roach/Roach.tres'
  },
  {
    category: 'Grenades',
    id: 'F1',
    displayName: 'F1',
    resourcePath: 'res://Items/Grenades/F1/F1.tres'
  },
  {
    category: 'Grenades',
    id: 'M43',
    displayName: 'M43',
    resourcePath: 'res://Items/Grenades/M43/M43.tres'
  },
  {
    category: 'Grenades',
    id: 'M50',
    displayName: 'M50',
    resourcePath: 'res://Items/Grenades/M50/M50.tres'
  },
  {
    category: 'Grenades',
    id: 'RGD-5',
    displayName: 'RGD-5',
    resourcePath: 'res://Items/Grenades/RGD-5/RGD-5.tres'
  },
  {
    category: 'Helmets',
    id: 'Helmet_Police',
    displayName: 'Helmet Police',
    resourcePath: 'res://Items/Helmets/Helmet_Police/Helmet_Police.tres',
    showCondition: true
  },
  {
    category: 'Helmets',
    id: 'SSh-39',
    displayName: 'SSh-39',
    resourcePath: 'res://Items/Helmets/SSh-39/SSh-39.tres',
    showCondition: true
  },
  {
    category: 'Instruments',
    id: 'Guitar',
    displayName: 'Guitar',
    resourcePath: 'res://Items/Instruments/Guitar/Guitar.tres'
  },
  {
    category: 'Instruments',
    id: 'Harmonica',
    displayName: 'Harmonica',
    resourcePath: 'res://Items/Instruments/Harmonica/Harmonica.tres'
  },
  {
    category: 'Keys',
    id: 'Key_Attic',
    displayName: 'Key Attic',
    resourcePath: 'res://Items/Keys/Key_Attic.tres'
  },
  {
    category: 'Keys',
    id: 'Key_Bunker',
    displayName: 'Key Bunker',
    resourcePath: 'res://Items/Keys/Key_Bunker.tres'
  },
  {
    category: 'Keys',
    id: 'Key_Cellar',
    displayName: 'Key Cellar',
    resourcePath: 'res://Items/Keys/Key_Cellar.tres'
  },
  {
    category: 'Keys',
    id: 'Key_Classroom',
    displayName: 'Key Classroom',
    resourcePath: 'res://Items/Keys/Key_Classroom.tres'
  },
  {
    category: 'Keys',
    id: 'Key_Gymnasium',
    displayName: 'Key Gymnasium',
    resourcePath: 'res://Items/Keys/Key_Gymnasium.tres'
  },
  {
    category: 'Keys',
    id: 'Key_Tunnel',
    displayName: 'Key Tunnel',
    resourcePath: 'res://Items/Keys/Key_Tunnel.tres'
  },
  {
    category: 'Knives',
    id: 'Jaeger_140',
    displayName: 'Jaeger 140',
    resourcePath: 'res://Items/Knives/Jaeger_140/Jaeger_140.tres'
  },
  {
    category: 'Knives',
    id: 'Skrama_200',
    displayName: 'Skrama 200',
    resourcePath: 'res://Items/Knives/Skrama_200/Skrama_200.tres'
  },
  {
    category: 'Knives',
    id: 'Skrama_240',
    displayName: 'Skrama 240',
    resourcePath: 'res://Items/Knives/Skrama_240/Skrama_240.tres'
  },
  {
    category: 'Lore',
    id: 'Cat',
    displayName: 'Cat',
    resourcePath: 'res://Items/Lore/Cat/Cat.tres'
  },
  {
    category: 'Lore',
    id: 'Oil_Sample',
    displayName: 'Oil Sample',
    resourcePath: 'res://Items/Lore/Oil_Sample/Oil_Sample.tres'
  },
  {
    category: 'Lore',
    id: 'Patient_Report',
    displayName: 'Patient Report',
    resourcePath: 'res://Items/Lore/Patient_Report/Patient_Report.tres'
  },
  {
    category: 'Medical',
    id: 'AFAK',
    displayName: 'AFAK',
    resourcePath: 'res://Items/Medical/AFAK/AFAK.tres'
  },
  {
    category: 'Medical',
    id: 'Antibiotics',
    displayName: 'Antibiotics',
    resourcePath: 'res://Items/Medical/Antibiotics/Antibiotics.tres'
  },
  {
    category: 'Medical',
    id: 'Antiseptic',
    displayName: 'Antiseptic',
    resourcePath: 'res://Items/Medical/Antiseptic/Antiseptic.tres'
  },
  {
    category: 'Medical',
    id: 'Balm',
    displayName: 'Balm',
    resourcePath: 'res://Items/Medical/Balm/Balm.tres'
  },
  {
    category: 'Medical',
    id: 'Bandage_Improvised',
    displayName: 'Bandage Improvised',
    resourcePath: 'res://Items/Medical/Bandage_Improvised/Bandage_Improvised.tres'
  },
  {
    category: 'Medical',
    id: 'Bandage',
    displayName: 'Bandage',
    resourcePath: 'res://Items/Medical/Bandage/Bandage.tres'
  },
  {
    category: 'Medical',
    id: 'Cold_Medicine',
    displayName: 'Cold Medicine',
    resourcePath: 'res://Items/Medical/Cold_Medicine/Cold_Medicine.tres'
  },
  {
    category: 'Medical',
    id: 'Deodorant',
    displayName: 'Deodorant',
    resourcePath: 'res://Items/Medical/Deodorant/Deodorant.tres'
  },
  {
    category: 'Medical',
    id: 'IFAK',
    displayName: 'IFAK',
    resourcePath: 'res://Items/Medical/IFAK/IFAK.tres'
  },
  {
    category: 'Medical',
    id: 'Lotion',
    displayName: 'Lotion',
    resourcePath: 'res://Items/Medical/Lotion/Lotion.tres'
  },
  {
    category: 'Medical',
    id: 'Medkit',
    displayName: 'Medkit',
    resourcePath: 'res://Items/Medical/Medkit/Medkit.tres'
  },
  {
    category: 'Medical',
    id: 'Melatonin',
    displayName: 'Melatonin',
    resourcePath: 'res://Items/Medical/Melatonin/Melatonin.tres'
  },
  {
    category: 'Medical',
    id: 'Painkillers',
    displayName: 'Painkillers',
    resourcePath: 'res://Items/Medical/Painkillers/Painkillers.tres'
  },
  {
    category: 'Medical',
    id: 'Saline',
    displayName: 'Saline',
    resourcePath: 'res://Items/Medical/Saline/Saline.tres'
  },
  {
    category: 'Medical',
    id: 'Splint_Improvised',
    displayName: 'Splint Improvised',
    resourcePath: 'res://Items/Medical/Splint_Improvised/Splint_Improvised.tres'
  },
  {
    category: 'Medical',
    id: 'Splint',
    displayName: 'Splint',
    resourcePath: 'res://Items/Medical/Splint/Splint.tres'
  },
  {
    category: 'Medical',
    id: 'Thermal_Blanket',
    displayName: 'Thermal Blanket',
    resourcePath: 'res://Items/Medical/Thermal_Blanket/Thermal_Blanket.tres'
  },
  {
    category: 'Medical',
    id: 'Tissues',
    displayName: 'Tissues',
    resourcePath: 'res://Items/Medical/Tissues/Tissues.tres'
  },
  {
    category: 'Medical',
    id: 'Tourniquet_Improvised',
    displayName: 'Tourniquet Improvised',
    resourcePath: 'res://Items/Medical/Tourniquet_Improvised/Tourniquet_Improvised.tres'
  },
  {
    category: 'Medical',
    id: 'Tourniquet',
    displayName: 'Tourniquet',
    resourcePath: 'res://Items/Medical/Tourniquet/Tourniquet.tres'
  },
  {
    category: 'Medical',
    id: 'Wipes',
    displayName: 'Wipes',
    resourcePath: 'res://Items/Medical/Wipes/Wipes.tres'
  },
  {
    category: 'Misc',
    id: 'Blanket',
    displayName: 'Blanket',
    resourcePath: 'res://Items/Misc/Blanket/Blanket.tres'
  },
  {
    category: 'Misc',
    id: 'Board_Game',
    displayName: 'Board Game',
    resourcePath: 'res://Items/Misc/Board_Game/Board_Game.tres'
  },
  {
    category: 'Misc',
    id: 'Bucket',
    displayName: 'Bucket',
    resourcePath: 'res://Items/Misc/Bucket/Bucket.tres'
  },
  {
    category: 'Misc',
    id: 'Coffee_Filter',
    displayName: 'Coffee Filter',
    resourcePath: 'res://Items/Misc/Coffee_Filter/Coffee_Filter.tres'
  },
  {
    category: 'Misc',
    id: 'Duct_Tape',
    displayName: 'Duct Tape',
    resourcePath: 'res://Items/Misc/Duct_Tape/Duct_Tape.tres'
  },
  {
    category: 'Misc',
    id: 'Happy_Stove',
    displayName: 'Happy Stove',
    resourcePath: 'res://Items/Misc/Happy_Stove/Happy_Stove.tres'
  },
  {
    category: 'Misc',
    id: 'Jerry_Can',
    displayName: 'Jerry Can',
    resourcePath: 'res://Items/Misc/Jerry_Can/Jerry_Can.tres',
    showCondition: true
  },
  {
    category: 'Misc',
    id: 'Lumber',
    displayName: 'Lumber',
    resourcePath: 'res://Items/Misc/Lumber/Lumber.tres'
  },
  {
    category: 'Misc',
    id: 'Map_Tactical',
    displayName: 'Map Tactical',
    resourcePath: 'res://Items/Misc/Map_Tactical/Map_Tactical.tres'
  },
  {
    category: 'Misc',
    id: 'Map',
    displayName: 'Map',
    resourcePath: 'res://Items/Misc/Map/Map.tres'
  },
  {
    category: 'Misc',
    id: 'Matches',
    displayName: 'Matches',
    resourcePath: 'res://Items/Misc/Matches/Matches.tres',
    stackable: true,
    showAmount: true,
    defaultAmount: 20,
    maxAmount: 300
  },
  {
    category: 'Misc',
    id: 'Mattress',
    displayName: 'Mattress',
    resourcePath: 'res://Items/Misc/Mattress/Mattress.tres'
  },
  {
    category: 'Misc',
    id: 'Mess_Kit',
    displayName: 'Mess Kit',
    resourcePath: 'res://Items/Misc/Mess_Kit/Mess_Kit.tres'
  },
  {
    category: 'Misc',
    id: 'Nails',
    displayName: 'Nails',
    resourcePath: 'res://Items/Misc/Nails/Nails.tres'
  },
  {
    category: 'Misc',
    id: 'Oil_Filter',
    displayName: 'Oil Filter',
    resourcePath: 'res://Items/Misc/Oil_Filter/Oil_Filter.tres'
  },
  {
    category: 'Misc',
    id: 'Pillow',
    displayName: 'Pillow',
    resourcePath: 'res://Items/Misc/Pillow/Pillow.tres'
  },
  {
    category: 'Misc',
    id: 'Rags',
    displayName: 'Rags',
    resourcePath: 'res://Items/Misc/Rags/Rags.tres'
  },
  {
    category: 'Misc',
    id: 'Sleeping_Bag',
    displayName: 'Sleeping Bag',
    resourcePath: 'res://Items/Misc/Sleeping_Bag/Sleeping_Bag.tres'
  },
  {
    category: 'Misc',
    id: 'Sticks',
    displayName: 'Sticks',
    resourcePath: 'res://Items/Misc/Sticks/Sticks.tres'
  },
  {
    category: 'Misc',
    id: 'Tackle_Box',
    displayName: 'Tackle Box',
    resourcePath: 'res://Items/Misc/Tackle_Box/Tackle_Box.tres'
  },
  {
    category: 'Misc',
    id: 'Toilet_Paper',
    displayName: 'Toilet Paper',
    resourcePath: 'res://Items/Misc/Toilet_Paper/Toilet_Paper.tres'
  },
  {
    category: 'Misc',
    id: 'Toolbox',
    displayName: 'Toolbox',
    resourcePath: 'res://Items/Misc/Toolbox/Toolbox.tres'
  },
  {
    category: 'Misc',
    id: 'Water_Lock',
    displayName: 'Water Lock',
    resourcePath: 'res://Items/Misc/Water_Lock/Water_Lock.tres'
  },
  {
    category: 'Misc',
    id: 'Weapon_Repair_Kit',
    displayName: 'Weapon Repair Kit',
    resourcePath: 'res://Items/Misc/Weapon_Repair_Kit/Weapon_Repair_Kit.tres'
  },
  {
    category: 'Rigs',
    id: 'K19',
    displayName: 'K19',
    resourcePath: 'res://Items/Rigs/K19/K19.tres'
  },
  {
    category: 'Rigs',
    id: 'LVPC_Green',
    displayName: 'LVPC Green',
    resourcePath: 'res://Items/Rigs/LVPC/LVPC_Green.tres'
  },
  {
    category: 'Rigs',
    id: 'LVPC_M05',
    displayName: 'LVPC M05',
    resourcePath: 'res://Items/Rigs/LVPC/LVPC_M05.tres'
  },
  {
    category: 'Rigs',
    id: 'LVPC_Winter',
    displayName: 'LVPC Winter',
    resourcePath: 'res://Items/Rigs/LVPC/LVPC_Winter.tres'
  },
  {
    category: 'Rigs',
    id: 'Vest_Fishing',
    displayName: 'Vest Fishing',
    resourcePath: 'res://Items/Rigs/Vest_Fishing/Vest_Fishing.tres'
  },
  {
    category: 'Weapons',
    id: 'AK-12_Magazine',
    displayName: 'AK-12 Magazine',
    resourcePath: 'res://Items/Weapons/AK-12/AK-12_Magazine.tres',
    showAmount: true,
    defaultAmount: 30,
    maxAmount: 30
  },
  {
    category: 'Weapons',
    id: 'AK-12',
    displayName: 'AK-12',
    resourcePath: 'res://Items/Weapons/AK-12/AK-12.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'AKM_Magazine',
    displayName: 'AKM Magazine',
    resourcePath: 'res://Items/Weapons/AKM/AKM_Magazine.tres',
    showAmount: true,
    defaultAmount: 30,
    maxAmount: 30
  },
  {
    category: 'Weapons',
    id: 'AKM',
    displayName: 'AKM',
    resourcePath: 'res://Items/Weapons/AKM/AKM.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'AKS-74U_Magazine',
    displayName: 'AKS-74U Magazine',
    resourcePath: 'res://Items/Weapons/AKS-74U/AKS-74U_Magazine.tres',
    showAmount: true,
    defaultAmount: 30,
    maxAmount: 30
  },
  {
    category: 'Weapons',
    id: 'AKS-74U',
    displayName: 'AKS-74U',
    resourcePath: 'res://Items/Weapons/AKS-74U/AKS-74U.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'Colt_1911_Magazine',
    displayName: 'Colt 1911 Magazine',
    resourcePath: 'res://Items/Weapons/Colt_1911/Colt_1911_Magazine.tres',
    showAmount: true,
    defaultAmount: 7,
    maxAmount: 7
  },
  {
    category: 'Weapons',
    id: 'Colt_1911',
    displayName: 'Colt 1911',
    resourcePath: 'res://Items/Weapons/Colt_1911/Colt_1911.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'Glock_17_Magazine',
    displayName: 'Glock 17 Magazine',
    resourcePath: 'res://Items/Weapons/Glock_17/Glock_17_Magazine.tres',
    showAmount: true,
    defaultAmount: 17,
    maxAmount: 17
  },
  {
    category: 'Weapons',
    id: 'Glock_17',
    displayName: 'Glock 17',
    resourcePath: 'res://Items/Weapons/Glock_17/Glock_17.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'HK416',
    displayName: 'HK416',
    resourcePath: 'res://Items/Weapons/HK416/HK416.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'KAR-21_223_Magazine',
    displayName: 'KAR-21 223 Magazine',
    resourcePath: 'res://Items/Weapons/KAR-21/KAR-21_223_Magazine.tres',
    showAmount: true,
    defaultAmount: 20,
    maxAmount: 20
  },
  {
    category: 'Weapons',
    id: 'KAR-21_223',
    displayName: 'KAR-21 223',
    resourcePath: 'res://Items/Weapons/KAR-21/KAR-21_223.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'KAR-21_308_Magazine',
    displayName: 'KAR-21 308 Magazine',
    resourcePath: 'res://Items/Weapons/KAR-21/KAR-21_308_Magazine.tres',
    showAmount: true,
    defaultAmount: 10,
    maxAmount: 10
  },
  {
    category: 'Weapons',
    id: 'KAR-21_308',
    displayName: 'KAR-21 308',
    resourcePath: 'res://Items/Weapons/KAR-21/KAR-21_308.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'KAR-21_Barrel',
    displayName: 'KAR-21 Barrel',
    resourcePath: 'res://Items/Weapons/KAR-21/KAR-21_Barrel.tres'
  },
  {
    category: 'Weapons',
    id: 'KP-31_Drum',
    displayName: 'KP-31 Drum',
    resourcePath: 'res://Items/Weapons/KP-31/KP-31_Drum.tres',
    showAmount: true,
    defaultAmount: 71,
    maxAmount: 71
  },
  {
    category: 'Weapons',
    id: 'KP-31',
    displayName: 'KP-31',
    resourcePath: 'res://Items/Weapons/KP-31/KP-31.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'M4A1',
    displayName: 'M4A1',
    resourcePath: 'res://Items/Weapons/M4A1/M4A1.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'STANAG_Magazine',
    displayName: 'STANAG Magazine',
    resourcePath: 'res://Items/Weapons/M4A1/STANAG_Magazine.tres',
    showAmount: true,
    defaultAmount: 30,
    maxAmount: 30
  },
  {
    category: 'Weapons',
    id: 'M78_Magazine',
    displayName: 'M78 Magazine',
    resourcePath: 'res://Items/Weapons/M78/M78_Magazine.tres',
    showAmount: true,
    defaultAmount: 20,
    maxAmount: 20
  },
  {
    category: 'Weapons',
    id: 'M78',
    displayName: 'M78',
    resourcePath: 'res://Items/Weapons/M78/M78.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'Makarov_Magazine',
    displayName: 'Makarov Magazine',
    resourcePath: 'res://Items/Weapons/Makarov/Makarov_Magazine.tres',
    showAmount: true,
    defaultAmount: 8,
    maxAmount: 8
  },
  {
    category: 'Weapons',
    id: 'Makarov',
    displayName: 'Makarov',
    resourcePath: 'res://Items/Weapons/Makarov/Makarov.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'MK18',
    displayName: 'MK18',
    resourcePath: 'res://Items/Weapons/MK18/MK18.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'Mosin',
    displayName: 'Mosin',
    resourcePath: 'res://Items/Weapons/Mosin/Mosin.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'MP5_Magazine',
    displayName: 'MP5 Magazine',
    resourcePath: 'res://Items/Weapons/MP5/MP5_Magazine.tres',
    showAmount: true,
    defaultAmount: 30,
    maxAmount: 30
  },
  {
    category: 'Weapons',
    id: 'MP5',
    displayName: 'MP5',
    resourcePath: 'res://Items/Weapons/MP5/MP5.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'MP5K',
    displayName: 'MP5K',
    resourcePath: 'res://Items/Weapons/MP5K/MP5K.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'MP5SD',
    displayName: 'MP5SD',
    resourcePath: 'res://Items/Weapons/MP5SD/MP5SD.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'MP7_Magazine',
    displayName: 'MP7 Magazine',
    resourcePath: 'res://Items/Weapons/MP7/MP7_Magazine.tres',
    showAmount: true,
    defaultAmount: 40,
    maxAmount: 40
  },
  {
    category: 'Weapons',
    id: 'MP7',
    displayName: 'MP7',
    resourcePath: 'res://Items/Weapons/MP7/MP7.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'P320_Magazine',
    displayName: 'P320 Magazine',
    resourcePath: 'res://Items/Weapons/P320/P320_Magazine.tres',
    showAmount: true,
    defaultAmount: 17,
    maxAmount: 17
  },
  {
    category: 'Weapons',
    id: 'P320',
    displayName: 'P320',
    resourcePath: 'res://Items/Weapons/P320/P320.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'Remington_870',
    displayName: 'Remington 870',
    resourcePath: 'res://Items/Weapons/Remington_870/Remington_870.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'RK_Magazine',
    displayName: 'RK Magazine',
    resourcePath: 'res://Items/Weapons/RK-62/RK_Magazine.tres',
    showAmount: true,
    defaultAmount: 30,
    maxAmount: 30
  },
  {
    category: 'Weapons',
    id: 'RK-62',
    displayName: 'RK-62',
    resourcePath: 'res://Items/Weapons/RK-62/RK-62.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'RK-62M',
    displayName: 'RK-62M',
    resourcePath: 'res://Items/Weapons/RK-62/RK-62M.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'RK-95',
    displayName: 'RK-95',
    resourcePath: 'res://Items/Weapons/RK-95/RK-95.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'SVD_Magazine',
    displayName: 'SVD Magazine',
    resourcePath: 'res://Items/Weapons/SVD/SVD_Magazine.tres',
    showAmount: true,
    defaultAmount: 10,
    maxAmount: 10
  },
  {
    category: 'Weapons',
    id: 'SVD',
    displayName: 'SVD',
    resourcePath: 'res://Items/Weapons/SVD/SVD.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'VSS_Magazine',
    displayName: 'VSS Magazine',
    resourcePath: 'res://Items/Weapons/VSS/VSS_Magazine.tres',
    showAmount: true,
    defaultAmount: 20,
    maxAmount: 20
  },
  {
    category: 'Weapons',
    id: 'VSS',
    displayName: 'VSS',
    resourcePath: 'res://Items/Weapons/VSS/VSS.tres',
    showCondition: true,
    showAmount: true,
    repairs: true
  }
] satisfies GameItem[]

/** Items indexed by resource path for quick lookup */
export const ITEMS_BY_PATH = new Map<string, GameItem>(
  ITEMS.map((item) => [item.resourcePath, item])
)

export function resolveItemMeta(item: GameItem): ResolvedItemMeta {
  const stackable = item.stackable ?? false
  const showCondition = item.showCondition ?? false
  return {
    stackable,
    showCondition,
    showAmount: item.showAmount ?? false,
    defaultAmount: item.defaultAmount ?? (stackable ? 1 : 0),
    defaultCondition: showCondition ? 100 : 0,
    maxAmount: item.maxAmount,
    repairs: item.repairs ?? false
  }
}

/** Resolved metadata indexed by resource path */
export const ITEMS_META = new Map<string, ResolvedItemMeta>(
  ITEMS.map((item) => [item.resourcePath, resolveItemMeta(item)])
)
