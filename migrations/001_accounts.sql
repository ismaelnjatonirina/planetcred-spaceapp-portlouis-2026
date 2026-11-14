CREATE TABLE IF NOT EXISTS planetcred_accounts (
  username_key TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
