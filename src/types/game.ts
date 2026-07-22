export interface GameSession {
  id: string;
  class_code: string;
  teacher_name: string;
  title: string;
  current_round: number;
  status: string;
  starting_coins: number;
  created_at: string;
}

export interface GamePlayer {
  id: string;
  session_id: string;
  nickname: string;
  coins: number;
  joined_at: string;
}

export interface GameCompany {
  id: string;
  session_id: string;
  player_id: string;
  name: string;
  description: string | null;
  product_name: string | null;
  product_price: number;
  emoji: string;
  color: string;
  pitch_text: string | null;
  ad_text: string | null;
  share_price: number;
  shares_for_sale: number;
  shares_sold: number;
  cost_operational: number;
  cost_marketing: number;
  cost_staff: number;
  units_sold: number;
  revenue: number;
  total_costs: number;
  net_profit: number;
  created_at: string;
  player?: GamePlayer;
}

export interface GameShareholding {
  id: string;
  company_id: string;
  investor_id: string;
  shares_owned: number;
  coins_invested: number;
  dividends_received: number;
  company?: GameCompany;
}

export interface GameTransaction {
  id: string;
  session_id: string;
  player_id: string;
  type: string;
  amount: number;
  description: string | null;
  created_at: string;
}

export const ROUND_NAMES: Record<number, { el: string; icon: string; description_el: string }> = {
  1: { el: 'Ίδρυση Εταιρίας', icon: '🏗️', description_el: 'Δημιούργησε την εταιρία σου, ορίσε τιμές και ετοίμασε το pitch σου.' },
  2: { el: 'Pitch & Επενδύσεις', icon: '🎤', description_el: 'Παρουσίασε την εταιρία σου και επένδυσε στις εταιρίες των άλλων.' },
  3: { el: 'Πωλήσεις', icon: '📈', description_el: 'Οι πωλήσεις καταγράφονται. Ποια εταιρία πούλησε περισσότερο;' },
  4: { el: 'Αποτελέσματα & Μερίσματα', icon: '🏆', description_el: 'Τα κέρδη μοιράζονται! Δες το τελικό leaderboard.' },
};

export const COMPANY_COLORS = [
  { label: 'Μπλε', value: 'from-blue-400 to-indigo-500' },
  { label: 'Πράσινο', value: 'from-green-400 to-emerald-500' },
  { label: 'Πορτοκαλί', value: 'from-orange-400 to-pink-500' },
  { label: 'Μωβ', value: 'from-purple-400 to-violet-500' },
  { label: 'Κόκκινο', value: 'from-red-400 to-rose-500' },
  { label: 'Κίτρινο', value: 'from-yellow-400 to-amber-500' },
];
