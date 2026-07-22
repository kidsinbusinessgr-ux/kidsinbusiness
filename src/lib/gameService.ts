import { supabase } from "@/integrations/supabase/client";
import type { GameSession, GamePlayer, GameCompany, GameShareholding } from "@/types/game";

// ─── Session ───────────────────────────────────────────────────────────────

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function createGameSession(teacherName: string, title: string): Promise<GameSession> {
  const class_code = generateCode();
  const { data, error } = await supabase
    .from("game_sessions")
    .insert({ class_code, teacher_name: teacherName, title })
    .select()
    .single();
  if (error) throw error;
  return data as GameSession;
}

export async function getSessionByCode(code: string): Promise<GameSession | null> {
  const { data } = await supabase
    .from("game_sessions")
    .select()
    .eq("class_code", code.toUpperCase())
    .eq("status", "active")
    .maybeSingle();
  return data as GameSession | null;
}

export async function advanceRound(sessionId: string, nextRound: number): Promise<void> {
  const { error } = await supabase
    .from("game_sessions")
    .update({ current_round: nextRound })
    .eq("id", sessionId);
  if (error) throw error;
}

// ─── Player ────────────────────────────────────────────────────────────────

export async function joinGame(sessionId: string, nickname: string, startingCoins: number): Promise<GamePlayer> {
  // Check if already exists
  const { data: existing } = await supabase
    .from("game_players")
    .select()
    .eq("session_id", sessionId)
    .eq("nickname", nickname)
    .maybeSingle();
  if (existing) return existing as GamePlayer;

  const { data, error } = await supabase
    .from("game_players")
    .insert({ session_id: sessionId, nickname, coins: startingCoins })
    .select()
    .single();
  if (error) throw error;
  return data as GamePlayer;
}

export async function getPlayer(playerId: string): Promise<GamePlayer | null> {
  const { data } = await supabase
    .from("game_players")
    .select()
    .eq("id", playerId)
    .maybeSingle();
  return data as GamePlayer | null;
}

export async function getPlayers(sessionId: string): Promise<GamePlayer[]> {
  const { data } = await supabase
    .from("game_players")
    .select()
    .eq("session_id", sessionId)
    .order("coins", { ascending: false });
  return (data || []) as GamePlayer[];
}

// ─── Company ───────────────────────────────────────────────────────────────

export async function upsertCompany(company: Partial<GameCompany> & { session_id: string; player_id: string }): Promise<GameCompany> {
  const { data, error } = await supabase
    .from("game_companies")
    .upsert(company, { onConflict: "session_id,player_id" })
    .select()
    .single();
  if (error) throw error;
  return data as GameCompany;
}

export async function getMyCompany(sessionId: string, playerId: string): Promise<GameCompany | null> {
  const { data } = await supabase
    .from("game_companies")
    .select()
    .eq("session_id", sessionId)
    .eq("player_id", playerId)
    .maybeSingle();
  return data as GameCompany | null;
}

export async function getAllCompanies(sessionId: string): Promise<GameCompany[]> {
  const { data } = await supabase
    .from("game_companies")
    .select("*, player:game_players(*)")
    .eq("session_id", sessionId)
    .order("created_at");
  return (data || []) as GameCompany[];
}

// ─── Shareholdings ─────────────────────────────────────────────────────────

export async function buyShares(
  companyId: string,
  investorId: string,
  sharesToBuy: number,
  sharePrice: number,
  sessionId: string,
  companyName: string
): Promise<void> {
  const cost = sharesToBuy * sharePrice;

  // 1. Check and deduct coins from investor
  const { data: playerData, error: pe } = await supabase.from("game_players").select("coins").eq("id", investorId).single();
  if (pe || !playerData) throw new Error("Player not found");
  if (playerData.coins < cost) throw new Error("Δεν έχεις αρκετά coins!");
  const { error: e1 } = await supabase.from("game_players").update({ coins: playerData.coins - cost }).eq("id", investorId);
  if (e1) throw e1;

  // 2. Update shares_sold on company
  const { data: company } = await supabase.from("game_companies").select("shares_sold, shares_for_sale").eq("id", companyId).single();
  if (!company) throw new Error("Company not found");
  const newSold = company.shares_sold + sharesToBuy;
  if (newSold > company.shares_for_sale) throw new Error("Δεν υπάρχουν αρκετά διαθέσιμα μερίδια!");
  await supabase.from("game_companies").update({ shares_sold: newSold }).eq("id", companyId);

  // 3. Upsert shareholding
  const { data: existing } = await supabase
    .from("game_shareholdings")
    .select()
    .eq("company_id", companyId)
    .eq("investor_id", investorId)
    .maybeSingle();

  if (existing) {
    await supabase.from("game_shareholdings").update({
      shares_owned: existing.shares_owned + sharesToBuy,
      coins_invested: existing.coins_invested + cost,
    }).eq("id", existing.id);
  } else {
    await supabase.from("game_shareholdings").insert({
      company_id: companyId,
      investor_id: investorId,
      shares_owned: sharesToBuy,
      coins_invested: cost,
    });
  }

  // 4. Log transaction
  await supabase.from("game_transactions").insert({
    session_id: sessionId,
    player_id: investorId,
    type: "share_buy",
    amount: -cost,
    description: `Αγορά ${sharesToBuy} μεριδίων σε ${companyName}`,
  });
}

export async function getMyShareholdings(investorId: string): Promise<GameShareholding[]> {
  const { data } = await supabase
    .from("game_shareholdings")
    .select("*, company:game_companies(*)")
    .eq("investor_id", investorId);
  return (data || []) as GameShareholding[];
}

export async function getCompanyShareholders(companyId: string): Promise<GameShareholding[]> {
  const { data } = await supabase
    .from("game_shareholdings")
    .select()
    .eq("company_id", companyId);
  return (data || []) as GameShareholding[];
}

// ─── Teacher: Enter Sales & Calculate ──────────────────────────────────────

export async function enterSalesAndCalculate(
  company: GameCompany,
  unitsSold: number
): Promise<void> {
  const revenue = unitsSold * company.product_price;
  const total_costs = company.cost_operational + company.cost_marketing + company.cost_staff;
  const net_profit = revenue - total_costs;

  // Update company financials
  await supabase.from("game_companies").update({
    units_sold: unitsSold,
    revenue,
    total_costs,
    net_profit,
  }).eq("id", company.id);

  // Distribute dividends if profitable
  if (net_profit > 0) {
    const TOTAL_SHARES = 10;
    // Get all shareholders (non-founder)
    const shareholdings = await getCompanyShareholders(company.id);
    const sharesHeldByOthers = shareholdings.reduce((s, h) => s + h.shares_owned, 0);
    const founderShares = TOTAL_SHARES - sharesHeldByOthers;

    // Founder gets their share of profit
    const founderDividend = (founderShares / TOTAL_SHARES) * net_profit;
    if (founderDividend > 0) {
      const { data: founder } = await supabase.from("game_players").select("coins").eq("id", company.player_id).single();
      if (founder) {
        await supabase.from("game_players").update({ coins: founder.coins + founderDividend }).eq("id", company.player_id);
        await supabase.from("game_transactions").insert({
          session_id: company.session_id,
          player_id: company.player_id,
          type: "dividend",
          amount: founderDividend,
          description: `Μέρισμα ιδρυτή από ${company.name}`,
        });
      }
    }

    // Investor dividends
    for (const sh of shareholdings) {
      const dividend = (sh.shares_owned / TOTAL_SHARES) * net_profit;
      if (dividend > 0) {
        const { data: investor } = await supabase.from("game_players").select("coins").eq("id", sh.investor_id).single();
        if (investor) {
          await supabase.from("game_players").update({ coins: investor.coins + dividend }).eq("id", sh.investor_id);
          await supabase.from("game_shareholdings").update({ dividends_received: sh.dividends_received + dividend }).eq("id", sh.id);
          await supabase.from("game_transactions").insert({
            session_id: company.session_id,
            player_id: sh.investor_id,
            type: "dividend",
            amount: dividend,
            description: `Μέρισμα από ${company.name} (${sh.shares_owned} μερίδια)`,
          });
        }
      }
    }
  }
}
