package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/kyh0703/flow/internal/core/domain/repository"
	"github.com/kyh0703/flow/internal/pkg/jwt"
)

type AuthMiddleware interface {
	CurrentUser() fiber.Handler
}

type authMiddleware struct {
	userRepository repository.UserRepository
}

func NewAuthMiddleware(
	userRepository repository.UserRepository,
) AuthMiddleware {
	return &authMiddleware{
		userRepository: userRepository,
	}
}

func (a *authMiddleware) CurrentUser() fiber.Handler {
	return func(c *fiber.Ctx) error {
		bearerToken := c.Get("Authorization")
		if bearerToken == "" {
			return fiber.NewError(401, "unauthorized")
		}

		var tokenString string
		strArr := strings.Split(bearerToken, " ")
		if len(strArr) == 2 {
			tokenString = strArr[1]
		}

		if tokenString == "" {
			return fiber.NewError(401, "unauthorized")
		}

		mapClaims, err := jwt.ParseToken(tokenString)
		if err != nil {
			return fiber.NewError(401, err.Error())
		}

		email := mapClaims["email"].(string)
		if email == "" {
			return fiber.NewError(401, "unauthorized")
		}

		user, err := a.userRepository.FindOneByEmail(c.Context(), email)
		if err != nil {
			return fiber.NewError(401, err.Error())
		}

		c.Locals("user", user)
		return c.Next()
	}
}
