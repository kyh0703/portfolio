package repository

import (
	"context"

	"github.com/kyh0703/flow/internal/core/domain/model"
	"github.com/kyh0703/flow/internal/core/domain/repository"
)

type subFlowRepository struct {
	queries *model.Queries
}

func NewSubFlowRepository(
	queries *model.Queries,
) repository.SubFlowRepository {
	return &subFlowRepository{
		queries: queries,
	}
}

func (s *subFlowRepository) CreateOne(ctx context.Context, arg model.CreateSubFlowParams) (model.SubFlow, error) {
	return s.queries.CreateSubFlow(ctx, arg)
}

func (s *subFlowRepository) FindOne(ctx context.Context, id int64) (model.SubFlow, error) {
	return s.queries.GetSubFlow(ctx, id)
}

func (s *subFlowRepository) GetList(ctx context.Context, flowID int64) ([]model.SubFlow, error) {
	return s.queries.ListSubFlows(ctx, flowID)
}

func (s *subFlowRepository) UpdateOne(ctx context.Context, arg model.UpdateSubFlowParams) error {
	return s.queries.UpdateSubFlow(ctx, arg)
}

func (s *subFlowRepository) DeleteOne(ctx context.Context, id int64) error {
	return s.queries.DeleteSubFlow(ctx, id)
}
