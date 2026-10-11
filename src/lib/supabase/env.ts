/**
 * Variables d'environnement Supabase.
 * Les références à process.env.NEXT_PUBLIC_* doivent rester littérales
 * pour être injectées dans le bundle client au build.
 * Pas de valeur par défaut : une configuration manquante doit échouer
 * immédiatement plutôt que pointer silencieusement vers un faux projet.
 */
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Variable d'environnement manquante : ${name}. Voir .env.example.`);
  }
  return value;
}

export const supabaseUrl = () =>
  required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);

export const supabaseAnonKey = () =>
  required("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const supabaseServiceRoleKey = () =>
  required("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY);
