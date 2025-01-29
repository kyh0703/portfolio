package repository

import (
	"context"

	"github.com/kyh0703/flow/internal/core/domain/model"
)

//counterfeiter:generate . NodeRepository
type NodeRepository interface {
	CreateOne(ctx context.Context, arg model.CreateNodeParams) (model.Node, error)
	FindOne(ctx context.Context, id string) (model.Node, error)
	GetList(ctx context.Context, subFlowId int64) ([]model.Node, error)
	UpdateOne(ctx context.Context, arg model.UpdateNodeParams) error
	DeleteOne(ctx context.Context, id string) error
}
