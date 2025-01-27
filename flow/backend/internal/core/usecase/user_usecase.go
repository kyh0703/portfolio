package user

import (
	"context"

	"github.com/kyh0703/flow/internal/core/domain/model"
)

type UserUsecase interface {
	Create(ctx context.Context, email, username, password string)
	Get(ctx context.Context, email string)
	GetById(ctx context.Context, id int)
	Update(ctx context.Context, id int, param model.UpdateUserParams) error
	Remove(ctx context.Context, id int) error
}
