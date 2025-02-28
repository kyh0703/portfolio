package repository

import (
	"context"

	"github.com/kyh0703/flow/internal/core/domain/model"
)

//counterfeiter:generate . ProjectRepository
type ProjectRepository interface {
	CreateOne(ctx context.Context, arg model.CreateProjectParams) (model.Project, error)
	FindOne(ctx context.Context, id int64) (model.Project, error)
	GetList(ctx context.Context) ([]model.Project, error)
	UpdateOne(ctx context.Context, arg model.UpdateProjectParams) error
	DeleteOne(ctx context.Context, id int64) error
}
