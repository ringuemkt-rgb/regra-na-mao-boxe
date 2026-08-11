export type CombatSport = "BOXE" | "JIU-JITSU" | "MMA";
export type ClaimStatus = "supported" | "uncertain" | "unsupported" | "conflicted";
export type DossierStatus = "draft" | "processing" | "review" | "approved" | "blocked";

export interface ScoutSource {
  id: string;
  kind: "official" | "database" | "news" | "encyclopedia" | "video" | "other";
  title: string;
  publisher?: string;
  url?: string;
  retrievedAt: string;
  reliability: number;
}

export interface ScoutEvidence {
  sourceId: string;
  excerpt?: string;
  field?: string;
  timestampSeconds?: number;
}

export interface ScoutClaim {
  id: string;
  text: string;
  status: ClaimStatus;
  confidence: number;
  evidence: ScoutEvidence[];
}

export interface ScoutFight {
  id: string;
  date?: string;
  event?: string;
  opponent?: string;
  result?: "V" | "D" | "E" | "NC";
  method?: string;
  round?: number;
  time?: string;
  sourceIds: string[];
  opponentStyle?: "striker" | "grappler" | "wrestler" | "mixed" | "unknown";
  titleFight?: boolean;
  knockdownsSuffered?: number;
  takedownsAttemptedAgainst?: number;
  takedownsDefended?: number;
  round1Result?: "won" | "lost" | "draw" | "unknown";
}

export interface ScoutTimelineItem {
  year?: number;
  date?: string;
  title: string;
  description: string;
  claimIds: string[];
}

export interface ScoutMetric {
  key: string;
  label: string;
  value: number;
  unit?: string;
  derivation: string;
  sourceIds: string[];
  confidence?: number;
  sampleSize?: number;
  limitations?: string[];
}

export interface ScoutDossier {
  id: string;
  slug: string;
  status: DossierStatus;
  sport: CombatSport;
  name: string;
  nickname?: string;
  category?: string;
  team?: string;
  photoUrl?: string;
  identity: {
    birthDate?: string;
    age?: number;
    birthPlace?: string;
    nationality?: string;
    stance?: string;
    heightCm?: number;
    reachCm?: number;
    coach?: string;
  };
  record: { wins?: number; losses?: number; draws?: number; noContests?: number };
  timeline: ScoutTimelineItem[];
  fights: ScoutFight[];
  metrics: ScoutMetric[];
  technicalSections: Array<{ key: string; title: string; summary: string; claimIds: string[] }>;
  mediaContext: Array<{ title: string; publisher?: string; date?: string; url?: string; sourceId: string }>;
  claims: ScoutClaim[];
  sources: ScoutSource[];
  verdict?: string;
  lastUpdatedAt: string;
}
