package auth

import (
	"context"

	"github.com/kyh0703/flow/internal/core/dto/auth"
)

//go:generate go run github.com/maxbrunsfeld/counterfeiter/v6 -generate

//counterfeiter:generate . Service
type Service interface {
	SignUp(ctx context.Context, req *auth.SignUp) (*auth.Token, error)
	SignIn(ctx context.Context, req *auth.SignIn) (*auth.Token, error)
	SignOut(ctx context.Context) error
	RefreshToken(ctx context.Context, req *auth.Refresh) (*auth.Token, error)
}
