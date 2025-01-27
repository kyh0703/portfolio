package auth

import (
	"context"

	"github.com/kyh0703/flow/internal/core/domain/model"
	"github.com/kyh0703/flow/internal/core/dto/auth"
)

type Service interface {
	SignUp(ctx context.Context, req *auth.SignUp) (*model.User, error)
	SignIn(ctx context.Context, req *auth.SignIn) (*auth.Token, error)
	RefreshToken(ctx context.Context, req *auth.Refresh) (*auth.Token, error)
	SignOut(ctx context.Context) error
}
