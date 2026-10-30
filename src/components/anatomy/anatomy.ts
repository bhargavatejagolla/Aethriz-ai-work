export type SystemId = 
  | 'cardiac'
  | 'nervous'
  | 'respiratory'
  | 'digestive'
  | 'skeletal'
  | 'arterial'
  | 'venous'
  | 'urinary'
  | 'endocrine'
  | 'sensory'
  | 'muscular'
  | 'connective'
  | 'integumentary'
  | 'lymphatic'
  | 'reproductive';

export interface SystemDef {
  id: SystemId;
  name: string;
  color: string;
  description: string;
  clinicalSignificance: string;
}

export const SYSTEMS: SystemDef[] = [
  {
    id: 'cardiac',
    name: 'Cardiovascular / Heart',
    color: '#DC2626',
    description: 'The four-chambered muscular pump maintaining pulmonary and systemic circulation.',
    clinicalSignificance: 'Primary hemodynamic driver; site of myocardial infarctions, arrhythmias, and coronary atherosclerotic plaque deposition.'
  },
  {
    id: 'nervous',
    name: 'Nervous System & Brain',
    color: '#D97706',
    description: 'The cerebral cortex, cerebellum, brainstem, spinal cord, and cranial nerves.',
    clinicalSignificance: 'Coordinates all somatic perception, autonomic homeostasis, and motor regulation; monitored via perfusion pressure (CPP > 65).'
  },
  {
    id: 'respiratory',
    name: 'Respiratory System',
    color: '#0284C7',
    description: 'Trachea, primary bronchi, bronchial tree, and alveolar capillary exchange beds.',
    clinicalSignificance: 'Gas exchange matrix (~100 sq. meters) maintaining arterial oxygenation (PaO2 > 80 mmHg) and acid-base equilibrium.'
  },
  {
    id: 'digestive',
    name: 'Digestive & Metabolic Organs',
    color: '#B45309',
    description: 'Liver, stomach, gallbladder, pancreas, duodenum, and intestinal tracts.',
    clinicalSignificance: 'Hepatic lobules filter portal venous blood, synthesize ApoB/ApoA apolipoproteins, and regulate gluconeogenesis.'
  },
  {
    id: 'skeletal',
    name: 'Skeletal Framework',
    color: '#D4C5A9',
    description: '206 bones of the axial (skull, spine, ribcage) and appendicular skeleton.',
    clinicalSignificance: 'Provides hematopoiesis in trabecular bone marrow, systemic calcium homeostasis, and biomechanical lever arms.'
  },
  {
    id: 'arterial',
    name: 'Arterial Vasculature',
    color: '#EF4444',
    description: 'High-pressure oxygenated conduit tree branching from aortic root to peripheral microvasculature.',
    clinicalSignificance: 'Arterial stiffness (PWV > 10 m/s) and ApoB particle retention accelerate endothelial dysfunction.'
  },
  {
    id: 'venous',
    name: 'Venous Drainage',
    color: '#2563EB',
    description: 'Capacitance network returning deoxygenated blood via inferior/superior vena cava.',
    clinicalSignificance: 'Maintains central venous pressure (CVP 2-6 mmHg) and volume reserve for cardiac preload.'
  },
  {
    id: 'urinary',
    name: 'Renal & Urinary',
    color: '#B45309',
    description: 'Kidneys, nephron filtration matrices, ureters, and urinary bladder.',
    clinicalSignificance: 'Filtration of metabolic waste products, renin-angiotensin-aldosterone blood pressure regulation, and electrolyte balancing.'
  },
  {
    id: 'endocrine',
    name: 'Endocrine Glands',
    color: '#C084FC',
    description: 'Pituitary, thyroid, parathyroid, adrenal, and pancreatic islet tissues.',
    clinicalSignificance: 'Hormonal signaling axes regulating metabolic rate, cortisol diurnal cycles, and glucose homeostasis.'
  },
  {
    id: 'sensory',
    name: 'Sensory Organs',
    color: '#38BDF8',
    description: 'Ocular globes, optic pathways, auditory cochlea, and vestibular apparatus.',
    clinicalSignificance: 'Visual and auditory neural transduction into occipital and temporal cortices.'
  },
  {
    id: 'muscular',
    name: 'Muscular System',
    color: '#991B1B',
    description: 'Skeletal musculature generating kinetic force, joint stabilization, and metabolic heat.',
    clinicalSignificance: 'Major glycogen sink; site of sarcopenia and mitochondrial oxidative phosphorylation.'
  },
  {
    id: 'connective',
    name: 'Connective Tissue',
    color: '#94A3B8',
    description: 'Cartilaginous rings, ligaments, and fibrous articular capsules.',
    clinicalSignificance: 'Viscoelastic shock absorption and anatomical compartmentalization.'
  },
  {
    id: 'integumentary',
    name: 'Body Surface / Dermis',
    color: '#A8A29E',
    description: 'Cutaneous epidermal envelope providing microbial defense and thermoregulation.',
    clinicalSignificance: 'First-line antimicrobial physical barrier and sensory receptor bed.'
  },
  {
    id: 'lymphatic',
    name: 'Lymphoid Immune System',
    color: '#10B981',
    description: 'Lymphatic channels, cervical/mediastinal/inguinal lymph nodes, and spleen.',
    clinicalSignificance: 'Fluid resorption and dendritic cell antigen presentation.'
  },
  {
    id: 'reproductive',
    name: 'Reproductive System',
    color: '#FB7185',
    description: 'Urogenital reproductive structures and endocrine gonadal tissues.',
    clinicalSignificance: 'Endogenous sex steroid hormone synthesis and reproductive gametogenesis.'
  }
];

export interface Part {
  id: string;
  name: string;
  conceptId: string;
  system: SystemId;
  chunk: number;
  positions: number;
  normals: number;
  indices: number;
  vertexCount: number;
  indexCount: number;
  bounds: [number[], number[]];
}

export interface Concept {
  id: string;
  name: string;
  elements: string[];
}

export interface Atlas {
  version: string;
  sex?: 'male';
  source?: string;
  scope?: string;
  parts: Part[];
  concepts: Concept[];
  chunks: { url: string; bytes: number; gzip?: string; gzipBytes?: number }[];
  triangles: number;
}

export type View = 'three-quarter' | 'front' | 'back' | 'side';

export interface SceneState {
  inspectorOpen?: boolean;
  explode: number;
  visible: SystemId[];
  selected: string[];
  isolate: boolean;
  view: View;
  rotate: boolean;
  reset: number;
}

// Default to the essential internal organs & skeleton as requested:
// "i dont want the complete alll the meshes jsut important meshes and better things htat sll dont make it more complciaetd jsut the imporant parts and importatn orrans and nerves aliek that"
export const CLINICAL_DEFAULT_VISIBLE: SystemId[] = [
  'cardiac',
  'nervous',
  'respiratory',
  'digestive',
  'skeletal',
  'arterial',
  'venous',
  'urinary'
];

export const CLINICAL_PRESETS = [
  {
    id: 'organs',
    label: 'Vital Organs',
    description: 'Heart, Lungs, Brain, Liver, and Kidneys',
    systems: ['cardiac', 'respiratory', 'digestive', 'nervous', 'urinary'] as SystemId[]
  },
  {
    id: 'cardiopulmonary',
    label: 'Cardio-Pulmonary',
    description: 'Heart, Coronary Arteries, Aorta, and Bronchial Tree',
    systems: ['cardiac', 'arterial', 'venous', 'respiratory'] as SystemId[]
  },
  {
    id: 'neuro',
    label: 'Neuro-Anatomy',
    description: 'Cerebral Cortex, Spine, Cranial Nerves, and Sensory',
    systems: ['nervous', 'sensory', 'skeletal'] as SystemId[]
  },
  {
    id: 'skeletal',
    label: 'Skeletal Matrix',
    description: '206 Articulated Bones of Skull, Spine, and Limbs',
    systems: ['skeletal'] as SystemId[]
  },
  {
    id: 'vascular',
    label: 'Circulatory Tree',
    description: 'Aortic Arch, Coronaries, Vena Cava, and Hepatic Portal',
    systems: ['cardiac', 'arterial', 'venous'] as SystemId[]
  },
  {
    id: 'clinical_all',
    label: 'Full Medical Survey',
    description: 'Internal Organs, Nerves, Vessels, and Skeleton',
    systems: [
      'cardiac',
      'nervous',
      'respiratory',
      'digestive',
      'skeletal',
      'arterial',
      'venous',
      'urinary',
      'endocrine',
      'sensory'
    ] as SystemId[]
  }
];

export const EXPLANATIONS: Record<string, string> = {
  heart: 'Four-chambered muscular pump in the thoracic cavity. Left anterior descending (LAD) and circumflex coronaries supply ventricular myocardium.',
  liver: 'Largest internal organ beneath the right diaphragm. Synthesizes apolipoproteins (ApoB/ApoA), clears xenobiotics, and regulates glucose.',
  brain: 'Central command organ of the nervous system. Anterior and posterior cerebral circulations maintain constant cerebral perfusion pressure (CPP > 65).',
  lung: 'Dual gas-exchange organs containing ~100 square meters of alveolar membrane for capillary oxygen diffusion and surfactant homeostasis.',
  stomach: 'Muscular reservoir between the esophagus and duodenum secreting hydrochloric acid and intrinsic factor for nutrient absorption.',
  spleen: 'Primary secondary lymphoid organ filtering aging erythrocytes and housing follicular immune complexes.',
  pancreas: 'Dual endocrine-exocrine gland synthesizing insulin, glucagon, and digestive proteases/lipases.',
  'urinary bladder': 'Pelvic detrusor muscle reservoir storing urine prior to micturition.',
  trachea: 'Cartilaginous airway trunk bifurcating at the carina into left and right mainstem bronchi.',
  kidney: 'Paired retroperitoneal organs filtering blood through 1 million nephrons each, maintaining blood pressure and electrolyte balance.'
};

export function getStructureExplanation(name: string, system: SystemId): string {
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(EXPLANATIONS)) {
    if (lower.includes(key)) return val;
  }
  return SYSTEMS.find(s => s.id === system)?.description ?? 'Anatomical structure cataloged in BodyParts3D clinical reference standard.';
}
