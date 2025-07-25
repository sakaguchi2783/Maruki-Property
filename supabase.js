/* supabase.js ---------------------------------------------------------- */
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* 
  既に丸喜プロパティ株式会社用に構築済みとのことですので 
  URL と anon キーは変更せずそのまま掲載しています。 
  適宜ご自身の環境に合わせて置換してください。
*/
export const supabase = createClient(
  "https://foiwqlssrphcgizegyey.supabase.co",      // ★ 必要に応じ変更
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvaXdxbHNzcnBoY2dpemVneWV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM4NzcyOTIsImV4cCI6MjAzOTQ1MzI5Mn0.M4Qn1rfdg2YfLxIGnFuFE_eYO053Z5KH5w7Ug_J2Ffo"  // ★ 必要に応じ変更
);
/* --------------------------------------------------------------------- */
