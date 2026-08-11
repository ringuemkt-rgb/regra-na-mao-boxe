import { supabase } from "@/integrations/supabase/client";
import type { CombatSport, ScoutDossier } from "./types";

export interface ScoutAthleteListItem {
  id: string;
  slug: string;
  name: string;
  nickname?: string;
  sport: CombatSport;
  category?: string;
  nationality?: string;
  status: string;
  updatedAt?: string;
}

const db = supabase as any;

export async function listApprovedScoutAthletes(): Promise<ScoutAthleteListItem[]> {
  const { data, error } = await db
    .from("scout_dossiers")
    .select("id, slug, name, nickname, sport, category, nationality, status, updated_at")
    .eq("status", "approved")
    .order("name", { ascending: true });

  if (error || !data) return [];
  return data.map((row: any) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    nickname: row.nickname || undefined,
    sport: row.sport,
    category: row.category || undefined,
    nationality: row.nationality || undefined,
    status: row.status,
    updatedAt: row.updated_at || undefined,
  }));
}

export async function getApprovedDossierBySlug(slug: string): Promise<ScoutDossier | null> {
  const { data, error } = await db
    .from("scout_dossiers")
    .select("payload")
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();

  if (error || !data?.payload) return null;
  return data.payload as ScoutDossier;
}
