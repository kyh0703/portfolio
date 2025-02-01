package edges

import (
	"database/sql"

	"github.com/gofrs/uuid"
)

type CreateEdge struct {
	ID        uuid.UUID      `json:"id" validate:"required"`
	SubFlowID int64          `json:"sub_flow_id" validate:"required"`
	Source    int64          `json:"source" validate:"required"`
	Target    int64          `json:"target" validate:"required"`
	Type      string         `json:"type" validate:"required"`
	Label     sql.NullString `json:"label"`
	Hidden    sql.NullInt64  `json:"hidden"`
	MarkerEnd sql.NullString `json:"marker_end"`
	Points    sql.NullString `json:"points"`
}
