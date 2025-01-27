package recorder

import (
	"context"

	"github.com/kyh0703/flow/internal/core/domain/model"
)

type EdgeRecorder interface {
	CreateOne(ctx context.Context, arg model.CreateEdgeParams) (model.Edge, error)
	FindOne(ctx context.Context, id string) (model.Edge, error)
	GetList(ctx context.Context, subFlowID int64) ([]model.Edge, error)
	UpdateOne(ctx context.Context, arg model.UpdateEdgeParams) error
	DeleteOne(ctx context.Context, id string) error
}

type edgeRecorder struct {
	queries *model.Queries
}

func NewEdgeRecorder(
	queries *model.Queries,
) EdgeRecorder {
	return &edgeRecorder{
		queries: queries,
	}
}

func (e *edgeRecorder) CreateOne(ctx context.Context, arg model.CreateEdgeParams) (model.Edge, error) {
	return e.queries.CreateEdge(ctx, arg)
}

func (e *edgeRecorder) FindOne(ctx context.Context, id string) (model.Edge, error) {
	return e.queries.GetEdge(ctx, id)
}

func (e *edgeRecorder) GetList(ctx context.Context, subFlowID int64) ([]model.Edge, error) {
	return e.queries.ListEdges(ctx, subFlowID)
}

func (e *edgeRecorder) UpdateOne(ctx context.Context, arg model.UpdateEdgeParams) error {
	return e.queries.UpdateEdge(ctx, arg)
}

func (e *edgeRecorder) DeleteOne(ctx context.Context, id string) error {
	return e.queries.DeleteEdge(ctx, id)
}
