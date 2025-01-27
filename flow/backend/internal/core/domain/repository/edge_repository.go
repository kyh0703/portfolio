package repository

import (
	"context"

	"github.com/kyh0703/flow/internal/core/domain/model"
)

//go:generate go run github.com/maxbrunsfeld/counterfeiter/v6 -generate

// counterfeiter:generate . EdgeRepository

type EdgeRepository interface {
	CreateOne(ctx context.Context, arg model.CreateEdgeParams) (model.Edge, error)
	FindOne(ctx context.Context, id string) (model.Edge, error)
	GetList(ctx context.Context, subFlowID int64) ([]model.Edge, error)
	UpdateOne(ctx context.Context, arg model.UpdateEdgeParams) error
	DeleteOne(ctx context.Context, id string) error
}
