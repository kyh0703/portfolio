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
  expires_at
) VALUES (
  ?, ?, ?
)
RETURNING *;

-- name: UpdateToken :exec
UPDATE tokens SET
user_id = ?,
refresh_token = ?,
expires_at = ?
WHERE id = ?
RETURNING *;

-- name: DeleteToken :exec
DELETE FROM tokens
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

-- name: CreateSubFlow :one
INSERT INTO sub_flows (
  name,
  description
) VALUES (
  ?, ?
)
RETURNING *;

-- name: GetSubFlow :one
SELECT * FROM sub_flows
WHERE id = ? LIMIT 1;

-- name: ListSubFlows :many
SELECT * FROM sub_flows
WHERE flow_id = ?
ORDER BY name;

-- name: UpdateSubFlow :exec
UPDATE sub_flows SET
name = ?,
description = ?
WHERE id = ?
RETURNING *;

-- name: DeleteSubFlow :exec
DELETE FROM sub_flows
WHERE id = ?;

-- name: GetNode :one
SELECT * FROM nodes
WHERE id = ? LIMIT 1;

-- name: ListNodes :many
SELECT * FROM nodes
WHERE sub_flow_id = ?
ORDER BY create_time;

-- name: CreateNode :one
INSERT INTO nodes (
  id,
  sub_flow_id,
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
WHERE sub_flow_id = ?
ORDER BY create_time;

-- name: CreateEdge :one
INSERT INTO edges (
  id,
  sub_flow_id,
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
