CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  update_at TEXT DEFAULT CURRENT_TIMESTAMP,
  create_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tokens (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_in INTEGER NOT NULL,
  create_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE flows (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  update_at TEXT DEFAULT CURRENT_TIMESTAMP,
  create_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sub_flows (
  id INTEGER PRIMARY KEY,
  flow_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  update_at TEXT DEFAULT CURRENT_TIMESTAMP,
  create_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (flow_id) REFERENCES flows(id) ON DELETE CASCADE
);

CREATE TABLE nodes (
  id TEXT PRIMARY KEY,
  sub_flow_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  parent TEXT,
  position TEXT,
  styles TEXT,
  width INTEGER,
  height INTEGER,
  hidden INTEGER,
  description TEXT,
  update_at TEXT DEFAULT CURRENT_TIMESTAMP,
  create_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sub_flow_id) REFERENCES sub_flows(id) ON DELETE CASCADE
);

CREATE TABLE edges (
  id TEXT PRIMARY KEY,
  sub_flow_id INTEGER NOT NULL,
  source TEXT NOT NULL,
  target TEXT NOT NULL,
  type TEXT NOT NULL,
  label TEXT,
  hidden INTEGER,
  marker_end TEXT,
  points TEXT,
  update_at TEXT DEFAULT CURRENT_TIMESTAMP,
  create_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sub_flow_id) REFERENCES sub_flows(id) ON DELETE CASCADE
);
