package repository

import (
	"context"

	"github.com/kyh0703/flow/internal/core/domain/model"
	"github.com/kyh0703/flow/internal/core/domain/repository"
)

type flowRepository struct {
	queries *model.Queries
}

func NewSubFlowRepository(
	queries *model.Queries,
) repository.FlowRepository {
	return &flowRepository{
		queries: queries,
	}
}

func (f *flowRepository) CreateOne(ctx context.Context, arg model.CreateFlowParams) (model.Flow, error) {
	return f.queries.CreateFlow(ctx, arg)
}

func (f *flowRepository) FindOne(ctx context.Context, id int64) (model.Flow, error) {
	return f.queries.GetFlow(ctx, id)
}

func (f *flowRepository) GetList(ctx context.Context, flowID int64) ([]model.Flow, error) {
	return f.queries.ListFlows(ctx, flowID)
}

func (f *flowRepository) UpdateOne(ctx context.Context, arg model.UpdateFlowParams) error {
	return f.queries.UpdateFlow(ctx, arg)
}

func (f *flowRepository) DeleteOne(ctx context.Context, id int64) error {
	return f.queries.DeleteFlow(ctx, id)
}
