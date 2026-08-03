import { 
  Home, 
  Landmark, 
  Globe, 
  User, 
  Award, 
  Beaker, 
  Search, 
  Cpu, 
  Rocket, 
  Handshake, 
  type LucideIcon 
} from 'lucide-react';

/**
 * Object mapping icon berdasarkan skema atau jenis program penelitian.
 * Diselaraskan secara persis dengan icon di modal 'Unggah Penelitian Baru' (ResearchUploadModal).
 * - Hibah Internal -> Home
 * - Hibah Dikti / Eksternal -> Landmark
 * - Hibah Luar Negeri -> Globe
 */
export const RESEARCH_SCHEMA_ICON_MAP: Record<string, LucideIcon> = {
  // Hibah Internal (Diselaraskan dengan ResearchUploadModal: Home)
  'hibah internal': Home,
  'internal': Home,

  // Hibah Dikti / Eksternal (Diselaraskan dengan ResearchUploadModal: Landmark)
  'hibah eksternal': Landmark,
  'hibah dikti': Landmark,
  'dikti': Landmark,
  'eksternal': Landmark,

  // Hibah Luar Negeri / Internasional (Diselaraskan dengan ResearchUploadModal: Globe)
  'hibah luar negeri': Globe,
  'luar negeri': Globe,
  'internasional': Globe,

  // Penelitian Mandiri
  'penelitian mandiri': User,
  'mandiri': User,

  // Skema Penelitian Spesifik
  'kompetisi': Award,
  'penelitian dasar': Search,
  'dasar': Search,
  'penelitian terapan': Cpu,
  'terapan': Cpu,
  'penelitian pengembangan': Rocket,
  'pengembangan': Rocket,
  'kerjasama': Handshake,
};

/**
 * Mendapatkan icon Lucide yang merepresentasikan skema/program penelitian.
 * Memeriksa pencocokan persis maupun kata kunci pada program & skema.
 */
export const getResearchSchemaIcon = (program?: string, skema?: string): LucideIcon => {
  const normProgram = (program || '').trim().toLowerCase();
  const normSkema = (skema || '').trim().toLowerCase();

  // 1. Cek pencocokan persis pada program
  if (normProgram && RESEARCH_SCHEMA_ICON_MAP[normProgram]) {
    return RESEARCH_SCHEMA_ICON_MAP[normProgram];
  }

  // 2. Cek pencocokan persis pada skema
  if (normSkema && RESEARCH_SCHEMA_ICON_MAP[normSkema]) {
    return RESEARCH_SCHEMA_ICON_MAP[normSkema];
  }

  // 3. Cek pencocokan kata kunci pada program
  for (const [key, icon] of Object.entries(RESEARCH_SCHEMA_ICON_MAP)) {
    if (normProgram && normProgram.includes(key)) {
      return icon;
    }
  }

  // 4. Cek pencocokan kata kunci pada skema
  for (const [key, icon] of Object.entries(RESEARCH_SCHEMA_ICON_MAP)) {
    if (normSkema && normSkema.includes(key)) {
      return icon;
    }
  }

  // Default fallback jika tidak ada skema yang cocok
  return Beaker;
};
