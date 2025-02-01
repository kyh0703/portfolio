package recorder

import (
	"context"

	"github.com/kyh0703/flow/internal/core/domain/model"
)

//counterfeiter:generate . NodeRecorder
type NodeRecorder interface {
	CreateOne(ctx context.Context, arg model.CreateNodeParams) (model.Node, error)
	FindOne(ctx context.Context, id string) (model.Node, error)
	GetList(ctx context.Context, subFlowId int64) ([]model.Node, error)
	UpdateOne(ctx context.Context, arg model.UpdateNodeParams) error
	DeleteOne(ctx context.Context, id string) error
}

type nodeRecorder struct {
	queries *model.Queries
}

func NewNodeRecorder(
	queries *model.Queries,
) NodeRecorder {
	return &nodeRecorder{
		queries: queries,
	}
}

func (n *nodeRecorder) CreateOne(ctx context.Context, arg model.CreateNodeParams) (model.Node, error) {
	return n.queries.CreateNode(ctx, arg)
}

func (n *nodeRecorder) FindOne(ctx context.Context, id string) (model.Node, error) {
	return n.queries.GetNode(ctx, id)
}

func (n *nodeRecorder) GetList(ctx context.Context, subFlowId int64) ([]model.Node, error) {
	return n.queries.ListNodes(ctx, subFlowId)
}

func (n *nodeRecorder) UpdateOne(ctx context.Context, arg model.UpdateNodeParams) error {
	return n.queries.UpdateNode(ctx, arg)
}

func (n *nodeRecorder) DeleteOne(ctx context.Context, id string) error {
	return n.queries.DeleteNode(ctx, id)
}
