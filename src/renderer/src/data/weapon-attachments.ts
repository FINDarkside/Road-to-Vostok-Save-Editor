export interface AttachmentOverlay {
  /** Resource path of the attachment (matches ITEMS_BY_PATH keys) */
  attachmentPath: string
  /** Position in weapon's local coordinate space (from tetris .tscn) */
  position: [number, number]
  /** Scale from weapon tetris scene (default 0.5 from sub-scene if not overridden) */
  scale: number
  /** Rotation in radians */
  rotation?: number
  /** Render behind the weapon icon */
  behind?: boolean
}

/** Attachment overlay positions per weapon, keyed by weapon resource path */
export const WEAPON_ATTACHMENT_LAYOUTS = new Map<string, AttachmentOverlay[]>([
  [
    'res://Items/Weapons/Colt_1911/Colt_1911.tres',
    [
      {
        attachmentPath: 'res://Items/Weapons/Colt_1911/Colt_1911_Magazine.tres',
        position: [-74, 14],
        scale: 1.2,
        behind: true
      },
      {
        attachmentPath: 'res://Items/Attachments/Rider/Rider.tres',
        position: [212, -62],
        scale: 0.8,
        behind: true
      }
    ]
  ],
  [
    'res://Items/Weapons/Glock_17/Glock_17.tres',
    [
      {
        attachmentPath: 'res://Items/Weapons/Glock_17/Glock_17_Magazine.tres',
        position: [-68, 14],
        scale: 1.4,
        behind: true
      },
      {
        attachmentPath: 'res://Items/Attachments/Rider/Rider.tres',
        position: [222, -56],
        scale: 1,
        behind: true
      },
      { attachmentPath: 'res://Items/Attachments/RMR/RMR.tres', position: [-56, -86], scale: 0.6 },
      { attachmentPath: 'res://Items/Attachments/SRO/SRO.tres', position: [-54, -88], scale: 0.6 }
    ]
  ],
  [
    'res://Items/Weapons/HK416/HK416.tres',
    [
      {
        attachmentPath: 'res://Items/Attachments/ACOG/ACOG.tres',
        position: [-42, -98],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Attachments/EXPS/EXPS.tres',
        position: [-24, -96],
        scale: 0.6
      },
      { attachmentPath: 'res://Items/Attachments/HMR/HMR.tres', position: [-28, -102], scale: 0.6 },
      {
        attachmentPath: 'res://Items/Attachments/Hybrid/Hybrid.tres',
        position: [310, -46],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Kobra/Kobra.tres',
        position: [-24, -88],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Leopard/Leopard.tres',
        position: [-10, -96],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Micro/Micro.tres',
        position: [-32, -86],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Monster/Monster.tres',
        position: [304, -46],
        scale: 0.5
      },
      { attachmentPath: 'res://Items/Attachments/MRO/MRO.tres', position: [-36, -90], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/OZ5/OZ5.tres', position: [142, -46], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/PRO/PRO.tres', position: [-24, -94], scale: 0.5 },
      {
        attachmentPath: 'res://Items/Attachments/SOCOM/SOCOM.tres',
        position: [306, -46],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Thor/Thor.tres',
        position: [316, -46],
        scale: 0.55
      },
      {
        attachmentPath: 'res://Items/Attachments/Vudu/Vudu.tres',
        position: [-12, -96],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Weapons/HK416/HK416_Magazine.tres',
        position: [2, 34],
        scale: 0.8,
        behind: true
      },
      {
        attachmentPath: 'res://Items/Attachments/ANPEQ/ANPEQ.tres',
        position: [150, -46],
        scale: 0.6
      }
    ]
  ],
  [
    'res://Items/Weapons/AK-12/AK-12.tres',
    [
      {
        attachmentPath: 'res://Items/Attachments/ACOG/ACOG.tres',
        position: [-76, -78],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Weapons/AK-12/AK-12_Magazine.tres',
        position: [-24, 36],
        scale: 0.7,
        rotation: -0.174533,
        behind: true
      },
      {
        attachmentPath: 'res://Items/Attachments/EXPS/EXPS.tres',
        position: [-44, -78],
        scale: 0.6
      },
      { attachmentPath: 'res://Items/Attachments/HMR/HMR.tres', position: [-64, -88], scale: 0.6 },
      {
        attachmentPath: 'res://Items/Attachments/Kobra/Kobra.tres',
        position: [-44, -72],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Leopard/Leopard.tres',
        position: [-32, -82],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Attachments/Micro/Micro.tres',
        position: [-56, -68],
        scale: 0.5
      },
      { attachmentPath: 'res://Items/Attachments/MRO/MRO.tres', position: [-58, -72], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/OZ5/OZ5.tres', position: [106, -42], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/PBS/PBS.tres', position: [306, -30], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/PRO/PRO.tres', position: [-54, -78], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/PTN/PTN.tres', position: [314, -30], scale: 0.6 },
      {
        attachmentPath: 'res://Items/Attachments/Vudu/Vudu.tres',
        position: [-50, -76],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/ANPEQ/ANPEQ.tres',
        position: [110, -44],
        scale: 0.5
      }
    ]
  ],
  [
    'res://Items/Weapons/AKM/AKM.tres',
    [
      {
        attachmentPath: 'res://Items/Attachments/ACOG/ACOG.tres',
        position: [-80, -80],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Weapons/AKM/AKM_Magazine.tres',
        position: [4, 34],
        scale: 0.7,
        rotation: -0.261799,
        behind: true
      },
      {
        attachmentPath: 'res://Items/Attachments/EXPS/EXPS.tres',
        position: [-54, -82],
        scale: 0.6
      },
      { attachmentPath: 'res://Items/Attachments/HMR/HMR.tres', position: [-74, -84], scale: 0.5 },
      {
        attachmentPath: 'res://Items/Attachments/Kobra/Kobra.tres',
        position: [-48, -76],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Leopard/Leopard.tres',
        position: [-44, -82],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Micro/Micro.tres',
        position: [-60, -72],
        scale: 0.5
      },
      { attachmentPath: 'res://Items/Attachments/MRO/MRO.tres', position: [-60, -76], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/PBS/PBS.tres', position: [370, -34], scale: 0.6 },
      { attachmentPath: 'res://Items/Attachments/PRO/PRO.tres', position: [-52, -80], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/PTN/PTN.tres', position: [354, -34], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/Vudu/Vudu.tres', position: [-50, -80], scale: 0.5 }
    ]
  ],
  [
    'res://Items/Weapons/KAR-21/KAR-21_223.tres',
    [
      {
        attachmentPath: 'res://Items/Attachments/ACOG/ACOG.tres',
        position: [-106, -92],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/EXPS/EXPS.tres',
        position: [-80, -92],
        scale: 0.6
      },
      { attachmentPath: 'res://Items/Attachments/HMR/HMR.tres', position: [-106, -96], scale: 0.5 },
      {
        attachmentPath: 'res://Items/Attachments/Hybrid/Hybrid.tres',
        position: [342, -44],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Weapons/KAR-21/KAR-21_223_Magazine.tres',
        position: [-28, 34],
        scale: 0.7,
        behind: true
      },
      {
        attachmentPath: 'res://Items/Attachments/Kobra/Kobra.tres',
        position: [-86, -86],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Leopard/Leopard.tres',
        position: [-82, -92],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Micro/Micro.tres',
        position: [-92, -84],
        scale: 0.55
      },
      {
        attachmentPath: 'res://Items/Attachments/Monster/Monster.tres',
        position: [336, -44],
        scale: 0.5
      },
      { attachmentPath: 'res://Items/Attachments/MRO/MRO.tres', position: [-80, -86], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/OZ5/OZ5.tres', position: [154, -44], scale: 0.5 },
      {
        attachmentPath: 'res://Items/Attachments/PRO/PRO.tres',
        position: [-80, -92],
        scale: 0.5,
        behind: true
      },
      {
        attachmentPath: 'res://Items/Attachments/SOCOM/SOCOM.tres',
        position: [336, -44],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Thor/Thor.tres',
        position: [342, -44],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Vudu/Vudu.tres',
        position: [-72, -92],
        scale: 0.55
      },
      {
        attachmentPath: 'res://Items/Attachments/ANPEQ/ANPEQ.tres',
        position: [134, -46],
        scale: 0.5
      }
    ]
  ],
  [
    'res://Items/Weapons/KAR-21/KAR-21_308.tres',
    [
      {
        attachmentPath: 'res://Items/Attachments/ACOG/ACOG.tres',
        position: [-106, -92],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/EXPS/EXPS.tres',
        position: [-80, -92],
        scale: 0.6
      },
      { attachmentPath: 'res://Items/Attachments/HMR/HMR.tres', position: [-106, -96], scale: 0.5 },
      {
        attachmentPath: 'res://Items/Attachments/Hybrid/Hybrid.tres',
        position: [348, -44],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Weapons/KAR-21/KAR-21_308_Magazine.tres',
        position: [-32, 32],
        scale: 0.7,
        behind: true
      },
      {
        attachmentPath: 'res://Items/Attachments/Kobra/Kobra.tres',
        position: [-86, -86],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Leopard/Leopard.tres',
        position: [-82, -92],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Micro/Micro.tres',
        position: [-92, -84],
        scale: 0.55
      },
      {
        attachmentPath: 'res://Items/Attachments/Monster/Monster.tres',
        position: [336, -44],
        scale: 0.5
      },
      { attachmentPath: 'res://Items/Attachments/MRO/MRO.tres', position: [-80, -86], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/OZ5/OZ5.tres', position: [154, -44], scale: 0.5 },
      {
        attachmentPath: 'res://Items/Attachments/PRO/PRO.tres',
        position: [-80, -92],
        scale: 0.5,
        behind: true
      },
      {
        attachmentPath: 'res://Items/Attachments/SOCOM/SOCOM.tres',
        position: [340, -44],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Thor/Thor.tres',
        position: [346, -44],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Vudu/Vudu.tres',
        position: [-72, -92],
        scale: 0.55
      },
      {
        attachmentPath: 'res://Items/Attachments/ANPEQ/ANPEQ.tres',
        position: [132, -46],
        scale: 0.5
      }
    ]
  ],
  [
    'res://Items/Weapons/Makarov/Makarov.tres',
    [
      {
        attachmentPath: 'res://Items/Weapons/Makarov/Makarov_Magazine.tres',
        position: [-54, 14],
        scale: 1.3,
        behind: true
      }
    ]
  ],
  [
    'res://Items/Weapons/AKS-74U/AKS-74U.tres',
    [
      {
        attachmentPath: 'res://Items/Attachments/ACOG/ACOG.tres',
        position: [-40, -82],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Weapons/AKS-74U/AKS-74U_Magazine.tres',
        position: [48, 40],
        scale: 0.7,
        rotation: -0.139626,
        behind: true
      },
      {
        attachmentPath: 'res://Items/Attachments/EXPS/EXPS.tres',
        position: [-14, -84],
        scale: 0.6
      },
      { attachmentPath: 'res://Items/Attachments/HMR/HMR.tres', position: [-34, -86], scale: 0.5 },
      {
        attachmentPath: 'res://Items/Attachments/Kobra/Kobra.tres',
        position: [-6, -78],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Leopard/Leopard.tres',
        position: [0, -84],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Micro/Micro.tres',
        position: [-20, -74],
        scale: 0.5
      },
      { attachmentPath: 'res://Items/Attachments/MRO/MRO.tres', position: [-20, -76], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/PBS/PBS.tres', position: [278, -30], scale: 0.6 },
      { attachmentPath: 'res://Items/Attachments/PRO/PRO.tres', position: [-12, -82], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/PTN/PTN.tres', position: [264, -30], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/Vudu/Vudu.tres', position: [-10, -82], scale: 0.5 }
    ]
  ],
  [
    'res://Items/Weapons/MK18/MK18.tres',
    [
      {
        attachmentPath: 'res://Items/Attachments/ACOG/ACOG.tres',
        position: [-26, -96],
        scale: 0.6
      },
      { attachmentPath: 'res://Items/Attachments/EXPS/EXPS.tres', position: [-6, -92], scale: 0.6 },
      { attachmentPath: 'res://Items/Attachments/HMR/HMR.tres', position: [-30, -98], scale: 0.55 },
      {
        attachmentPath: 'res://Items/Attachments/Hybrid/Hybrid.tres',
        position: [314, -48],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Attachments/Kobra/Kobra.tres',
        position: [-2, -88],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Attachments/Leopard/Leopard.tres',
        position: [4, -96],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Attachments/Micro/Micro.tres',
        position: [-20, -86],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Weapons/MK18/MK18_Magazine.tres',
        position: [12, 34],
        scale: 0.8,
        behind: true
      },
      {
        attachmentPath: 'res://Items/Attachments/Monster/Monster.tres',
        position: [308, -48],
        scale: 0.6
      },
      { attachmentPath: 'res://Items/Attachments/MRO/MRO.tres', position: [-22, -88], scale: 0.6 },
      { attachmentPath: 'res://Items/Attachments/OZ5/OZ5.tres', position: [214, -48], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/PRO/PRO.tres', position: [-14, -94], scale: 0.6 },
      {
        attachmentPath: 'res://Items/Attachments/SOCOM/SOCOM.tres',
        position: [308, -48],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Attachments/Thor/Thor.tres',
        position: [316, -48],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Attachments/Vudu/Vudu.tres',
        position: [-6, -96],
        scale: 0.65
      },
      {
        attachmentPath: 'res://Items/Attachments/ANPEQ/ANPEQ.tres',
        position: [216, -48],
        scale: 0.6
      }
    ]
  ],
  [
    'res://Items/Weapons/KP-31/KP-31.tres',
    [
      {
        attachmentPath: 'res://Items/Weapons/KP-31/KP-31_Drum.tres',
        position: [52, 10],
        scale: 0.5,
        behind: true
      }
    ]
  ],
  [
    'res://Items/Weapons/M4A1/M4A1.tres',
    [
      {
        attachmentPath: 'res://Items/Attachments/ACOG/ACOG.tres',
        position: [-94, -86],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Attachments/EXPS/EXPS.tres',
        position: [-76, -84],
        scale: 0.6
      },
      { attachmentPath: 'res://Items/Attachments/HMR/HMR.tres', position: [-84, -92], scale: 0.6 },
      {
        attachmentPath: 'res://Items/Attachments/Hybrid/Hybrid.tres',
        position: [340, -38],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Kobra/Kobra.tres',
        position: [-66, -78],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Leopard/Leopard.tres',
        position: [-56, -84],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Micro/Micro.tres',
        position: [-70, -76],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Monster/Monster.tres',
        position: [334, -38],
        scale: 0.5
      },
      { attachmentPath: 'res://Items/Attachments/MRO/MRO.tres', position: [-70, -78], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/OZ5/OZ5.tres', position: [86, -38], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/PRO/PRO.tres', position: [-60, -82], scale: 0.5 },
      {
        attachmentPath: 'res://Items/Attachments/SOCOM/SOCOM.tres',
        position: [336, -40],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Thor/Thor.tres',
        position: [346, -38],
        scale: 0.55
      },
      {
        attachmentPath: 'res://Items/Attachments/Vudu/Vudu.tres',
        position: [-48, -86],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Weapons/M4A1/M4A1_Magazine.tres',
        position: [-40, 42],
        scale: 0.75,
        behind: true
      },
      {
        attachmentPath: 'res://Items/Attachments/ANPEQ/ANPEQ.tres',
        position: [98, -74],
        scale: 0.7
      }
    ]
  ],
  [
    'res://Items/Weapons/M78/M78.tres',
    [
      {
        attachmentPath: 'res://Items/Attachments/ACOG/ACOG.tres',
        position: [-130, -78],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/EXPS/EXPS.tres',
        position: [-96, -76],
        scale: 0.5
      },
      { attachmentPath: 'res://Items/Attachments/HMR/HMR.tres', position: [-120, -82], scale: 0.5 },
      {
        attachmentPath: 'res://Items/Attachments/Hybrid/Hybrid.tres',
        position: [450, -30],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Attachments/Kobra/Kobra.tres',
        position: [-104, -74],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Leopard/Leopard.tres',
        position: [-98, -78],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Weapons/M78/M78_Magazine.tres',
        position: [-58, 26],
        scale: 0.6,
        behind: true
      },
      {
        attachmentPath: 'res://Items/Attachments/Micro/Micro.tres',
        position: [-116, -70],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Monster/Monster.tres',
        position: [430, -30],
        scale: 0.5
      },
      { attachmentPath: 'res://Items/Attachments/MRO/MRO.tres', position: [-114, -72], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/PRO/PRO.tres', position: [-102, -78], scale: 0.5 },
      {
        attachmentPath: 'res://Items/Attachments/SOCOM/SOCOM.tres',
        position: [430, -30],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Thor/Thor.tres',
        position: [436, -30],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Vudu/Vudu.tres',
        position: [-104, -76],
        scale: 0.5
      }
    ]
  ],
  [
    'res://Items/Weapons/Mosin/Mosin.tres',
    [
      {
        attachmentPath: 'res://Items/Attachments/PU/PU.tres',
        position: [-142, -62],
        scale: 0.5,
        behind: true
      }
    ]
  ],
  [
    'res://Items/Weapons/P320/P320.tres',
    [
      {
        attachmentPath: 'res://Items/Weapons/P320/P320_Magazine.tres',
        position: [-56, 12],
        scale: 1.2,
        behind: true
      },
      {
        attachmentPath: 'res://Items/Attachments/Rider/Rider.tres',
        position: [176, -58],
        scale: 0.7,
        behind: true
      },
      { attachmentPath: 'res://Items/Attachments/RMR/RMR.tres', position: [-40, -84], scale: 0.6 },
      { attachmentPath: 'res://Items/Attachments/SRO/SRO.tres', position: [-42, -84], scale: 0.5 }
    ]
  ],
  [
    'res://Items/Weapons/MP5/MP5.tres',
    [
      { attachmentPath: 'res://Items/Attachments/ACOG/ACOG.tres', position: [4, -82], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/EXPS/EXPS.tres', position: [6, -84], scale: 0.6 },
      { attachmentPath: 'res://Items/Attachments/HMR/HMR.tres', position: [0, -88], scale: 0.5 },
      {
        attachmentPath: 'res://Items/Attachments/Hybrid/Hybrid.tres',
        position: [254, -36],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Kobra/Kobra.tres',
        position: [18, -78],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Leopard/Leopard.tres',
        position: [16, -84],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Micro/Micro.tres',
        position: [12, -74],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Weapons/MP5/MP5_Magazine.tres',
        position: [68, 32],
        scale: 0.7,
        behind: true
      },
      { attachmentPath: 'res://Items/Attachments/MRO/MRO.tres', position: [10, -78], scale: 0.5 },
      {
        attachmentPath: 'res://Items/Attachments/Navy/Navy.tres',
        position: [250, -36],
        scale: 0.5
      },
      { attachmentPath: 'res://Items/Attachments/OZ5/OZ5.tres', position: [134, -56], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/PRO/PRO.tres', position: [8, -82], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/Vudu/Vudu.tres', position: [26, -88], scale: 0.6 }
    ]
  ],
  [
    'res://Items/Weapons/MP5K/MP5K.tres',
    [
      {
        attachmentPath: 'res://Items/Attachments/ACOG/ACOG.tres',
        position: [-40, -84],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Attachments/EXPS/EXPS.tres',
        position: [-44, -80],
        scale: 0.6
      },
      { attachmentPath: 'res://Items/Attachments/HMR/HMR.tres', position: [-26, -88], scale: 0.6 },
      {
        attachmentPath: 'res://Items/Attachments/Hybrid/Hybrid.tres',
        position: [168, -30],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Attachments/Kobra/Kobra.tres',
        position: [-22, -76],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Attachments/Leopard/Leopard.tres',
        position: [-14, -84],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Attachments/Micro/Micro.tres',
        position: [-36, -74],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Weapons/MP5/MP5_Magazine.tres',
        position: [20, 36],
        scale: 0.7,
        behind: true
      },
      { attachmentPath: 'res://Items/Attachments/MRO/MRO.tres', position: [-36, -76], scale: 0.6 },
      {
        attachmentPath: 'res://Items/Attachments/Navy/Navy.tres',
        position: [154, -30],
        scale: 0.5
      },
      { attachmentPath: 'res://Items/Attachments/OZ5/OZ5.tres', position: [60, -50], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/PRO/PRO.tres', position: [-26, -82], scale: 0.6 },
      { attachmentPath: 'res://Items/Attachments/Vudu/Vudu.tres', position: [-26, -82], scale: 0.6 }
    ]
  ],
  [
    'res://Items/Weapons/MP5SD/MP5SD.tres',
    [
      {
        attachmentPath: 'res://Items/Attachments/ACOG/ACOG.tres',
        position: [-28, -74],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/EXPS/EXPS.tres',
        position: [-18, -76],
        scale: 0.6
      },
      { attachmentPath: 'res://Items/Attachments/HMR/HMR.tres', position: [-26, -80], scale: 0.5 },
      {
        attachmentPath: 'res://Items/Attachments/Kobra/Kobra.tres',
        position: [0, -70],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Leopard/Leopard.tres',
        position: [8, -76],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Micro/Micro.tres',
        position: [-10, -68],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Weapons/MP5/MP5_Magazine.tres',
        position: [40, 32],
        scale: 0.7,
        behind: true
      },
      { attachmentPath: 'res://Items/Attachments/MRO/MRO.tres', position: [-10, -70], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/OZ5/OZ5.tres', position: [86, -44], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/PRO/PRO.tres', position: [-4, -74], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/Vudu/Vudu.tres', position: [-2, -74], scale: 0.5 }
    ]
  ],
  [
    'res://Items/Weapons/MP7/MP7.tres',
    [
      {
        attachmentPath: 'res://Items/Attachments/ACOG/ACOG.tres',
        position: [-72, -94],
        scale: 0.7
      },
      {
        attachmentPath: 'res://Items/Attachments/EXPS/EXPS.tres',
        position: [-46, -92],
        scale: 0.7
      },
      { attachmentPath: 'res://Items/Attachments/HMR/HMR.tres', position: [-64, -98], scale: 0.6 },
      {
        attachmentPath: 'res://Items/Attachments/Hybrid/Hybrid.tres',
        position: [232, -26],
        scale: 0.7
      },
      {
        attachmentPath: 'res://Items/Attachments/Kobra/Kobra.tres',
        position: [-38, -90],
        scale: 0.7
      },
      {
        attachmentPath: 'res://Items/Attachments/Leopard/Leopard.tres',
        position: [-38, -94],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Attachments/Micro/Micro.tres',
        position: [-48, -88],
        scale: 0.7
      },
      {
        attachmentPath: 'res://Items/Weapons/MP7/MP7_Magazine.tres',
        position: [-38, 74],
        scale: 0.9,
        behind: true
      },
      { attachmentPath: 'res://Items/Attachments/MRO/MRO.tres', position: [-50, -90], scale: 0.6 },
      { attachmentPath: 'res://Items/Attachments/OZ5/OZ5.tres', position: [80, -24], scale: 0.7 },
      { attachmentPath: 'res://Items/Attachments/PRO/PRO.tres', position: [-42, -92], scale: 0.6 },
      {
        attachmentPath: 'res://Items/Attachments/Vudu/Vudu.tres',
        position: [-42, -96],
        scale: 0.7
      },
      {
        attachmentPath: 'res://Items/Attachments/ANPEQ/ANPEQ.tres',
        position: [86, -24],
        scale: 0.8
      }
    ]
  ],
  [
    'res://Items/Weapons/RK-62/RK-62.tres',
    [
      {
        attachmentPath: 'res://Items/Attachments/ACOG/ACOG.tres',
        position: [-20, -82],
        scale: 0.5
      },
      { attachmentPath: 'res://Items/Attachments/EXPS/EXPS.tres', position: [-4, -80], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/HMR/HMR.tres', position: [-10, -86], scale: 0.5 },
      {
        attachmentPath: 'res://Items/Attachments/Hybrid/Hybrid.tres',
        position: [344, -36],
        scale: 0.4
      },
      {
        attachmentPath: 'res://Items/Attachments/Kobra/Kobra.tres',
        position: [-6, -74],
        scale: 0.4
      },
      {
        attachmentPath: 'res://Items/Attachments/Leopard/Leopard.tres',
        position: [-8, -84],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Micro/Micro.tres',
        position: [-10, -72],
        scale: 0.4
      },
      {
        attachmentPath: 'res://Items/Attachments/Monster/Monster.tres',
        position: [342, -36],
        scale: 0.4
      },
      { attachmentPath: 'res://Items/Attachments/MRO/MRO.tres', position: [-14, -74], scale: 0.4 },
      { attachmentPath: 'res://Items/Attachments/PRO/PRO.tres', position: [-6, -78], scale: 0.4 },
      {
        attachmentPath: 'res://Items/Weapons/RK-62/RK_Magazine.tres',
        position: [20, 28],
        scale: 0.705,
        rotation: -0.492183,
        behind: true
      },
      {
        attachmentPath: 'res://Items/Attachments/SOCOM/SOCOM.tres',
        position: [338, -36],
        scale: 0.4
      },
      {
        attachmentPath: 'res://Items/Attachments/Thor/Thor.tres',
        position: [336, -36],
        scale: 0.4
      },
      { attachmentPath: 'res://Items/Attachments/Vudu/Vudu.tres', position: [-20, -82], scale: 0.5 }
    ]
  ],
  [
    'res://Items/Weapons/RK-62/RK-62M.tres',
    [
      {
        attachmentPath: 'res://Items/Attachments/ACOG/ACOG.tres',
        position: [-84, -90],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Attachments/EXPS/EXPS.tres',
        position: [-68, -86],
        scale: 0.6
      },
      { attachmentPath: 'res://Items/Attachments/HMR/HMR.tres', position: [-58, -92], scale: 0.6 },
      {
        attachmentPath: 'res://Items/Attachments/Hybrid/Hybrid.tres',
        position: [326, -38],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Kobra/Kobra.tres',
        position: [-44, -80],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Leopard/Leopard.tres',
        position: [-44, -86],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Micro/Micro.tres',
        position: [-52, -76],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Monster/Monster.tres',
        position: [328, -38],
        scale: 0.5
      },
      { attachmentPath: 'res://Items/Attachments/MRO/MRO.tres', position: [-50, -80], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/OZ5/OZ5.tres', position: [156, -40], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/PRO/PRO.tres', position: [-58, -84], scale: 0.5 },
      {
        attachmentPath: 'res://Items/Weapons/RK-62/RK_Magazine.tres',
        position: [-24, 28],
        scale: 0.705,
        rotation: -0.492183,
        behind: true
      },
      {
        attachmentPath: 'res://Items/Attachments/SOCOM/SOCOM.tres',
        position: [328, -40],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Thor/Thor.tres',
        position: [322, -38],
        scale: 0.55
      },
      {
        attachmentPath: 'res://Items/Attachments/Vudu/Vudu.tres',
        position: [-26, -88],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Attachments/ANPEQ/ANPEQ.tres',
        position: [166, -40],
        scale: 0.6
      }
    ]
  ],
  [
    'res://Items/Weapons/RK-95/RK-95.tres',
    [
      {
        attachmentPath: 'res://Items/Attachments/ACOG/ACOG.tres',
        position: [-32, -90],
        scale: 0.6
      },
      {
        attachmentPath: 'res://Items/Attachments/EXPS/EXPS.tres',
        position: [-32, -86],
        scale: 0.6
      },
      { attachmentPath: 'res://Items/Attachments/HMR/HMR.tres', position: [-40, -92], scale: 0.6 },
      {
        attachmentPath: 'res://Items/Attachments/Hybrid/Hybrid.tres',
        position: [316, -38],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Kobra/Kobra.tres',
        position: [-30, -80],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Leopard/Leopard.tres',
        position: [-16, -86],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Micro/Micro.tres',
        position: [-38, -76],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Monster/Monster.tres',
        position: [310, -38],
        scale: 0.5
      },
      { attachmentPath: 'res://Items/Attachments/MRO/MRO.tres', position: [-40, -80], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/OZ5/OZ5.tres', position: [140, -56], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/PRO/PRO.tres', position: [-28, -84], scale: 0.5 },
      {
        attachmentPath: 'res://Items/Weapons/RK-62/RK_Magazine.tres',
        position: [8, 30],
        scale: 0.705,
        rotation: -0.383972,
        behind: true
      },
      {
        attachmentPath: 'res://Items/Attachments/SOCOM/SOCOM.tres',
        position: [312, -40],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Thor/Thor.tres',
        position: [322, -38],
        scale: 0.55
      },
      { attachmentPath: 'res://Items/Attachments/Vudu/Vudu.tres', position: [-8, -88], scale: 0.6 }
    ]
  ],
  [
    'res://Items/Weapons/Remington_870/Remington_870.tres',
    [
      {
        attachmentPath: 'res://Items/Attachments/Salvo/Salvo.tres',
        position: [424, -40],
        scale: 0.6
      }
    ]
  ],
  [
    'res://Items/Weapons/VSS/VSS.tres',
    [
      {
        attachmentPath: 'res://Items/Attachments/ACOG/ACOG.tres',
        position: [-60, -66],
        scale: 0.45
      },
      {
        attachmentPath: 'res://Items/Attachments/EXPS/EXPS.tres',
        position: [-50, -64],
        scale: 0.45
      },
      { attachmentPath: 'res://Items/Attachments/HMR/HMR.tres', position: [-54, -68], scale: 0.4 },
      {
        attachmentPath: 'res://Items/Attachments/Kobra/Kobra.tres',
        position: [-46, -60],
        scale: 0.4
      },
      {
        attachmentPath: 'res://Items/Attachments/Leopard/Leopard.tres',
        position: [-30, -68],
        scale: 0.45
      },
      {
        attachmentPath: 'res://Items/Attachments/Micro/Micro.tres',
        position: [-54, -58],
        scale: 0.4
      },
      { attachmentPath: 'res://Items/Attachments/MRO/MRO.tres', position: [-52, -60], scale: 0.4 },
      {
        attachmentPath: 'res://Items/Attachments/POSP/POSP.tres',
        position: [-38, -56],
        scale: 0.6,
        behind: true
      },
      { attachmentPath: 'res://Items/Attachments/PRO/PRO.tres', position: [-48, -64], scale: 0.4 },
      {
        attachmentPath: 'res://Items/Weapons/VSS/VSS_Magazine.tres',
        position: [6, 12],
        scale: 0.6,
        behind: true
      },
      {
        attachmentPath: 'res://Items/Attachments/Vudu/Vudu.tres',
        position: [-40, -66],
        scale: 0.45
      }
    ]
  ],
  [
    'res://Items/Weapons/SVD/SVD.tres',
    [
      {
        attachmentPath: 'res://Items/Attachments/ACOG/ACOG.tres',
        position: [-206, -66],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/EXPS/EXPS.tres',
        position: [-194, -68],
        scale: 0.6
      },
      { attachmentPath: 'res://Items/Attachments/HMR/HMR.tres', position: [-202, -68], scale: 0.5 },
      {
        attachmentPath: 'res://Items/Attachments/Kobra/Kobra.tres',
        position: [-188, -60],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Leopard/Leopard.tres',
        position: [-180, -66],
        scale: 0.5
      },
      {
        attachmentPath: 'res://Items/Attachments/Micro/Micro.tres',
        position: [-200, -58],
        scale: 0.5
      },
      { attachmentPath: 'res://Items/Attachments/MRO/MRO.tres', position: [-200, -60], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/PBS/PBS.tres', position: [458, -22], scale: 0.6 },
      {
        attachmentPath: 'res://Items/Attachments/POSP/POSP.tres',
        position: [-182, -54],
        scale: 0.7,
        behind: true
      },
      { attachmentPath: 'res://Items/Attachments/PRO/PRO.tres', position: [-192, -66], scale: 0.5 },
      { attachmentPath: 'res://Items/Attachments/PTN/PTN.tres', position: [442, -22], scale: 0.5 },
      {
        attachmentPath: 'res://Items/Weapons/SVD/SVD_Magazine.tres',
        position: [-116, 22],
        scale: 0.7,
        behind: true
      },
      {
        attachmentPath: 'res://Items/Attachments/Vudu/Vudu.tres',
        position: [-190, -66],
        scale: 0.5
      }
    ]
  ]
])
