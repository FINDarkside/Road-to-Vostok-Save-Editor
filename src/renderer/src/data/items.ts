import type { GameItem, ResolvedItemMeta } from '../lib/types'

export const ITEMS = [
  {
    category: 'Ammo',
    id: 'Ammo_223',
    displayName: '.223',
    resourcePath: 'res://Items/Ammo/Ammo_223/Ammo_223.tres',
    iconFile: 'Icon_Ammo_223.png-9ee9522f4b4426fda8aa7cc6740f8487.s3tc.ctex',
    stackable: true,
    showAmount: true,
    defaultAmount: 30,
    maxAmount: 300
  },
  {
    category: 'Ammo',
    id: 'Ammo_308',
    displayName: '.308',
    resourcePath: 'res://Items/Ammo/Ammo_308/Ammo_308.tres',
    iconFile: 'Icon_Ammo_308.png-2ed0d4b748c5e0ed1236dc6a5fbea7a3.s3tc.ctex',
    stackable: true,
    showAmount: true,
    defaultAmount: 30,
    maxAmount: 300
  },
  {
    category: 'Ammo',
    id: 'Ammo_45ACP',
    displayName: '.45 ACP',
    resourcePath: 'res://Items/Ammo/Ammo_45ACP/Ammo_45ACP.tres',
    iconFile: 'Icon_Ammo_45ACP.png-4d05b54902db2ce42c630dd6764f194d.s3tc.ctex',
    stackable: true,
    showAmount: true,
    defaultAmount: 50,
    maxAmount: 300
  },
  {
    category: 'Ammo',
    id: 'Ammo_12x70',
    displayName: '12/70',
    resourcePath: 'res://Items/Ammo/Ammo_12x70/Ammo_12x70.tres',
    iconFile: 'Icon_Ammo_12x70.png-c0b77bedcc9cfe8c7f60436c40df2436.s3tc.ctex',
    stackable: true,
    showAmount: true,
    defaultAmount: 10,
    maxAmount: 300
  },
  {
    category: 'Ammo',
    id: 'Ammo_46x30',
    displayName: '4.6x30',
    resourcePath: 'res://Items/Ammo/Ammo_46x30/Ammo_46x30.tres',
    iconFile: 'Icon_Ammo_46x30.png-7c45cc14f4288451976e07274d3d9434.s3tc.ctex',
    stackable: true,
    showAmount: true,
    defaultAmount: 50,
    maxAmount: 300
  },
  {
    category: 'Ammo',
    id: 'Ammo_545x39',
    displayName: '5.45x39',
    resourcePath: 'res://Items/Ammo/Ammo_545x39/Ammo_545x39.tres',
    iconFile: 'Icon_Ammo_545x39.png-76202fe45c5456cf48cae74b827b724c.s3tc.ctex',
    stackable: true,
    showAmount: true,
    defaultAmount: 30,
    maxAmount: 300
  },
  {
    category: 'Ammo',
    id: 'Ammo_762x39',
    displayName: '7.62x39',
    resourcePath: 'res://Items/Ammo/Ammo_762x39/Ammo_762x39.tres',
    iconFile: 'Icon_Ammo_762x39.png-b0af5698bb26568dd1e5592d6d5fc898.s3tc.ctex',
    stackable: true,
    showAmount: true,
    defaultAmount: 30,
    maxAmount: 300
  },
  {
    category: 'Ammo',
    id: 'Ammo_762x54R',
    displayName: '7.62x54R',
    resourcePath: 'res://Items/Ammo/Ammo_762x54R/Ammo_762x54R.tres',
    iconFile: 'Icon_Ammo_762x54R.png-b6c073b22058b32d61b149b1bce800c8.s3tc.ctex',
    stackable: true,
    showAmount: true,
    defaultAmount: 20,
    maxAmount: 300
  },
  {
    category: 'Ammo',
    id: 'Ammo_9x18',
    displayName: '9x18',
    resourcePath: 'res://Items/Ammo/Ammo_9x18/Ammo_9x18.tres',
    iconFile: 'Icon_Ammo_9x18.png-66ff42a3daf8691c2b7a7bb084046d82.s3tc.ctex',
    stackable: true,
    showAmount: true,
    defaultAmount: 50,
    maxAmount: 300
  },
  {
    category: 'Ammo',
    id: 'Ammo_9x19',
    displayName: '9x19',
    resourcePath: 'res://Items/Ammo/Ammo_9x19/Ammo_9x19.tres',
    iconFile: 'Icon_Ammo_9x19.png-359499800bef8ea4751b603d86a0b647.s3tc.ctex',
    stackable: true,
    showAmount: true,
    defaultAmount: 50,
    maxAmount: 300
  },
  {
    category: 'Ammo',
    id: 'Ammo_9x39',
    displayName: '9x39',
    resourcePath: 'res://Items/Ammo/Ammo_9x39/Ammo_9x39.tres',
    iconFile: 'Icon_Ammo_9x39.png-f06cb6bc39d2c274ff8663c429739baa.s3tc.ctex',
    stackable: true,
    showAmount: true,
    defaultAmount: 20,
    maxAmount: 300
  },
  {
    category: 'Armor',
    id: 'Armor_Plate_II',
    displayName: 'Armor Plate (II)',
    resourcePath: 'res://Items/Armor/Armor_Plate_II.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Armor_Plate_II.png-290798a3a516b1a63c9a4e53d3e57b12.s3tc.ctex',
    showCondition: true
  },
  {
    category: 'Armor',
    id: 'Armor_Plate_III',
    displayName: 'Armor Plate (III)',
    resourcePath: 'res://Items/Armor/Armor_Plate_III.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Armor_Plate_III.png-9d7396211b6e9c64537ac8a2e45b1922.s3tc.ctex',
    showCondition: true
  },
  {
    category: 'Armor',
    id: 'Armor_Plate_III+',
    displayName: 'Armor Plate (III+)',
    resourcePath: 'res://Items/Armor/Armor_Plate_III+.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Armor_Plate_III+.png-3d30d15d1417bf58d89fe08efd395da8.s3tc.ctex',
    showCondition: true
  },
  {
    category: 'Armor',
    id: 'Armor_Plate_IIIA',
    displayName: 'Armor Plate (IIIA)',
    resourcePath: 'res://Items/Armor/Armor_Plate_IIIA.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Armor_Plate_IIIA.png-76bd30f0bf8dee18cf4c42ea1f6f4f4d.s3tc.ctex',
    showCondition: true
  },
  {
    category: 'Armor',
    id: 'Armor_Plate_IV',
    displayName: 'Armor Plate (IV)',
    resourcePath: 'res://Items/Armor/Armor_Plate_IV.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Armor_Plate_IV.png-035a4349b919225880d3b3e2f5fc69ab.s3tc.ctex',
    showCondition: true
  },
  {
    category: 'Attachments',
    id: 'ANPEQ',
    displayName: 'AN-15',
    resourcePath: 'res://Items/Attachments/ANPEQ/ANPEQ.tres',
    iconFile: 'Icon_ANPEQ_Side.png-8afa0231061b5b4a5c9944c3774ba1bd.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'ACOG',
    displayName: 'ATOG',
    resourcePath: 'res://Items/Attachments/ACOG/ACOG.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_ACOG.png-12e543b9ae68fe7c98fd12e7c48e17b0.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'Colt_1911_Magazine',
    displayName: 'C1911 Magazine',
    resourcePath: 'res://Items/Weapons/Colt_1911/Colt_1911_Magazine.tres',
    iconFile: 'Icon_Colt_1911_Magazine.png-702935f6f1110dd2bf662e4d9bfdc918.s3tc.ctex',
    showAmount: true,
    defaultAmount: 8,
    maxAmount: 8
  },
  {
    category: 'Attachments',
    id: 'EXPS',
    displayName: 'EXP',
    resourcePath: 'res://Items/Attachments/EXPS/EXPS.tres',
    iconFile: 'Icon_EXPS.png-62b482f4f11d6a2d0d9b88be5def052f.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'Glock_17_Magazine',
    displayName: 'G7 Magazine',
    resourcePath: 'res://Items/Weapons/Glock_17/Glock_17_Magazine.tres',
    iconFile: 'Icon_Glock_17_Magazine.png-52def777377b5d0c63edbefdfe0fe715.s3tc.ctex',
    showAmount: true,
    defaultAmount: 17,
    maxAmount: 17
  },
  {
    category: 'Attachments',
    id: 'HMR',
    displayName: 'HMR',
    resourcePath: 'res://Items/Attachments/HMR/HMR.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_HMR.png-25aecb90cfc69b050e0b594b7c8aac40.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'Hybrid',
    displayName: 'Hybrid',
    resourcePath: 'res://Items/Attachments/Hybrid/Hybrid.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_Hybrid.png-ad6375110827366999c1035ac86c2ada.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'AK-12_Magazine',
    displayName: 'KA-12 Magazine',
    resourcePath: 'res://Items/Weapons/AK-12/AK-12_Magazine.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_AK-12_Magazine.png-275794d7c58a311b4ff64d44ede762b1.s3tc.ctex',
    showAmount: true,
    defaultAmount: 30,
    maxAmount: 30
  },
  {
    category: 'Attachments',
    id: 'AKM_Magazine',
    displayName: 'KA-M Magazine',
    resourcePath: 'res://Items/Weapons/AKM/AKM_Magazine.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_AKM_Magazine.png-b5a19e4491743e94ed4d0efce530765d.s3tc.ctex',
    showAmount: true,
    defaultAmount: 30,
    maxAmount: 30
  },
  {
    category: 'Attachments',
    id: 'KAR-21_Barrel',
    displayName: 'KAR-21 Barrel (.308)',
    resourcePath: 'res://Items/Weapons/KAR-21/KAR-21_Barrel.tres',
    sizeW: 3,
    sizeH: 1,
    iconFile: 'Icon_KAR-21_Barrel.png-0007c282041d206948e1f9c626153531.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'KAR-21_223_Magazine',
    displayName: 'KAR-21 Magazine (.223)',
    resourcePath: 'res://Items/Weapons/KAR-21/KAR-21_223_Magazine.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_KAR-21_223_Magazine.png-5da62272bac5e8acc531bd1181ae71ac.s3tc.ctex',
    showAmount: true,
    defaultAmount: 30,
    maxAmount: 30
  },
  {
    category: 'Attachments',
    id: 'KAR-21_308_Magazine',
    displayName: 'KAR-21 Magazine (.308)',
    resourcePath: 'res://Items/Weapons/KAR-21/KAR-21_308_Magazine.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_KAR-21_308_Magazine.png-3306f94c160533470aa0a7010b3361fb.s3tc.ctex',
    showAmount: true,
    defaultAmount: 30,
    maxAmount: 30
  },
  {
    category: 'Attachments',
    id: 'Makarov_Magazine',
    displayName: 'Karov Magazine',
    resourcePath: 'res://Items/Weapons/Makarov/Makarov_Magazine.tres',
    iconFile: 'Icon_Makarov_Magazine.png-bd8312f92543e0aaa309c6a4bd583e21.s3tc.ctex',
    showAmount: true,
    defaultAmount: 8,
    maxAmount: 8
  },
  {
    category: 'Attachments',
    id: 'AKS-74U_Magazine',
    displayName: 'KAS-74U Magazine',
    resourcePath: 'res://Items/Weapons/AKS-74U/AKS-74U_Magazine.tres',
    sizeW: 1,
    sizeH: 2,
    showAmount: true,
    defaultAmount: 30,
    maxAmount: 30
  },
  {
    category: 'Attachments',
    id: 'Kobra',
    displayName: 'Kobra',
    resourcePath: 'res://Items/Attachments/Kobra/Kobra.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_Kobra.png-bbcea5ab09131880d15dd1555cabbd83.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'KP-31_Drum',
    displayName: 'KP-31 Drum',
    resourcePath: 'res://Items/Weapons/KP-31/KP-31_Drum.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_KP-31_Drum_Front.png-d29119589f121a44130873ffadb5c150.s3tc.ctex',
    showAmount: true,
    defaultAmount: 72,
    maxAmount: 72
  },
  {
    category: 'Attachments',
    id: 'Leopard',
    displayName: 'Leopard',
    resourcePath: 'res://Items/Attachments/Leopard/Leopard.tres',
    sizeW: 3,
    sizeH: 1,
    iconFile: 'Icon_Leopard.png-5f62eaef42fbe6e60cb927b0e1920018.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'M78_Magazine',
    displayName: 'M78 Magazine',
    resourcePath: 'res://Items/Weapons/M78/M78_Magazine.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_M78_Magazine.png-4a931050e62e6f7fa320db123adc76be.s3tc.ctex',
    showAmount: true,
    defaultAmount: 20,
    maxAmount: 20
  },
  {
    category: 'Attachments',
    id: 'Micro',
    displayName: 'Micro',
    resourcePath: 'res://Items/Attachments/Micro/Micro.tres',
    iconFile: 'Icon_Micro.png-e62e95e5dedb9c2070e6a651043d26e0.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'Monster',
    displayName: 'Monster',
    resourcePath: 'res://Items/Attachments/Monster/Monster.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_Monster.png-060f22376c611d405be7d083e70800a7.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'MP7_Magazine',
    displayName: 'MP7 Magazine',
    resourcePath: 'res://Items/Weapons/MP7/MP7_Magazine.tres',
    sizeW: 1,
    sizeH: 2,
    showAmount: true,
    defaultAmount: 40,
    maxAmount: 40
  },
  {
    category: 'Attachments',
    id: 'RMR',
    displayName: 'MRM',
    resourcePath: 'res://Items/Attachments/RMR/RMR.tres',
    iconFile: 'Icon_RMR.png-1e6122fbafd7619b3ec1d5dc270744a1.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'Navy',
    displayName: 'Navy',
    resourcePath: 'res://Items/Attachments/Navy/Navy.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_Navy.png-b6a6d36e9289e531cf73e825a2017989.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'OZ5',
    displayName: 'OZ5',
    resourcePath: 'res://Items/Attachments/OZ5/OZ5.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_OZ5.png-ac58b5252bcef40fd6b0a2d032c13a74.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'P320_Magazine',
    displayName: 'P3 Magazine',
    resourcePath: 'res://Items/Weapons/P320/P320_Magazine.tres',
    iconFile: 'Icon_P320_Magazine.png-b7e8a5f5364791f255ca810e23b28e93.s3tc.ctex',
    showAmount: true,
    defaultAmount: 15,
    maxAmount: 15
  },
  {
    category: 'Attachments',
    id: 'PBS',
    displayName: 'PBS',
    resourcePath: 'res://Items/Attachments/PBS/PBS.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_PBS.png-e0691507ca3df7203099b8d5f5a55fa5.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'MP5_Magazine',
    displayName: 'PM5 Magazine',
    resourcePath: 'res://Items/Weapons/MP5/MP5_Magazine.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_MP5_Magazine.png-4e794211934c3d2db436d7c64830a99c.s3tc.ctex',
    showAmount: true,
    defaultAmount: 30,
    maxAmount: 30
  },
  {
    category: 'Attachments',
    id: 'POSP',
    displayName: 'POSP',
    resourcePath: 'res://Items/Attachments/POSP/POSP.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_POSP.png-f6c08ae7a6a66fd77b630c55a85f913d.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'PRO',
    displayName: 'PRO',
    resourcePath: 'res://Items/Attachments/PRO/PRO.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_PRO.png-44f70930d34ed9e9c7aa790b1bcedaf5.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'PTN',
    displayName: 'PTN',
    resourcePath: 'res://Items/Attachments/PTN/PTN.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_PTN.png-1796ce9233ebeda22d53b71d74b25a54.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'PU',
    displayName: 'PU Scope',
    resourcePath: 'res://Items/Attachments/PU/PU.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_PU.png-c058994d14176446d399ca7cf6dd945b.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'Rider',
    displayName: 'Rider',
    resourcePath: 'res://Items/Attachments/Rider/Rider.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_Rider.png-173dcc98cb0ed6f28fcc49dbeec31767.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'RK_Magazine',
    displayName: 'RK Magazine',
    resourcePath: 'res://Items/Weapons/RK-62/RK_Magazine.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_RK_Magazine.png-48b510c37ff6b4e2624ad2ead443be9b.s3tc.ctex',
    showAmount: true,
    defaultAmount: 30,
    maxAmount: 30
  },
  {
    category: 'Attachments',
    id: 'MRO',
    displayName: 'RMO',
    resourcePath: 'res://Items/Attachments/MRO/MRO.tres',
    iconFile: 'Icon_MRO.png-189385f036a20b42d0b4872c3bc0e6ef.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'SRO',
    displayName: 'RSO',
    resourcePath: 'res://Items/Attachments/SRO/SRO.tres',
    iconFile: 'Icon_SRO.png-2803fb216e5d3afe9b6066b8e629487e.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'Salvo',
    displayName: 'SLV',
    resourcePath: 'res://Items/Attachments/Salvo/Salvo.tres',
    sizeW: 3,
    sizeH: 1,
    iconFile: 'Icon_Salvo.png-97e3645046dd69b6e647a57f2cd2e2a8.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'SOCOM',
    displayName: 'SOCOM',
    resourcePath: 'res://Items/Attachments/SOCOM/SOCOM.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_SOCOM.png-8155f1b8367cf2cf4c5e5efe3f0858e0.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'VSS_Magazine',
    displayName: 'SS Magazine',
    resourcePath: 'res://Items/Weapons/VSS/VSS_Magazine.tres',
    iconFile: 'Icon_VSS_Magazine.png-7575a4a9ebce3df75246840b580b3375.s3tc.ctex',
    showAmount: true,
    defaultAmount: 20,
    maxAmount: 20
  },
  {
    category: 'Attachments',
    id: 'STANAG_Magazine',
    displayName: 'STANAG Magazine',
    resourcePath: 'res://Items/Weapons/M4A1/STANAG_Magazine.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_M4A1_Magazine.png-e1d82d525caeb3f649da50804de753b2.s3tc.ctex',
    showAmount: true,
    defaultAmount: 30,
    maxAmount: 30
  },
  {
    category: 'Attachments',
    id: 'Thor',
    displayName: 'Thor',
    resourcePath: 'res://Items/Attachments/Thor/Thor.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_Thor.png-76d40e1b686ceb29e17bff0257af734d.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'Vudu',
    displayName: 'VDU',
    resourcePath: 'res://Items/Attachments/Vudu/Vudu.tres',
    sizeW: 3,
    sizeH: 1,
    iconFile: 'Icon_Vudu.png-f9d299d37f80b480cb8c56b34aebd7f1.s3tc.ctex'
  },
  {
    category: 'Attachments',
    id: 'SVD_Magazine',
    displayName: 'VSD Magazine',
    resourcePath: 'res://Items/Weapons/SVD/SVD_Magazine.tres',
    iconFile: 'Icon_SVD_Magazine.png-966132db3894cf89893838552a96f52d.s3tc.ctex',
    showAmount: true,
    defaultAmount: 10,
    maxAmount: 10
  },
  {
    category: 'Backpacks',
    id: 'Duffel_Retro',
    displayName: 'Duffel (Retro)',
    resourcePath: 'res://Items/Backpacks/Duffel_Retro/Duffel_Retro.tres',
    sizeW: 4,
    sizeH: 2,
    iconFile: 'Icon_Duffel_Retro.png-7d1f678b7467b606256347135f8ff090.s3tc.ctex'
  },
  {
    category: 'Backpacks',
    id: 'Backpack_Jaeger_Black',
    displayName: 'Jääkäri Backpack (Black)',
    resourcePath: 'res://Items/Backpacks/Backpack_Jaeger/Backpack_Jaeger_Black.tres',
    sizeW: 3,
    sizeH: 5,
    iconFile: 'Icon_Backpack_Jaeger_Black.png-ce085bb0390c9b41d54097c5256198f9.s3tc.ctex'
  },
  {
    category: 'Backpacks',
    id: 'Backpack_Jaeger_Brown',
    displayName: 'Jääkäri Backpack (Brown)',
    resourcePath: 'res://Items/Backpacks/Backpack_Jaeger/Backpack_Jaeger_Brown.tres',
    sizeW: 3,
    sizeH: 5,
    iconFile: 'Icon_Backpack_Jaeger_Brown.png-197fb8f940ccbd77f7e00a2aa79f3adb.s3tc.ctex'
  },
  {
    category: 'Backpacks',
    id: 'Backpack_Jaeger_Green',
    displayName: 'Jääkäri Backpack (Green)',
    resourcePath: 'res://Items/Backpacks/Backpack_Jaeger/Backpack_Jaeger_Green.tres',
    sizeW: 3,
    sizeH: 5,
    iconFile: 'Icon_Backpack_Jaeger_Green.png-c71ed79765f984fed33d6e903c3f1438.s3tc.ctex'
  },
  {
    category: 'Backpacks',
    id: 'Backpack_Jaeger_M05',
    displayName: 'Jääkäri Backpack (M05)',
    resourcePath: 'res://Items/Backpacks/Backpack_Jaeger/Backpack_Jaeger_M05.tres',
    sizeW: 3,
    sizeH: 5,
    iconFile: 'Icon_Backpack_Jaeger_M05.png-6abb65f9c57178d1e79331fc0b546c3a.s3tc.ctex'
  },
  {
    category: 'Backpacks',
    id: 'Backpack_Nomad',
    displayName: 'Nomad Backpack',
    resourcePath: 'res://Items/Backpacks/Backpack_Nomad/Backpack_Nomad.tres',
    sizeW: 3,
    sizeH: 4,
    iconFile: 'Icon_Backpack_Nomad.png-cf9aef898118f3d36540dd41c8688dac.s3tc.ctex'
  },
  {
    category: 'Backpacks',
    id: 'Backpack_Patrol',
    displayName: 'Patrol Backpack',
    resourcePath: 'res://Items/Backpacks/Backpack_Patrol/Backpack_Patrol.tres',
    sizeW: 3,
    sizeH: 4,
    iconFile: 'Icon_Backpack_Patrol.png-1940b7cd1e8e1883e0af45e3a3fac197.s3tc.ctex'
  },
  {
    category: 'Belts',
    id: 'Kukkaro_Black',
    displayName: 'Kukkaro (Black)',
    resourcePath: 'res://Items/Belts/Kukkaro/Kukkaro_Black.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_Kukkaro_Black.png-7cad12797daea9c1f2dc1f2cb35124e7.s3tc.ctex'
  },
  {
    category: 'Belts',
    id: 'Kukkaro_Brown',
    displayName: 'Kukkaro (Brown)',
    resourcePath: 'res://Items/Belts/Kukkaro/Kukkaro_Brown.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_Kukkaro_Brown.png-452a20e5eff60c009b591b5fc38150d9.s3tc.ctex'
  },
  {
    category: 'Belts',
    id: 'Kukkaro_Green',
    displayName: 'Kukkaro (Green)',
    resourcePath: 'res://Items/Belts/Kukkaro/Kukkaro_Green.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_Kukkaro_Green.png-3a75f4448b6f66fbc751cf7a77602247.s3tc.ctex'
  },
  {
    category: 'Belts',
    id: 'Kukkaro_M05',
    displayName: 'Kukkaro (M05)',
    resourcePath: 'res://Items/Belts/Kukkaro/Kukkaro_M05.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_Kukkaro_M05.png-d80913b04636bc8ec8c4f6936173a122.s3tc.ctex'
  },
  {
    category: 'Books',
    id: 'Book_Children',
    displayName: 'Book (Children)',
    resourcePath: 'res://Items/Books/Book_Children.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_Book_Children.png-87df35ddafc8c3be7e66eceb53d5e127.s3tc.ctex'
  },
  {
    category: 'Books',
    id: 'Book_Cooking',
    displayName: 'Book (Cooking)',
    resourcePath: 'res://Items/Books/Book_Cooking.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_Book_Cooking.png-67220f037eed6ea542d6178ee75f7d79.s3tc.ctex'
  },
  {
    category: 'Books',
    id: 'Book_Fishing',
    displayName: 'Book (Fishing)',
    resourcePath: 'res://Items/Books/Book_Fishing.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_Book_Fishing.png-e5e5ba2259321c57819beb205ff9c94e.s3tc.ctex'
  },
  {
    category: 'Books',
    id: 'Book_Religion',
    displayName: 'Book (Religion)',
    resourcePath: 'res://Items/Books/Book_Religion.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_Book_Religion.png-dc6102f614d7689809c4f49e0f0bb196.s3tc.ctex'
  },
  {
    category: 'Clothing',
    id: 'Boots_Combat',
    displayName: 'Combat Boots',
    resourcePath: 'res://Items/Clothing/Boots_Combat/Boots_Combat.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Boots_Combat.png-9f7b38179b35a93d2a3930322673b9d9.s3tc.ctex'
  },
  {
    category: 'Clothing',
    id: 'Beanie_Flame',
    displayName: 'Flame Beanie',
    resourcePath: 'res://Items/Clothing/Beanie_Flame/Beanie_Flame.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Beanie_Flame.png-3a780dc85a8e5a0e547505f43465de5b.s3tc.ctex'
  },
  {
    category: 'Clothing',
    id: 'Pants_Hiking',
    displayName: 'Hiking Pants',
    resourcePath: 'res://Items/Clothing/Pants_Hiking/Pants_Hiking.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_Pants_Hiking.png-de55054d477684832b11b5fe8d64fb54.s3tc.ctex'
  },
  {
    category: 'Clothing',
    id: 'Hoodie_Border_Zone',
    displayName: 'Hoodie (Border Zone)',
    resourcePath: 'res://Items/Clothing/Hoodie_Border_Zone/Hoodie_Border_Zone.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Hoodie_Border_Zone.png-505a7f7052e1cef45ef0b59ea0dab006.s3tc.ctex'
  },
  {
    category: 'Clothing',
    id: 'Hoodie_Gray',
    displayName: 'Hoodie (Gray)',
    resourcePath: 'res://Items/Clothing/Hoodie_Gray/Hoodie_Gray.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Hoodie_Gray.png-292f489136a7f576b09ea5ea7989d29d.s3tc.ctex'
  },
  {
    category: 'Clothing',
    id: 'Jeans_Black',
    displayName: 'Jeans (Black)',
    resourcePath: 'res://Items/Clothing/Jeans_Black/Jeans_Black.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_Jeans_Black.png-b5f5efcf98ebe800391c3154e54e5abe.s3tc.ctex'
  },
  {
    category: 'Clothing',
    id: 'Gloves_Leather',
    displayName: 'Leather Gloves',
    resourcePath: 'res://Items/Clothing/Gloves_Leather/Gloves_Leather.tres',
    iconFile: 'Icon_Gloves_Leather.png-08420816813a1b1e1b5d3c810c8935d3.s3tc.ctex'
  },
  {
    category: 'Clothing',
    id: 'Cap_M62',
    displayName: 'M62 Cap',
    resourcePath: 'res://Items/Clothing/Cap_M62/Cap_M62.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Cap_M62.png-d96aec9f188af3e9f9987c1be9e7f065.s3tc.ctex'
  },
  {
    category: 'Clothing',
    id: 'Jacket_M62',
    displayName: 'M62 Jacket',
    resourcePath: 'res://Items/Clothing/Jacket_M62/Jacket_M62.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Jacket_M62.png-8f445de9a7e63911b096e4bfd58a87ea.s3tc.ctex'
  },
  {
    category: 'Clothing',
    id: 'Hat_Mosquito',
    displayName: 'Mosquito Hat',
    resourcePath: 'res://Items/Clothing/Hat_Mosquito/Hat_Mosquito.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Hat_Mosquito.png-b1cfac481001781188406fc18201365b.s3tc.ctex'
  },
  {
    category: 'Clothing',
    id: 'Jacket_Santa',
    displayName: 'Santa Jacket',
    resourcePath: 'res://Items/Clothing/Jacket_Santa/Jacket_Santa.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Jacket_Santa.png-7e7668c74fbd72d21727d4074647f5b2.s3tc.ctex'
  },
  {
    category: 'Clothing',
    id: 'Hat_Sauna',
    displayName: 'Sauna Hat',
    resourcePath: 'res://Items/Clothing/Hat_Sauna/Hat_Sauna.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Hat_Sauna.png-5e03f27a73044008bbacd0cae9700441.s3tc.ctex'
  },
  {
    category: 'Clothing',
    id: 'Fleece_Tactical_Brown',
    displayName: 'Tactical Fleece (Brown)',
    resourcePath: 'res://Items/Clothing/Fleece_Tactical_Brown/Fleece_Tactical_Brown.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Fleece_Tactical_Brown.png-c4c638ec96400d11725e310eef2e4cd1.s3tc.ctex'
  },
  {
    category: 'Clothing',
    id: 'Fleece_Tactical_Green',
    displayName: 'Tactical Fleece (Green)',
    resourcePath: 'res://Items/Clothing/Fleece_Tactical_Green/Fleece_Tactical_Green.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Fleece_Tactical_Green.png-32f57f33c3e06506c191ae362b32bbc0.s3tc.ctex'
  },
  {
    category: 'Clothing',
    id: 'Windbreaker_Black',
    displayName: 'Windbreaker (Black)',
    resourcePath: 'res://Items/Clothing/Windbreaker_Black/Windbreaker_Black.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Windbreaker_Black.png-61f28c52d2e084682c7bb9de6a33ae4c.s3tc.ctex'
  },
  {
    category: 'Clothing',
    id: 'Windbreaker_Green',
    displayName: 'Windbreaker (Green)',
    resourcePath: 'res://Items/Clothing/Windbreaker_Green/Windbreaker_Green.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Windbreaker_Green.png-43a6a44d3c92b86ba078946d9c4a8f80.s3tc.ctex'
  },
  {
    category: 'Clothing',
    id: 'Jacket_Winter_Blue',
    displayName: 'Winter Jacket (Blue)',
    resourcePath: 'res://Items/Clothing/Jacket_Winter_Blue/Jacket_Winter_Blue.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Jacket_Winter_Blue.png-7712a27fbdaea589c3dffa5c28f8bd4b.s3tc.ctex'
  },
  {
    category: 'Clothing',
    id: 'Jacket_Winter_Red',
    displayName: 'Winter Jacket (Red)',
    resourcePath: 'res://Items/Clothing/Jacket_Winter_Red/Jacket_Winter_Red.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Jacket_Winter_Red.png-04506ce616b3a0a80e7c7f3439df2149.s3tc.ctex'
  },
  {
    category: 'Clothing',
    id: 'Gloves_Work',
    displayName: 'Work Gloves',
    resourcePath: 'res://Items/Clothing/Gloves_Work/Gloves_Work.tres',
    iconFile: 'Icon_Gloves_Work.png-0a4e05c6bdda8c8ce883e4eaa3592446.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Beer',
    displayName: 'Beer',
    resourcePath: 'res://Items/Consumables/Beer/Beer.tres',
    iconFile: 'Icon_Beer.png-d07f2d52abe17d510338faccf6eeb31a.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Canned_Meat',
    displayName: 'Canned Meat',
    resourcePath: 'res://Items/Consumables/Canned_Meat/Canned_Meat.tres',
    iconFile: 'Icon_Canned_Meat.png-b1c9359d4aca1b535817b502fc58fe8a.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Canned_Meatballs',
    displayName: 'Canned Meatballs',
    resourcePath: 'res://Items/Consumables/Canned_Meatballs/Canned_Meatballs.tres',
    iconFile: 'Icon_Canned_Meatballs.png-192f964974752b2d9b2c11a15d380818.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Canned_Pea_Soup',
    displayName: 'Canned Pea Soup',
    resourcePath: 'res://Items/Consumables/Canned_Pea_Soup/Canned_Pea_Soup.tres',
    iconFile: 'Icon_Canned_Pea_Soup.png-051afe9fe26152a282a62402101e51f9.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Canned_Peaches',
    displayName: 'Canned Peaches',
    resourcePath: 'res://Items/Consumables/Canned_Peaches/Canned_Peaches.tres',
    iconFile: 'Icon_Canned_Peaches.png-296ac697455a6319dd3a4246247bb2c8.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Canned_Pear',
    displayName: 'Canned Pear',
    resourcePath: 'res://Items/Consumables/Canned_Pear/Canned_Pear.tres',
    iconFile: 'Icon_Canned_Pear.png-3444555a4190fc37ca5572dc03b87f17.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Canned_Peas',
    displayName: 'Canned Peas',
    resourcePath: 'res://Items/Consumables/Canned_Peas/Canned_Peas.tres',
    iconFile: 'Icon_Canned_Peas.png-c9c882408d14d23e4cac1504228dcf6f.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Canned_Pineapple',
    displayName: 'Canned Pineapple',
    resourcePath: 'res://Items/Consumables/Canned_Pineapple/Canned_Pineapple.tres',
    iconFile: 'Icon_Canned_Pineapple.png-097ae3a81d05c45c72b33a704513056b.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Canned_Tomatoes',
    displayName: 'Canned Tomatoes',
    resourcePath: 'res://Items/Consumables/Canned_Tomatoes/Canned_Tomatoes.tres',
    iconFile: 'Icon_Canned_Tomatoes.png-94e120550ee57d760cd5660ee3d8c5e1.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Canned_Tuna',
    displayName: 'Canned Tuna',
    resourcePath: 'res://Items/Consumables/Canned_Tuna/Canned_Tuna.tres',
    iconFile: 'Icon_Canned_Tuna.png-6efbf81cf20dc8cb1d37ae49fd9a4763.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Cat_Food',
    displayName: 'Cat Food',
    resourcePath: 'res://Items/Consumables/Cat_Food/Cat_Food.tres',
    iconFile: 'Icon_Cat_Food.png-d0fcfea9cd895275c4b4f8cf8950ebc1.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Cigarettes',
    displayName: 'Cigarettes',
    resourcePath: 'res://Items/Consumables/Cigarettes/Cigarettes.tres',
    iconFile: 'Icon_Cigarettes.png-a07756c0bbd0ba233e3e90c921305149.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Cigars',
    displayName: 'Cigars',
    resourcePath: 'res://Items/Consumables/Cigars/Cigars.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Cigars.png-5d7d9424d90e8e3a1d8e58174d7e49a8.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Coffee',
    displayName: 'Coffee',
    resourcePath: 'res://Items/Consumables/Coffee/Coffee.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_Coffee.png-03e4bc22cc0a46717328b57dcd1ecb0b.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Coffee_Brewed',
    displayName: 'Coffee (Brewed)',
    resourcePath: 'res://Items/Consumables/Coffee_Brewed/Coffee_Brewed.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Coffee_Brewed.png-4983fa4aeb0963c0b778402f62e63e09.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Crackers',
    displayName: 'Crackers',
    resourcePath: 'res://Items/Consumables/Crackers/Crackers.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_Crackers.png-2c60af85cb107a22644981a46ba9e429.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Can_Empty',
    displayName: 'Empty Can',
    resourcePath: 'res://Items/Consumables/Can_Empty/Can_Empty.tres',
    iconFile: 'Icon_Can_Empty.png-8cd81596f96666c07c2c13348a6c1052.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Energy_Drink',
    displayName: 'Energy Drink',
    resourcePath: 'res://Items/Consumables/Energy_Drink/Energy_Drink.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_Energy_Drink.png-180e1cf913c35eef9b11161fbfb70e17.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Energy_Powder',
    displayName: 'Energy Powder',
    resourcePath: 'res://Items/Consumables/Energy_Powder/Energy_Powder.tres',
    iconFile: 'Icon_Energy_Powder.png-9de4c4a90f238af095a6fa6812566347.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Field_Ration',
    displayName: 'Field Ration',
    resourcePath: 'res://Items/Consumables/Field_Ration/Field_Ration.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Field_Ration.png-4377de5ae0fd52ae19371bbd39746a77.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Cooked_Fish_Soup',
    displayName: 'Fish Soup (Cooked)',
    resourcePath: 'res://Items/Consumables/Cooked_Fish_Soup/Cooked_Fish_Soup.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Cooked_Fish_Soup.png-cf781cc608462224dcd259c925305b05.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Juice_Orange',
    displayName: 'Juice (Orange)',
    resourcePath: 'res://Items/Consumables/Juice_Orange/Juice_Orange.tres',
    iconFile: 'Icon_Juice_Orange.png-c6c46ff9f4b33db944649b8b78e4e6d3.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Juice_Pear',
    displayName: 'Juice (Pear)',
    resourcePath: 'res://Items/Consumables/Juice_Pear/Juice_Pear.tres',
    iconFile: 'Icon_Juice_Pear.png-91c2fbb9a43314fd638cea2717ff8fc3.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Juice_Raspberry',
    displayName: 'Juice (Raspberry)',
    resourcePath: 'res://Items/Consumables/Juice_Raspberry/Juice_Raspberry.tres',
    iconFile: 'Icon_Juice_Raspberry.png-a0e8a2399a3e9655caa227ac5b13392d.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Kilju',
    displayName: 'Kilju',
    resourcePath: 'res://Items/Consumables/Kilju/Kilju.tres',
    sizeW: 3,
    sizeH: 3,
    iconFile: 'Icon_Kilju.png-7bb3c92ed88056e0e666cd016ea4cd80.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Kompot',
    displayName: 'Kompot',
    resourcePath: 'res://Items/Consumables/Kompot/Kompot.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Kompot.png-e272dd9c5f41c0cc96c3de3e0f233ccf.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Cooked_Meatballs',
    displayName: 'Meatballs (Cooked)',
    resourcePath: 'res://Items/Consumables/Cooked_Meatballs/Cooked_Meatballs.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Cooked_Meatballs.png-368d468322737840930f2cc5b176ffee.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Mustard',
    displayName: 'Mustard',
    resourcePath: 'res://Items/Consumables/Mustard/Mustard.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_Mustard.png-0fe3bb7008466c4e195f22c132c23efe.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Cooked_Pea_Soup',
    displayName: 'Pea Soup (Cooked)',
    resourcePath: 'res://Items/Consumables/Cooked_Pea_Soup/Cooked_Pea_Soup.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Cooked_Pea_Soup.png-b00bad161e1cde830f10f59d18f2bef3.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Peanuts',
    displayName: 'Peanuts',
    resourcePath: 'res://Items/Consumables/Peanuts/Peanuts.tres',
    iconFile: 'Icon_Peanuts.png-f901a1b5afbf928428e70ad4ad0d325e.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Potato',
    displayName: 'Potato',
    resourcePath: 'res://Items/Consumables/Potato/Potato.tres',
    iconFile: 'Icon_Potato.png-0141e5999ced025635c66d7137363bb3.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Salty_Liquorice',
    displayName: 'Salty Liquorice',
    resourcePath: 'res://Items/Consumables/Salty_Liquorice/Salty_Liquorice.tres',
    iconFile: 'Icon_Salty_Liquorice.png-3550ff0ef3a8ac9a20d7626cc044db39.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Snus',
    displayName: 'Snus',
    resourcePath: 'res://Items/Consumables/Snus/Snus.tres',
    iconFile: 'Icon_Snus.png-280d759536682a2a01c1fb9136ca0d48.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Soda_Lemon',
    displayName: 'Soda (Lemon)',
    resourcePath: 'res://Items/Consumables/Soda_Lemon/Soda_Lemon.tres',
    iconFile: 'Icon_Soda_Lemon.png-a67a4e1568e459a63e06ec8c152efd53.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Sugar',
    displayName: 'Sugar',
    resourcePath: 'res://Items/Consumables/Sugar/Sugar.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_Sugar.png-af617681a00c72c3005b71824d0b1286.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Cooked_Tomato_Soup',
    displayName: 'Tomato Soup (Cooked)',
    resourcePath: 'res://Items/Consumables/Cooked_Tomato_Soup/Cooked_Tomato_Soup.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Cooked_Tomato_Soup.png-398fff87624fda56c4dd0ea9da01011b.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Chocolate_War',
    displayName: 'War Chocolate',
    resourcePath: 'res://Items/Consumables/Chocolate_War/Chocolate_War.tres',
    iconFile: 'Icon_Chocolate_War.png-4ad4e6bbd3ee2cf8cf4d6d32bd1b6a18.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Water_Bottle',
    displayName: 'Water Bottle',
    resourcePath: 'res://Items/Consumables/Water_Bottle/Water_Bottle.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_Water_Bottle.png-e7f9b9b9dc69dcb70481de97b92e224d.s3tc.ctex'
  },
  {
    category: 'Consumables',
    id: 'Yeast',
    displayName: 'Yeast',
    resourcePath: 'res://Items/Consumables/Yeast/Yeast.tres',
    iconFile: 'Icon_Yeast.png-af7c8efc13615c7b827751b9b62b18d8.s3tc.ctex'
  },
  {
    category: 'Electronics',
    id: 'Alarm_Clock',
    displayName: 'Alarm Clock',
    resourcePath: 'res://Items/Electronics/Alarm_Clock/Alarm_Clock.tres',
    iconFile: 'Icon_Alarm_Clock.png-efdaf46146cc6d1bdb0c79cd8d942d56.s3tc.ctex'
  },
  {
    category: 'Electronics',
    id: 'Batteries',
    displayName: 'Batteries',
    resourcePath: 'res://Items/Electronics/Batteries/Batteries.tres',
    iconFile: 'Icon_Batteries.png-c51a06e3b31c94aeab7d1c81e04da1fd.s3tc.ctex'
  },
  {
    category: 'Electronics',
    id: 'Battery',
    displayName: 'Battery',
    resourcePath: 'res://Items/Electronics/Battery/Battery.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Battery.png-a87a0b70be7efb6591a0c6054a1adb85.s3tc.ctex'
  },
  {
    category: 'Electronics',
    id: 'Battery_Cables',
    displayName: 'Battery Cables',
    resourcePath: 'res://Items/Electronics/Battery_Cables/Battery_Cables.tres',
    iconFile: 'Icon_Battery_Cables.png-7c853612cd23c3f9a9007a45b187b9d9.s3tc.ctex'
  },
  {
    category: 'Electronics',
    id: 'Casette_Electrofolk',
    displayName: 'Casette (Electrofolk)',
    resourcePath: 'res://Items/Electronics/Casette_Electrofolk/Casette_Electrofolk.tres',
    iconFile: 'Icon_Casette_Electrofolk.png-7fa7ea0e07e2047b2a9d8d302ea29189.s3tc.ctex'
  },
  {
    category: 'Electronics',
    id: 'Casette_Nomad',
    displayName: 'Casette (Nomad)',
    resourcePath: 'res://Items/Electronics/Casette_Nomad/Casette_Nomad.tres',
    iconFile: 'Icon_Casette_Nomad.png-48a3ab2d4dfc0d229f60def9b799d6b2.s3tc.ctex'
  },
  {
    category: 'Electronics',
    id: 'Casette_OST',
    displayName: 'Casette (OST)',
    resourcePath: 'res://Items/Electronics/Casette_OST/Casette_OST.tres',
    iconFile: 'Icon_Casette_OST.png-21a38cbe1a780387f99dcea95498bcab.s3tc.ctex'
  },
  {
    category: 'Electronics',
    id: 'Casette_Radio',
    displayName: 'Casette (Radio Hits)',
    resourcePath: 'res://Items/Electronics/Casette_Radio/Casette_Radio.tres',
    iconFile: 'Icon_Casette_Radio.png-045817ddd7196da8b3337b8352113eff.s3tc.ctex'
  },
  {
    category: 'Electronics',
    id: 'Casette_Symphony',
    displayName: 'Casette (Symphony)',
    resourcePath: 'res://Items/Electronics/Casette_Symphony/Casette_Symphony.tres',
    iconFile: 'Icon_Casette_Symphony.png-94451c6bfae4be79c8851857ed591cdc.s3tc.ctex'
  },
  {
    category: 'Electronics',
    id: 'Casette_Player',
    displayName: 'Casette Player',
    resourcePath: 'res://Items/Electronics/Casette_Player/Casette_Player.tres',
    iconFile: 'Icon_Casette_Player.png-c3e6f03e451e324bdaae9d8cd08f612c.s3tc.ctex',
    showCondition: true
  },
  {
    category: 'Electronics',
    id: 'Coffeemaster',
    displayName: 'Coffeemaster',
    resourcePath: 'res://Items/Electronics/Coffeemaster/Coffeemaster.tres',
    sizeW: 3,
    sizeH: 3,
    iconFile: 'Icon_Coffeemaster.png-e9ab2b543e5085537ca42f56747e0052.s3tc.ctex'
  },
  {
    category: 'Electronics',
    id: 'Cooking_Station',
    displayName: 'Cooking Station',
    resourcePath: 'res://Items/Electronics/Cooking_Station/Cooking_Station.tres',
    sizeW: 3,
    sizeH: 3,
    iconFile: 'Icon_Cooking_Station.png-1d2a3f1f909fbd60e887be2f943d17f1.s3tc.ctex'
  },
  {
    category: 'Electronics',
    id: 'Hotplate',
    displayName: 'Hotplate',
    resourcePath: 'res://Items/Electronics/Hotplate/Hotplate.tres',
    sizeW: 3,
    sizeH: 2,
    iconFile: 'Icon_Hotplate.png-f83bce64eebc9b558d2332b3789cc17c.s3tc.ctex'
  },
  {
    category: 'Electronics',
    id: 'Inverter',
    displayName: 'Inverter',
    resourcePath: 'res://Items/Electronics/Inverter/Inverter.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_Inverter.png-68019dbe0e83400e1d378da9c3af647a.s3tc.ctex'
  },
  {
    category: 'Electronics',
    id: 'Narva',
    displayName: 'Narva',
    resourcePath: 'res://Items/Electronics/Narva/Narva.tres',
    iconFile: 'Icon_Narva.png-0217ce0e5d98c97f42e44fa028d10d89.s3tc.ctex',
    showCondition: true
  },
  {
    category: 'Electronics',
    id: 'Polaris',
    displayName: 'Polaris',
    resourcePath: 'res://Items/Electronics/Polaris/Polaris.tres',
    iconFile: 'Icon_Polaris.png-aeef0acef687114b2dbdb100dd45ed54.s3tc.ctex',
    showCondition: true
  },
  {
    category: 'Electronics',
    id: 'PV7',
    displayName: 'PV7',
    resourcePath: 'res://Items/Electronics/PV7/PV7.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_PV7.png-cdedefa2a266b1bc039c7918d4fbea9f.s3tc.ctex',
    showCondition: true
  },
  {
    category: 'Fishing',
    id: 'Bream',
    displayName: 'Bream',
    resourcePath: 'res://Items/Fishing/Bream/Bream.tres',
    sizeW: 3,
    sizeH: 2,
    iconFile: 'Icon_Bream.png-4c631a7e17869b71b1a5428cdf89e265.s3tc.ctex'
  },
  {
    category: 'Fishing',
    id: 'Fishing_Rod',
    displayName: 'Fishing Rod',
    resourcePath: 'res://Items/Fishing/Fishing_Rod/Fishing_Rod.tres',
    sizeW: 6,
    sizeH: 1,
    iconFile: 'Icon_Fishing_Rod.png-a7592b83f789592a4337777613da3bcf.s3tc.ctex'
  },
  {
    category: 'Fishing',
    id: 'Perch',
    displayName: 'Perch',
    resourcePath: 'res://Items/Fishing/Perch/Perch.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_Perch.png-42fd089bfc88e3cc66677dbbb5821dcb.s3tc.ctex'
  },
  {
    category: 'Fishing',
    id: 'Pike',
    displayName: 'Pike',
    resourcePath: 'res://Items/Fishing/Pike/Pike.tres',
    sizeW: 5,
    sizeH: 2,
    iconFile: 'Icon_Pike.png-2b46529b67b4f5b4a92c0c26210fb1ff.s3tc.ctex'
  },
  {
    category: 'Fishing',
    id: 'Roach',
    displayName: 'Roach',
    resourcePath: 'res://Items/Fishing/Roach/Roach.tres',
    iconFile: 'Icon_Roach.png-f9cec5d0630ea01a7042ae9acb6fc102.s3tc.ctex'
  },
  {
    category: 'Grenades',
    id: 'F1',
    displayName: 'F1',
    resourcePath: 'res://Items/Grenades/F1/F1.tres',
    iconFile: 'Icon_F1.png-3d438aa5ca39605448e4dbf3555ea37b.s3tc.ctex'
  },
  {
    category: 'Grenades',
    id: 'M43',
    displayName: 'M43',
    resourcePath: 'res://Items/Grenades/M43/M43.tres',
    iconFile: 'Icon_M43.png-195237f16d6e816afb4f869d0eb83984.s3tc.ctex'
  },
  {
    category: 'Grenades',
    id: 'M50',
    displayName: 'M50',
    resourcePath: 'res://Items/Grenades/M50/M50.tres',
    iconFile: 'Icon_M50.png-e861673c32d96839faa6f9c344b58612.s3tc.ctex'
  },
  {
    category: 'Grenades',
    id: 'RGD-5',
    displayName: 'RGD-5',
    resourcePath: 'res://Items/Grenades/RGD-5/RGD-5.tres',
    iconFile: 'Icon_RGD-5.png-6cedf186cfa7d4bb945adbb2888d1726.s3tc.ctex'
  },
  {
    category: 'Helmets',
    id: 'Helmet_Police',
    displayName: 'Police Helmet (IIIA)',
    resourcePath: 'res://Items/Helmets/Helmet_Police/Helmet_Police.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Helmet_Police.png-08476abc1799bee433c7696350d70eea.s3tc.ctex',
    showCondition: true
  },
  {
    category: 'Helmets',
    id: 'SSh-39',
    displayName: 'SSh-39 (II)',
    resourcePath: 'res://Items/Helmets/SSh-39/SSh-39.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_SSh-39.png-1116cea93367083ece65f5d9352675e0.s3tc.ctex',
    showCondition: true
  },
  {
    category: 'Instruments',
    id: 'Guitar',
    displayName: 'Guitar',
    resourcePath: 'res://Items/Instruments/Guitar/Guitar.tres',
    sizeW: 5,
    sizeH: 2,
    iconFile: 'Icon_Guitar.png-40e99485b0afc380ccbf955525867016.s3tc.ctex'
  },
  {
    category: 'Instruments',
    id: 'Harmonica',
    displayName: 'Harmonica',
    resourcePath: 'res://Items/Instruments/Harmonica/Harmonica.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_Harmonica.png-54943cc1c10a9bf3002fa2665ab7d4f6.s3tc.ctex'
  },
  {
    category: 'Keys',
    id: 'Key_Attic',
    displayName: 'Attic Key',
    resourcePath: 'res://Items/Keys/Key_Attic.tres',
    iconFile: 'Icon_Key_Attic.png-9e40e33f792513695c480ea626526c1e.s3tc.ctex'
  },
  {
    category: 'Keys',
    id: 'Key_Bunker',
    displayName: 'Bunker Key',
    resourcePath: 'res://Items/Keys/Key_Bunker.tres',
    iconFile: 'Icon_Key_Bunker.png-2236e15cab1d238f255c51ec0004f856.s3tc.ctex'
  },
  {
    category: 'Keys',
    id: 'Key_Cellar',
    displayName: 'Cellar Key',
    resourcePath: 'res://Items/Keys/Key_Cellar.tres',
    iconFile: 'Icon_Key_Cellar.png-fa7a60bae98928ef6a2bec62a390dda5.s3tc.ctex'
  },
  {
    category: 'Keys',
    id: 'Key_Classroom',
    displayName: 'Classroom Key',
    resourcePath: 'res://Items/Keys/Key_Classroom.tres',
    iconFile: 'Icon_Key_Classroom.png-f3092845ee35c8a5bd63dafd6bb4cfa6.s3tc.ctex'
  },
  {
    category: 'Keys',
    id: 'Key_Gymnasium',
    displayName: 'Gymnasium Key',
    resourcePath: 'res://Items/Keys/Key_Gymnasium.tres',
    iconFile: 'Icon_Key_Gymnasium.png-9fb0facd5903c5d845d0d1d1cfece493.s3tc.ctex'
  },
  {
    category: 'Keys',
    id: 'Key_Tunnel',
    displayName: 'Tunnel Key',
    resourcePath: 'res://Items/Keys/Key_Tunnel.tres',
    iconFile: 'Icon_Key_Tunnel.png-6894e7e76aa97160841b9baaf3aec37e.s3tc.ctex'
  },
  {
    category: 'Knives',
    id: 'Jaeger_140',
    displayName: 'Jaeger 140',
    resourcePath: 'res://Items/Knives/Jaeger_140/Jaeger_140.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_Jaeger_140.png-f62536d78a4ca0ef40607dbac56abc41.s3tc.ctex'
  },
  {
    category: 'Knives',
    id: 'Skrama_200',
    displayName: 'Skrama 200',
    resourcePath: 'res://Items/Knives/Skrama_200/Skrama_200.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_Skrama_200.png-680f47696df834a45dfbca7143bfb465.s3tc.ctex'
  },
  {
    category: 'Knives',
    id: 'Skrama_240',
    displayName: 'Skrama 240',
    resourcePath: 'res://Items/Knives/Skrama_240/Skrama_240.tres',
    sizeW: 3,
    sizeH: 1,
    iconFile: 'Icon_Skrama_240.png-307387c167f5bb645fd2818a45da4854.s3tc.ctex'
  },
  {
    category: 'Lore',
    id: 'Cat',
    displayName: 'Cat',
    resourcePath: 'res://Items/Lore/Cat/Cat.tres',
    sizeW: 5,
    sizeH: 3,
    iconFile: 'Icon_Box.png-f820cf45db417f82069ed7d540bd6e23.s3tc.ctex'
  },
  {
    category: 'Lore',
    id: 'Oil_Sample',
    displayName: 'Oil Sample',
    resourcePath: 'res://Items/Lore/Oil_Sample/Oil_Sample.tres',
    sizeW: 2,
    sizeH: 6,
    iconFile: 'Icon_Oil_Sample.png-dba8017604a1a83497efca1aa1ead89c.s3tc.ctex'
  },
  {
    category: 'Lore',
    id: 'Patient_Report',
    displayName: 'Patient Report',
    resourcePath: 'res://Items/Lore/Patient_Report/Patient_Report.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Patient_Report.png-f0d89eb8ce7d184d50c65f176b2bf768.s3tc.ctex'
  },
  {
    category: 'Medical',
    id: 'AFAK',
    displayName: 'AFAK',
    resourcePath: 'res://Items/Medical/AFAK/AFAK.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_AFAK.png-3496fa1cbbe9bcae0b42518522d395a3.s3tc.ctex'
  },
  {
    category: 'Medical',
    id: 'Antibiotics',
    displayName: 'Antibiotics',
    resourcePath: 'res://Items/Medical/Antibiotics/Antibiotics.tres',
    iconFile: 'Icon_Antibiotics.png-062124f9cbdbdf5fd57a2ce2ad54c482.s3tc.ctex'
  },
  {
    category: 'Medical',
    id: 'Antiseptic',
    displayName: 'Antiseptic',
    resourcePath: 'res://Items/Medical/Antiseptic/Antiseptic.tres',
    iconFile: 'Icon_Antiseptic.png-92f79c2643aa0aae52363e26926ed86b.s3tc.ctex'
  },
  {
    category: 'Medical',
    id: 'Balm',
    displayName: 'Balm',
    resourcePath: 'res://Items/Medical/Balm/Balm.tres',
    iconFile: 'Icon_Balm.png-3fecb4de20f72e87d781fab38e7488eb.s3tc.ctex'
  },
  {
    category: 'Medical',
    id: 'Bandage',
    displayName: 'Bandage',
    resourcePath: 'res://Items/Medical/Bandage/Bandage.tres',
    iconFile: 'Icon_Bandage.png-379f5137a26403fd8ca9d28c185f0640.s3tc.ctex'
  },
  {
    category: 'Medical',
    id: 'Bandage_Improvised',
    displayName: 'Bandage (Improvised)',
    resourcePath: 'res://Items/Medical/Bandage_Improvised/Bandage_Improvised.tres',
    iconFile: 'Icon_Bandage_Improvised.png-a0bd5fbadc0470921cbf9277037866ea.s3tc.ctex'
  },
  {
    category: 'Medical',
    id: 'Cold_Medicine',
    displayName: 'Cold Medicine',
    resourcePath: 'res://Items/Medical/Cold_Medicine/Cold_Medicine.tres',
    iconFile: 'Icon_Cold_Medicine.png-75ac251721769dce9bbab0bc8d588c8d.s3tc.ctex'
  },
  {
    category: 'Medical',
    id: 'Deodorant',
    displayName: 'Deodorant',
    resourcePath: 'res://Items/Medical/Deodorant/Deodorant.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_Deodorant.png-690a3d95e018ad538fb1acd218616608.s3tc.ctex'
  },
  {
    category: 'Medical',
    id: 'IFAK',
    displayName: 'IFAK',
    resourcePath: 'res://Items/Medical/IFAK/IFAK.tres',
    iconFile: 'Icon_IFAK.png-db852219c31753e1076ebbd1bed34f5d.s3tc.ctex'
  },
  {
    category: 'Medical',
    id: 'Lotion',
    displayName: 'Lotion',
    resourcePath: 'res://Items/Medical/Lotion/Lotion.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_Lotion.png-085a85464cb3eada8d65a343a20af0c8.s3tc.ctex'
  },
  {
    category: 'Medical',
    id: 'Medkit',
    displayName: 'Medkit',
    resourcePath: 'res://Items/Medical/Medkit/Medkit.tres',
    sizeW: 3,
    sizeH: 2,
    iconFile: 'Icon_Medkit.png-c334b0d91fdb42636431f31abe11823a.s3tc.ctex'
  },
  {
    category: 'Medical',
    id: 'Melatonin',
    displayName: 'Melatonin',
    resourcePath: 'res://Items/Medical/Melatonin/Melatonin.tres',
    iconFile: 'Icon_Melatonin.png-8da15977309437085f2651c60ad72375.s3tc.ctex'
  },
  {
    category: 'Medical',
    id: 'Painkillers',
    displayName: 'Painkill.',
    resourcePath: 'res://Items/Medical/Painkillers/Painkillers.tres',
    iconFile: 'Icon_Painkillers.png-c2889663f9408b75b42f88cd656db2c4.s3tc.ctex'
  },
  {
    category: 'Medical',
    id: 'Saline',
    displayName: 'Saline',
    resourcePath: 'res://Items/Medical/Saline/Saline.tres',
    iconFile: 'Icon_Saline.png-3bd1204d9957d44b81d26515491a44a9.s3tc.ctex'
  },
  {
    category: 'Medical',
    id: 'Splint',
    displayName: 'Splint',
    resourcePath: 'res://Items/Medical/Splint/Splint.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_Splint.png-381fef5bf5ac8f1c1d9dedfb5e6d658b.s3tc.ctex'
  },
  {
    category: 'Medical',
    id: 'Splint_Improvised',
    displayName: 'Splint (Improvised)',
    resourcePath: 'res://Items/Medical/Splint_Improvised/Splint_Improvised.tres',
    sizeW: 3,
    sizeH: 1,
    iconFile: 'Icon_Splint_Improvised.png-6c7f33ece5b2cd68a18c991bb213a2cb.s3tc.ctex'
  },
  {
    category: 'Medical',
    id: 'Thermal_Blanket',
    displayName: 'Thermal Blanket',
    resourcePath: 'res://Items/Medical/Thermal_Blanket/Thermal_Blanket.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Thermal_Blanket.png-c3424b6bd9f6015ec2bae80c7d22c4bc.s3tc.ctex'
  },
  {
    category: 'Medical',
    id: 'Tissues',
    displayName: 'Tissues',
    resourcePath: 'res://Items/Medical/Tissues/Tissues.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Tissues.png-fdb0f72d12cc92a33cee74bc136f7b4a.s3tc.ctex'
  },
  {
    category: 'Medical',
    id: 'Tourniquet',
    displayName: 'Tourniquet',
    resourcePath: 'res://Items/Medical/Tourniquet/Tourniquet.tres',
    iconFile: 'Icon_Tourniquet.png-c7f40bcf051758f49494e11f3fd72fec.s3tc.ctex'
  },
  {
    category: 'Medical',
    id: 'Tourniquet_Improvised',
    displayName: 'Tourniquet (Improvised)',
    resourcePath: 'res://Items/Medical/Tourniquet_Improvised/Tourniquet_Improvised.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_Tourniquet_Improvised.png-6845f57deaa73015d0e3741740ee3191.s3tc.ctex'
  },
  {
    category: 'Medical',
    id: 'Wipes',
    displayName: 'Wipes',
    resourcePath: 'res://Items/Medical/Wipes/Wipes.tres',
    iconFile: 'Icon_Wipes.png-d32ae7cc1b2fddda9be5673cb02d6d69.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Blanket',
    displayName: 'Blanket',
    resourcePath: 'res://Items/Misc/Blanket/Blanket.tres',
    sizeW: 6,
    sizeH: 2,
    iconFile: 'Icon_Blanket.png-52eb87c8317437d15232e79199c85891.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Board_Game',
    displayName: 'Board Game',
    resourcePath: 'res://Items/Misc/Board_Game/Board_Game.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Board_Game.png-bc585e7f1a62a194f48b4daa2bcf33de.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Bucket',
    displayName: 'Bucket',
    resourcePath: 'res://Items/Misc/Bucket/Bucket.tres',
    sizeW: 3,
    sizeH: 3,
    iconFile: 'Icon_Bucket.png-eeae93602115b523c1e5208c86774645.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Coffee_Filter',
    displayName: 'Coffee Filter',
    resourcePath: 'res://Items/Misc/Coffee_Filter/Coffee_Filter.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Coffee_Filter.png-9a1976d00ceed381c8aa6b4d5f5c3b96.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Duct_Tape',
    displayName: 'Duct Tape',
    resourcePath: 'res://Items/Misc/Duct_Tape/Duct_Tape.tres',
    iconFile: 'Icon_Duct_Tape.png-1eb5a56d28b68f0c7b64f93c6401af04.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Happy_Stove',
    displayName: 'Happy Stove',
    resourcePath: 'res://Items/Misc/Happy_Stove/Happy_Stove.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Happy_Stove.png-cbeaf9b33fc9cf933952ecc213e37381.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Jerry_Can',
    displayName: 'Jerry Can',
    resourcePath: 'res://Items/Misc/Jerry_Can/Jerry_Can.tres',
    sizeW: 3,
    sizeH: 3,
    iconFile: 'Icon_Jerry_Can.png-f7c07b9deb4b27ae92071eeb7d88190e.s3tc.ctex',
    showCondition: true
  },
  {
    category: 'Misc',
    id: 'Lumber',
    displayName: 'Lumber',
    resourcePath: 'res://Items/Misc/Lumber/Lumber.tres',
    sizeW: 8,
    sizeH: 2,
    iconFile: 'Icon_Lumber.png-1b554534a072ebe1e452fa26a56b53df.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Map',
    displayName: 'Map',
    resourcePath: 'res://Items/Misc/Map/Map.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Map.png-e521a23785e0dd89d7446b72a89e6cf2.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Map_Tactical',
    displayName: 'Map (Tactical)',
    resourcePath: 'res://Items/Misc/Map_Tactical/Map_Tactical.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_Map_Tactical.png-391af5b9c79d43586ba1e7fd175e97ca.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Matches',
    displayName: 'Matches',
    resourcePath: 'res://Items/Misc/Matches/Matches.tres',
    iconFile: 'Icon_Matches.png-61d12284830ac1bc82abca79c00ff373.s3tc.ctex',
    stackable: true,
    showAmount: true,
    defaultAmount: 20,
    maxAmount: 300
  },
  {
    category: 'Misc',
    id: 'Mattress',
    displayName: 'Mattress',
    resourcePath: 'res://Items/Misc/Mattress/Mattress.tres',
    sizeW: 7,
    sizeH: 3,
    iconFile: 'Icon_Mattress.png-8b2f59104f2a624cae12cc82bc26aa9f.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Mess_Kit',
    displayName: 'Mess Kit',
    resourcePath: 'res://Items/Misc/Mess_Kit/Mess_Kit.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Mess_Kit.png-77570707e0f80aea76b123558169093d.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Nails',
    displayName: 'Nails',
    resourcePath: 'res://Items/Misc/Nails/Nails.tres',
    sizeW: 2,
    sizeH: 1,
    iconFile: 'Icon_Nails.png-80745634d9c5882ff7c6be5e824efcc7.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Oil_Filter',
    displayName: 'Oil Filter',
    resourcePath: 'res://Items/Misc/Oil_Filter/Oil_Filter.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_Oil_Filter.png-4640485f861df1556adccca222511334.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Pillow',
    displayName: 'Pillow',
    resourcePath: 'res://Items/Misc/Pillow/Pillow.tres',
    sizeW: 3,
    sizeH: 2,
    iconFile: 'Icon_Pillow.png-366c357c052e3d7dc31e15e8b3163a2e.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Rags',
    displayName: 'Rags',
    resourcePath: 'res://Items/Misc/Rags/Rags.tres',
    sizeW: 1,
    sizeH: 2,
    iconFile: 'Icon_Rags.png-f49e112ff480c796d614771eaeabad42.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Sleeping_Bag',
    displayName: 'Sleeping Bag',
    resourcePath: 'res://Items/Misc/Sleeping_Bag/Sleeping_Bag.tres',
    sizeW: 2,
    sizeH: 3,
    iconFile: 'Icon_Sleeping_Bag.png-80c71632e76053ee8c11ceb877914e4e.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Sticks',
    displayName: 'Sticks',
    resourcePath: 'res://Items/Misc/Sticks/Sticks.tres',
    sizeW: 3,
    sizeH: 1,
    iconFile: 'Icon_Sticks.png-8d3462db27bf867c236bb8fdf150c764.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Tackle_Box',
    displayName: 'Tackle Box',
    resourcePath: 'res://Items/Misc/Tackle_Box/Tackle_Box.tres',
    sizeW: 3,
    sizeH: 2,
    iconFile: 'Icon_Tackle_Box.png-42dffe24df6b61fcaa32fc0c701ffc5c.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Toilet_Paper',
    displayName: 'Toilet Paper',
    resourcePath: 'res://Items/Misc/Toilet_Paper/Toilet_Paper.tres',
    iconFile: 'Icon_Toilet_Paper.png-433793247ac5b17e966e18d853743e55.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Toolbox',
    displayName: 'Toolbox',
    resourcePath: 'res://Items/Misc/Toolbox/Toolbox.tres',
    sizeW: 3,
    sizeH: 2,
    iconFile: 'Icon_Toolbox.png-d0b44835d071c7004b1af42cf4ae25a2.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Water_Lock',
    displayName: 'Water Lock',
    resourcePath: 'res://Items/Misc/Water_Lock/Water_Lock.tres',
    iconFile: 'Icon_Water_Lock.png-638324466e7a1cda70c81e80f56a5433.s3tc.ctex'
  },
  {
    category: 'Misc',
    id: 'Weapon_Repair_Kit',
    displayName: 'Weapon Repair Kit',
    resourcePath: 'res://Items/Misc/Weapon_Repair_Kit/Weapon_Repair_Kit.tres',
    sizeW: 3,
    sizeH: 2,
    iconFile: 'Icon_Weapon_Repair_Kit.png-77e1a1abbe94a2f7bf127564eecda17e.s3tc.ctex'
  },
  {
    category: 'Rigs',
    id: 'Vest_Fishing',
    displayName: 'Fishing Vest',
    resourcePath: 'res://Items/Rigs/Vest_Fishing/Vest_Fishing.tres',
    sizeW: 3,
    sizeH: 4
  },
  {
    category: 'Rigs',
    id: 'K19',
    displayName: 'K19',
    resourcePath: 'res://Items/Rigs/K19/K19.tres',
    sizeW: 3,
    sizeH: 3,
    iconFile: 'Icon_K19.png-1b3ef164b2bb5e574270863cac9387da.s3tc.ctex'
  },
  {
    category: 'Rigs',
    id: 'LVPC_Green',
    displayName: 'LVPC (Green)',
    resourcePath: 'res://Items/Rigs/LVPC/LVPC_Green.tres',
    sizeW: 3,
    sizeH: 3,
    iconFile: 'Icon_LVPC_Green.png-66ac4a5a9f4f8ba78ec884e9ddc9e60e.s3tc.ctex'
  },
  {
    category: 'Rigs',
    id: 'LVPC_M05',
    displayName: 'LVPC (M05)',
    resourcePath: 'res://Items/Rigs/LVPC/LVPC_M05.tres',
    sizeW: 3,
    sizeH: 3,
    iconFile: 'Icon_LVPC_M05.png-dd28b4ec476a3f4d2e694a81420f108b.s3tc.ctex'
  },
  {
    category: 'Rigs',
    id: 'LVPC_Winter',
    displayName: 'LVPC (Winter)',
    resourcePath: 'res://Items/Rigs/LVPC/LVPC_Winter.tres',
    sizeW: 3,
    sizeH: 3,
    iconFile: 'Icon_LVPC_Winter.png-1bd29dba8d05bb46b9266bbe2f57607c.s3tc.ctex'
  },
  {
    category: 'Weapons',
    id: 'Colt_1911',
    displayName: 'C1911',
    resourcePath: 'res://Items/Weapons/Colt_1911/Colt_1911.tres',
    sizeW: 3,
    sizeH: 2,
    iconFile: 'Icon_Colt_1911.png-d04198a346b1bf2e2406bfe0766c0f56.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'Glock_17',
    displayName: 'G7',
    resourcePath: 'res://Items/Weapons/Glock_17/Glock_17.tres',
    sizeW: 3,
    sizeH: 2,
    iconFile: 'Icon_Glock_17.png-56de74b8c1ae3841be73c1a7256538d4.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'HK416',
    displayName: 'K416',
    resourcePath: 'res://Items/Weapons/HK416/HK416.tres',
    sizeW: 6,
    sizeH: 2,
    iconFile: 'Icon_HK416.png-4af939f2e96952d3b967f5948e8f0212.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'AK-12',
    displayName: 'KA-12',
    resourcePath: 'res://Items/Weapons/AK-12/AK-12.tres',
    sizeW: 6,
    sizeH: 2,
    iconFile: 'Icon_AK-12.png-2d442005495c142c784901b2332a26ca.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'AKM',
    displayName: 'KA-M',
    resourcePath: 'res://Items/Weapons/AKM/AKM.tres',
    sizeW: 6,
    sizeH: 2,
    iconFile: 'Icon_AKM.png-a5e5b075e6186ca91a04f3db4ba2b70e.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'KAR-21_223',
    displayName: 'KAR-21 (.223)',
    resourcePath: 'res://Items/Weapons/KAR-21/KAR-21_223.tres',
    sizeW: 6,
    sizeH: 2,
    iconFile: 'Icon_KAR-21_223.png-3a8cb87927e2206be77557170961a9d0.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'KAR-21_308',
    displayName: 'KAR-21 (.308)',
    resourcePath: 'res://Items/Weapons/KAR-21/KAR-21_308.tres',
    sizeW: 6,
    sizeH: 2,
    iconFile: 'Icon_KAR-21_308.png-3b47b9accf38892a3cd333650ebde20b.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'Makarov',
    displayName: 'Karov',
    resourcePath: 'res://Items/Weapons/Makarov/Makarov.tres',
    sizeW: 2,
    sizeH: 2,
    iconFile: 'Icon_Makarov.png-405c8d50cb922dd9b3e89fd44a12eeba.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'AKS-74U',
    displayName: 'KAS-74U',
    resourcePath: 'res://Items/Weapons/AKS-74U/AKS-74U.tres',
    sizeW: 5,
    sizeH: 2,
    iconFile: 'Icon_AKS-74U.png-90e5a268906203cd2c1313134363c019.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'MK18',
    displayName: 'KM18',
    resourcePath: 'res://Items/Weapons/MK18/MK18.tres',
    sizeW: 6,
    sizeH: 2,
    iconFile: 'Icon_MK18.png-b08c5d7af5d1eab4a25b1c10f680d02f.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'KP-31',
    displayName: 'KP-31',
    resourcePath: 'res://Items/Weapons/KP-31/KP-31.tres',
    sizeW: 5,
    sizeH: 2,
    iconFile: 'Icon_KP-31.png-630bf263af6357252671f11a1df403d5.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'M4A1',
    displayName: 'M4A1',
    resourcePath: 'res://Items/Weapons/M4A1/M4A1.tres',
    sizeW: 6,
    sizeH: 2,
    iconFile: 'Icon_M4A1.png-0db8c30d05ccbfd4c639d3eabc130058.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'M78',
    displayName: 'M78',
    resourcePath: 'res://Items/Weapons/M78/M78.tres',
    sizeW: 7,
    sizeH: 2,
    iconFile: 'Icon_M78.png-b211a43aabebb5a8a022b3bdc2fee3eb.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'Mosin',
    displayName: 'Mosin',
    resourcePath: 'res://Items/Weapons/Mosin/Mosin.tres',
    sizeW: 7,
    sizeH: 2,
    iconFile: 'Icon_Mosin.png-e9e70076d2cba0e1505989ceca545e2e.s3tc.ctex',
    showCondition: true,
    maxAmount: 5,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'P320',
    displayName: 'P3',
    resourcePath: 'res://Items/Weapons/P320/P320.tres',
    sizeW: 3,
    sizeH: 2,
    iconFile: 'Icon_P320.png-07e594e8dd9a1cfc0f80508308122330.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'MP5',
    displayName: 'PM5',
    resourcePath: 'res://Items/Weapons/MP5/MP5.tres',
    sizeW: 4,
    sizeH: 2,
    iconFile: 'Icon_MP5.png-d3158bee1a1245fc7a9b517243d74b11.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'MP5K',
    displayName: 'PM5-K',
    resourcePath: 'res://Items/Weapons/MP5K/MP5K.tres',
    sizeW: 3,
    sizeH: 2,
    iconFile: 'Icon_MP5K.png-e7939db88fbc8f75040b86db66b4983f.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'MP5SD',
    displayName: 'PM5-SD',
    resourcePath: 'res://Items/Weapons/MP5SD/MP5SD.tres',
    sizeW: 5,
    sizeH: 2,
    iconFile: 'Icon_MP5SD.png-202ed76f0ea183a93e58ef567ec5773c.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'MP7',
    displayName: 'PM7',
    resourcePath: 'res://Items/Weapons/MP7/MP7.tres',
    sizeW: 4,
    sizeH: 2,
    iconFile: 'Icon_MP7.png-89d2304a0e229ba6720f93cba344672f.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'RK-62',
    displayName: 'RK-62',
    resourcePath: 'res://Items/Weapons/RK-62/RK-62.tres',
    sizeW: 6,
    sizeH: 2,
    iconFile: 'Icon_RK-62.png-0d920b8f46caa1934d34d8e564158c96.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'RK-62M',
    displayName: 'RK-62M',
    resourcePath: 'res://Items/Weapons/RK-62/RK-62M.tres',
    sizeW: 6,
    sizeH: 2,
    iconFile: 'Icon_RK-62M.png-b33fff579595a2a9c8699146c59dd89c.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'RK-95',
    displayName: 'RK-95',
    resourcePath: 'res://Items/Weapons/RK-95/RK-95.tres',
    sizeW: 6,
    sizeH: 2,
    iconFile: 'Icon_RK-95.png-784355bf7d5444962ad93ebbf54e0bba.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'Remington_870',
    displayName: 'RM-870',
    resourcePath: 'res://Items/Weapons/Remington_870/Remington_870.tres',
    sizeW: 6,
    sizeH: 2,
    iconFile: 'Icon_Remington_870.png-6652b0a2ca21b5cbb79e436f0453d033.s3tc.ctex',
    showCondition: true,
    maxAmount: 8,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'VSS',
    displayName: 'SSV',
    resourcePath: 'res://Items/Weapons/VSS/VSS.tres',
    sizeW: 5,
    sizeH: 2,
    iconFile: 'Icon_VSS.png-012df67ff9fa46d22b9bd4d563786396.s3tc.ctex',
    showCondition: true,
    repairs: true
  },
  {
    category: 'Weapons',
    id: 'SVD',
    displayName: 'VSD',
    resourcePath: 'res://Items/Weapons/SVD/SVD.tres',
    sizeW: 8,
    sizeH: 2,
    iconFile: 'Icon_SVD.png-8f99dac97356038d43aa0e3bad7f7087.s3tc.ctex',
    showCondition: true,
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

export function getItemSize(item: GameItem): { w: number; h: number } {
  return { w: item.sizeW ?? 1, h: item.sizeH ?? 1 }
}
