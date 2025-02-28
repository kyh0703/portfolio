-- name: GetUser :one
SELECT * FROM users
WHERE id = ? LIMIT 1;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = ? LIMIT 1;

-- name: ListUsers :many
SELECT * FROM users
ORDER BY name;

-- name: CreateUser :one
INSERT INTO users (
  email,
  password,
  name,
  bio,
  update_at
) VALUES (
  ?, ?, ?, ?, ?
)
RETURNING *;

-- name: UpdateUser :exec
UPDATE users SET
email = ?,
name = ?,
password = ?,
bio = ?,
update_at = ?
WHERE id = ?
RETURNING *;

-- name: DeleteUser :exec
DELETE FROM users
WHERE id = ?;

-- name: GetToken :one
SELECT * FROM tokens
WHERE id = ? LIMIT 1;

-- name: GetTokenByUserID :one
SELECT * FROM tokens
WHERE user_id = ? LIMIT 1;

-- name: ListTokens :many
SELECT * FROM tokens
ORDER BY create_at;

-- name: CreateToken :one
INSERT INTO tokens (
  user_id,
  refresh_token,
  expires_in
) VALUES (
  ?, ?, ?
)
RETURNING *;

-- name: UpdateToken :exec
UPDATE tokens SET
user_id = ?,
refresh_token = ?,
expires_in = ?
WHERE id = ?
RETURNING *;

-- name: DeleteToken :exec
DELETE FROM tokens
WHERE id = ?;

-- name: CreateProject :one
INSERT INTO projects (
  name,
  description
) VALUES (
  ?, ?
)
RETURNING *;

-- name: GetProject :one
SELECT * FROM projects
WHERE id = ? LIMIT 1;

-- name: ListProjects :many
SELECT * FROM projects
ORDER BY name;

-- name: UpdateProject :exec
UPDATE projects SET
name = ?,
description = ?
WHERE id = ?
RETURNING *;

-- name: DeleteProject :exec
DELETE FROM projects
WHERE id = ?;

-- name: CreateFlow :one
INSERT INTO flows (
  name,
  description
) VALUES (
  ?, ?
)
RETURNING *;

-- name: GetFlow :one
SELECT * FROM flows
WHERE id = ? LIMIT 1;

-- name: ListFlows :many
SELECT * FROM flows
WHERE project_id = ?
ORDER BY name;

-- name: UpdateFlow :exec
UPDATE flows SET
name = ?,
description = ?
WHERE id = ?
RETURNING *;

-- name: DeleteFlow :exec
DELETE FROM flows
WHERE id = ?;

-- name: GetNode :one
SELECT * FROM nodes
WHERE id = ? LIMIT 1;

-- name: ListNodes :many
SELECT * FROM nodes
WHERE flow_id = ?
ORDER BY create_time;

-- name: CreateNode :one
INSERT INTO nodes (
  id,
  flow_id,
  type,
  parent,
  position,
  styles,
  width,
  height,
  hidden,
  description
) VALUES (
  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
)
RETURNING *;

-- name: UpdateNode :exec
UPDATE nodes SET
type = ?,
parent = ?,
position = ?,
styles = ?,
width = ?,
height = ?,
hidden = ?,
description = ?
WHERE id = ?
RETURNING *;

-- name: DeleteNode :exec
DELETE FROM nodes
WHERE id = ?;

-- name: GetEdge :one
SELECT * FROM edges
WHERE id = ? LIMIT 1;

-- name: ListEdges :many
SELECT * FROM edges
WHERE flow_id = ?
ORDER BY create_time;

-- name: CreateEdge :one
INSERT INTO edges (
  id,
  flow_id,
  source,
  target,
  type,
  label,
  hidden,
  marker_end,
  points
) VALUES (
  ?, ?, ?, ?, ?, ?, ?, ?, ?
)
RETURNING *;

-- name: UpdateEdge :exec
UPDATE edges SET
source = ?,
target = ?,
type = ?,
label = ?,
hidden = ?,
marker_end = ?,
points = ?
WHERE id = ?
RETURNING *;

-- name: DeleteEdge :exec
DELETE FROM edges
WHERE id = ?;
