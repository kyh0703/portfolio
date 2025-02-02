package auth

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/kyh0703/flow/internal/core/domain/model"
	"github.com/kyh0703/flow/internal/core/domain/repository"
	"github.com/kyh0703/flow/internal/core/dto/auth"
	"github.com/kyh0703/flow/internal/pkg/jwt"
	"github.com/kyh0703/flow/internal/pkg/password"
)

type authService struct {
	authRepository repository.AuthRepository
	userRepository repository.UserRepository
}

func NewAuthService(
	authRepository repository.AuthRepository,
	userRepository repository.UserRepository,
) Service {
	return &authService{
		authRepository: authRepository,
		userRepository: userRepository,
	}
}

func (a *authService) generateNewTokens(ctx context.Context, user model.User) (*auth.Token, error) {
	accessExpire := time.Now().Add(jwt.AccessTokenExpireDuration)
	accessToken, err := jwt.GenerateToken(user.Email, accessExpire)
	if err != nil {
		return nil, fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	refreshExpire := time.Now().Add(jwt.RefreshTokenExpireDuration)
	refreshToken, err := jwt.GenerateToken(user.Email, refreshExpire)
	if err != nil {
		return nil, fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if _, err := a.authRepository.CreateOne(ctx, model.CreateTokenParams{
		UserID:       user.ID,
		RefreshToken: refreshToken,
		ExpiresIn:    refreshExpire.Unix(),
	}); err != nil {
		return nil, fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return &auth.Token{
		Access: auth.AccessToken{
			AccessToken:     accessToken,
			AccessExpiresIn: accessExpire.Unix(),
		},
		Refresh: auth.RefreshToken{
			RefreshToken:     refreshToken,
			RefreshExpiresIn: refreshExpire.Unix(),
		},
	}, nil
}

func (a *authService) SignUp(ctx context.Context, req *auth.SignUp) (*auth.Token, error) {
	existUser, err := a.userRepository.FindOneByEmail(ctx, req.Email)
	if err != nil {
		return nil, fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if existUser.ID != 0 {
		return nil, fiber.NewError(fiber.StatusConflict, "email already exists")
	}

	if req.Password != req.ConfirmPassword {
		return nil, fiber.NewError(fiber.StatusNotFound, "password and password confirm do not match")
	}

	hash, err := password.Hashed(req.Password)
	if err != nil {
		return nil, fiber.NewError(fiber.StatusInternalServerError, err.Error())
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

	return a.generateNewTokens(ctx, createdUser)
}

func (a *authService) SignIn(ctx context.Context, req *auth.SignIn) (*auth.Token, error) {
	user, err := a.userRepository.FindOneByEmail(ctx, req.Email)
	if err != nil {
		return nil, fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	ok, err := password.Compare(req.Password, user.Password)
	if err != nil || !ok {
		return nil, fiber.NewError(fiber.StatusUnauthorized, "invalid email or password")
	}

	token, err := a.authRepository.FindOneByUserID(ctx, user.ID)
	if err != nil {
		if !errors.Is(err, sql.ErrNoRows) {
			return nil, fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		return a.generateNewTokens(ctx, user)
	}

	expire := time.Unix(token.ExpiresIn, 0)
	if expire.After(time.Now()) {
		if err := a.authRepository.DeleteOne(ctx, token.ID); err != nil {
			return nil, fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		return a.generateNewTokens(ctx, user)
	}

	accessExpire := time.Now().Add(jwt.AccessTokenExpireDuration)
	accessToken, err := jwt.GenerateToken(req.Email, accessExpire)
	if err != nil {
		return nil, fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return &auth.Token{
		Access: auth.AccessToken{
			AccessToken:     accessToken,
			AccessExpiresIn: accessExpire.Unix(),
		},
		Refresh: auth.RefreshToken{
			RefreshToken:     token.RefreshToken,
			RefreshExpiresIn: token.ExpiresIn,
		},
	}, nil
}

func (a *authService) SignOut(ctx context.Context) error {
	return nil
}

func (a *authService) RefreshToken(ctx context.Context, req *auth.Refresh) (*auth.Token, error) {
	mapClaims, err := jwt.ParseToken(req.RefreshToken)
	if err != nil {
		return nil, fiber.NewError(fiber.StatusUnauthorized, err.Error())
	}

	email := mapClaims["email"].(string)
	if email == "" {
		return nil, fiber.NewError(fiber.StatusUnauthorized, "unauthorized")
	}

	user, err := a.userRepository.FindOneByEmail(ctx, email)
	if err != nil {
		return nil, fiber.NewError(fiber.StatusUnauthorized, err.Error())
	}

	token, err := a.authRepository.FindOneByUserID(ctx, user.ID)
	if err != nil {
		return nil, fiber.NewError(fiber.StatusUnauthorized, err.Error())
	}

	expire := time.Unix(token.ExpiresIn, 0)
	if expire.After(time.Now()) {
		return nil, fiber.NewError(fiber.StatusUnauthorized, "unauthorized")
	}

	accessExpire := time.Now().Add(jwt.AccessTokenExpireDuration)
	accessToken, err := jwt.GenerateToken(email, accessExpire)
	if err != nil {
		return nil, fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return &auth.Token{
		Access: auth.AccessToken{
			AccessToken:     accessToken,
			AccessExpiresIn: accessExpire.Unix(),
		},
		Refresh: auth.RefreshToken{
			RefreshToken:     token.RefreshToken,
			RefreshExpiresIn: token.ExpiresIn,
		},
	}, nil
}
