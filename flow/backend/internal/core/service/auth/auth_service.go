package auth

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/kyh0703/flow/internal/core/domain/model"
	"github.com/kyh0703/flow/internal/core/domain/repository"
	"github.com/kyh0703/flow/internal/core/dto/auth"
	"github.com/kyh0703/flow/internal/pkg/jwt"
	"github.com/kyh0703/flow/internal/pkg/password"
)

type authService struct {
	userRepository repository.UserRepository
}

func NewAuthService(
	userRepository repository.UserRepository,
) Service {
	return &authService{
		userRepository: userRepository,
	}
}

func (a *authService) SignUp(ctx context.Context, req *auth.SignUp) (*model.User, error) {
	existUser, err := a.userRepository.FindOneByEmail(ctx, req.Email)
	if err != nil {
		return nil, fiber.NewError(500, err.Error())
	}

	if existUser.ID != 0 {
		return nil, fiber.NewError(409, "email already exists")
	}

	if req.Password != req.PasswordConfirm {
		return nil, fiber.NewError(400, "password and password confirm do not match")
	}

	hash, err := password.Hashed(req.Password)
	if err != nil {
		return nil, fiber.NewError(500, err.Error())
	}

	createdUser, err := a.userRepository.CreateOne(ctx, model.CreateUserParams{
		Email:    req.Email,
		Password: hash,
		Name:     req.Name,
		Bio:      req.Bio,
	})
	if err != nil {
		return nil, fiber.NewError(500, err.Error())
	}

	return &createdUser, nil
}

func (a *authService) SignIn(ctx context.Context, req *auth.SignIn) (*auth.Token, error) {
	user, err := a.userRepository.FindOneByEmail(ctx, req.Email)
	if err != nil {
		return nil, fiber.NewError(500, err.Error())
	}

	ok, err := password.Compare(req.Password, user.Password)
	if err != nil || !ok {
		return nil, fiber.NewError(fiber.StatusUnauthorized, "invalid email or password")
	}

	accessExpire := time.Now().Add(jwt.AccessTokenExpireDuration)
	accessToken, err := jwt.GenerateToken(req.Email, accessExpire)
	if err != nil {
		return nil, fiber.NewError(500, err.Error())
	}

	refreshExpire := time.Now().Add(jwt.RefreshTokenExpireDuration)
	refreshToken, err := jwt.GenerateToken(req.Email, refreshExpire)
	if err != nil {
		return nil, fiber.NewError(500, err.Error())
	}

	// TODO Save

	return &auth.Token{
		AccessToken:   accessToken,
		AccessExpire:  accessExpire.Unix(),
		RefreshToken:  refreshToken,
		RefreshExpire: refreshExpire.Unix(),
	}, nil
}

func (a *authService) RefreshToken(ctx context.Context, req *auth.Refresh) (*auth.Token, error) {
	panic("unimplemented")
}

func (a *authService) SignOut(ctx context.Context) error {
	// TODO context 제거
	panic("unimplemented")
}
