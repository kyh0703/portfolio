package repository

import (
	"context"

	"github.com/kyh0703/flow/internal/core/domain/model"
	"github.com/kyh0703/flow/internal/core/domain/repository"
)

type projectRepository struct {
	queries *model.Queries
}

func NewProjectRepository(
	queries *model.Queries,
) repository.ProjectRepository {
	return &projectRepository{
		queries: queries,
	}
}

func (p *projectRepository) CreateOne(ctx context.Context, arg model.CreateProjectParams) (model.Project, error) {
	return p.queries.CreateProject(ctx, arg)
}

func (p *projectRepository) FindOne(ctx context.Context, id int64) (model.Project, error) {
	return p.queries.GetProject(ctx, id)
}

func (p *projectRepository) GetList(ctx context.Context) ([]model.Project, error) {
	return p.queries.ListProjects(ctx)
}

func (p *projectRepository) UpdateOne(ctx context.Context, arg model.UpdateProjectParams) error {
	return p.queries.UpdateProject(ctx, arg)
}

func (p *projectRepository) DeleteOne(ctx context.Context, id int64) error {
	return p.queries.DeleteProject(ctx, id)
}
