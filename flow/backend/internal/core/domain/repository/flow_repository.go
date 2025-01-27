package repository

import (
	"context"

	"github.com/kyh0703/flow/internal/core/domain/model"
)

// counterfeiter:generate . FlowRepository

type FlowRepository interface {
	CreateOne(ctx context.Context, arg model.CreateFlowParams) (model.Flow, error)
	FindOne(ctx context.Context, id int64) (model.Flow, error)
	GetList(ctx context.Context) ([]model.Flow, error)
	UpdateOne(ctx context.Context, arg model.UpdateFlowParams) error
	DeleteOne(ctx context.Context, id int64) error
}
