package repository

import (
	"context"

	"github.com/kyh0703/flow/internal/core/domain/model"
)

// counterfeiter:generate . SubFlowRepository

type SubFlowRepository interface {
	CreateOne(ctx context.Context, arg model.CreateSubFlowParams) (model.SubFlow, error)
	FindOne(ctx context.Context, id int64) (model.SubFlow, error)
	GetList(ctx context.Context, flowID int64) ([]model.SubFlow, error)
	UpdateOne(ctx context.Context, arg model.UpdateSubFlowParams) error
	DeleteOne(ctx context.Context, id int64) error
}
