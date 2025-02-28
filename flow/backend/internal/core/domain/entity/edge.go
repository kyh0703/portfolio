package entity

import (
	"database/sql"
	"encoding/json"

	"github.com/kyh0703/flow/internal/core/domain/model"
)

type MarkerEnd struct{}

type Point struct{}

type Edge struct {
	ID        string
	FlowID    int64
	Source    string
	Target    string
	Hidden    bool
	MarkerEnd *MarkerEnd
	Points    []Point
}

func (e *Edge) ToModel() (*model.Edge, error) {
	var model model.Edge
	model.ID = e.ID
	model.FlowID = e.FlowID
	model.Source = e.Source
	model.Target = e.Target

	model.Hidden = sql.NullInt64{
		Int64: func() int64 {
			if e.Hidden {
				return 1
			}
			return 0
		}(),
		Valid: true,
	}

	if e.MarkerEnd != nil {
		markerEndJSON, err := json.Marshal(e.MarkerEnd)
		if err != nil {
			return nil, err
		}
		model.MarkerEnd = sql.NullString{
			String: string(markerEndJSON),
			Valid:  true,
		}
	}

	if len(e.Points) > 0 {
		pointJSON, err := json.Marshal(e.Points)
		if err != nil {
			return nil, err
		}
		model.Points = sql.NullString{
			String: string(pointJSON),
			Valid:  true,
		}
	}

	return &model, nil
}
