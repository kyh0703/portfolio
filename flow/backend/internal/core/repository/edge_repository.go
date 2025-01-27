package repository

import (
	"context"

	"github.com/kyh0703/flow/internal/core/domain/entity"
	"github.com/kyh0703/flow/internal/core/domain/model"
	"github.com/kyh0703/flow/internal/core/domain/repository"
	"github.com/kyh0703/flow/internal/core/recorder"
)

type edgeRepository struct {
	edgeRecorder recorder.EdgeRecorder
}

func NewEdgeRepository(
	edgeRecorder recorder.EdgeRecorder,
) repository.EdgeRepository {
	return &edgeRepository{
		edgeRecorder: edgeRecorder,
	}
}

func (e *edgeRepository) CreateOne(ctx context.Context, param entity.Edge) (*entity.Edge, error) {
	recorder, err := param.ToModel()
	if err != nil {
		return nil, err
	}

	edge, err := e.edgeRecorder.CreateOne(ctx, model.CreateEdgeParams{
		ID:        recorder.ID,
		SubFlowID: recorder.SubFlowID,
		Source:    recorder.Source,
		Target:    recorder.Target,
		Hidden:    recorder.Hidden,
		Points:    recorder.Points,
	})
	if err != nil {
		return nil, err
	}

	response := param
	response.ID = edge.ID.(string)
	return &response, nil
}

func (e *edgeRepository) DeleteOne(ctx context.Context, id string) error {
	panic("unimplemented")
}

func (e *edgeRepository) FindOne(ctx context.Context, id string) (*entity.Edge, error) {
	panic("unimplemented")
}

func (e *edgeRepository) GetList(ctx context.Context, subFlowID int64) (*[]entity.Edge, error) {
	panic("unimplemented")
}

func (e *edgeRepository) UpdateOne(ctx context.Context, arg entity.Edge) error {
	panic("unimplemented")
}
