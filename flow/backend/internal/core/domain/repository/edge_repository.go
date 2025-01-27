package repository

import (
	"context"

	"github.com/kyh0703/flow/internal/core/domain/entity"
)

// counterfeiter:generate . EdgeRepository

type EdgeRepository interface {
	CreateOne(ctx context.Context, param entity.Edge) (*entity.Edge, error)
	FindOne(ctx context.Context, id string) (*entity.Edge, error)
	GetList(ctx context.Context, subFlowID int64) (*[]entity.Edge, error)
	UpdateOne(ctx context.Context, param entity.Edge) error
	DeleteOne(ctx context.Context, id string) error
}
