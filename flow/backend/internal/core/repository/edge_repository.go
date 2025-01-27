package repository

import (
	"context"

	"github.com/kyh0703/flow/internal/core/domain/model"
	"github.com/kyh0703/flow/internal/core/domain/repository"
)

type edgeRepository struct {
	queries *model.Queries
}

func NewEdgeRepository(
	queries *model.Queries,
) repository.EdgeRepository {
	return &edgeRepository{
		queries: queries,
	}
}

func (e *edgeRepository) CreateOne(ctx context.Context, arg model.CreateEdgeParams) (model.Edge, error) {
	return e.queries.CreateEdge(ctx, arg)
}

func (e *edgeRepository) FindOne(ctx context.Context, id string) (model.Edge, error) {
	return e.queries.GetEdge(ctx, id)
}

func (e *edgeRepository) GetList(ctx context.Context, subFlowID int64) ([]model.Edge, error) {
	return e.queries.ListEdges(ctx, subFlowID)
}

func (e *edgeRepository) UpdateOne(ctx context.Context, arg model.UpdateEdgeParams) error {
	return e.queries.UpdateEdge(ctx, arg)
}

func (e *edgeRepository) DeleteOne(ctx context.Context, id string) error {
	return e.queries.DeleteEdge(ctx, id)
}
