package repository

import (
	"context"

	"github.com/kyh0703/flow/internal/core/domain/model"
	"github.com/kyh0703/flow/internal/core/domain/repository"
)

type nodeRepository struct {
	queries *model.Queries
}

func NewNodeRepository(
	queries *model.Queries,
) repository.NodeRepository {
	return &nodeRepository{
		queries: queries,
	}
}

func (n *nodeRepository) CreateOne(ctx context.Context, arg model.CreateNodeParams) (model.Node, error) {
	return n.queries.CreateNode(ctx, arg)
}

func (n *nodeRepository) FindOne(ctx context.Context, id string) (model.Node, error) {
	return n.queries.GetNode(ctx, id)
}

func (n *nodeRepository) GetList(ctx context.Context, subFlowId int64) ([]model.Node, error) {
	return n.queries.ListNodes(ctx, subFlowId)
}

func (n *nodeRepository) UpdateOne(ctx context.Context, arg model.UpdateNodeParams) error {
	return n.queries.UpdateNode(ctx, arg)
}

func (n *nodeRepository) DeleteOne(ctx context.Context, id string) error {
	return n.queries.DeleteNode(ctx, id)
}
