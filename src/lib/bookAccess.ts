import { supabase } from "@/integrations/supabase/client";

// Server-issued access token (see migration 20261119120000_book_access_tokens.sql).
export const BOOK_TOKEN_KEY = "kib_book_token_v1";
// Old browser-only flag. No longer grants access; only used to recognise
// children who logged in before the change, so we can greet them kindly.
export const OLD_ACCESS_KEY = "kib_book_access_v1";
export const BOOK_USER_KEY = "kib_book_user_v1";

const readToken = (): string | null => {
  try { return localStorage.getItem(BOOK_TOKEN_KEY); } catch { return null; }
};

/** Asks the server whether this visitor may open the book. */
export async function checkBookAccess(): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc("check_book_access" as any, { access_token: readToken() });
    if (error) return false;
    return data === true;
  } catch {
    return false;
  }
}

export type RedeemResult = "ok" | "wrong" | "too_many" | "error";

/** Sends the book code to the server; on success stores the access token. */
export async function redeemBookCode(code: string): Promise<RedeemResult> {
  try {
    const { data, error } = await supabase.rpc("redeem_book_code" as any, { input_code: code.trim().toLowerCase() });
    if (error) {
      return /too_many_attempts/.test(error.message || "") ? "too_many" : "error";
    }
    if (typeof data !== "string" || !data) return "wrong";
    try {
      localStorage.setItem(BOOK_TOKEN_KEY, data);
      localStorage.removeItem(OLD_ACCESS_KEY);
    } catch {}
    return "ok";
  } catch {
    return "error";
  }
}

export function clearBookAccess() {
  try {
    localStorage.removeItem(BOOK_TOKEN_KEY);
    localStorage.removeItem(OLD_ACCESS_KEY);
    localStorage.removeItem(BOOK_USER_KEY);
  } catch {}
}

/** True for children who had the old browser-only access. */
export function hadOldAccess(): boolean {
  try { return localStorage.getItem(OLD_ACCESS_KEY) === "1"; } catch { return false; }
}
