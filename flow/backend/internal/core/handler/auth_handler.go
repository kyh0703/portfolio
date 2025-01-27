package handler

import (
	"github.com/go-playground/validator"
	"github.com/gofiber/fiber/v2"
	"github.com/kyh0703/flow/internal/core/dto"
	"github.com/kyh0703/flow/internal/core/dto/auth"
	"github.com/kyh0703/flow/internal/core/middleware"
)

type AuthHandler interface {
	Handler
	SignUp(c *fiber.Ctx) error
	SignIn(c *fiber.Ctx) error
	SignOut(c *fiber.Ctx) error
	Refresh(c *fiber.Ctx) error
}

type authHandler struct {
	validate       *validator.Validate
	authMiddleware middleware.AuthMiddleware
}

func NewAuthHandler(
	validate *validator.Validate,
	authMiddleware middleware.AuthMiddleware,
) AuthHandler {
	return &authHandler{
		validate:       validate,
		authMiddleware: authMiddleware,
	}
}

func (h *authHandler) Table() []Mapper {
	return []Mapper{
		Mapping(fiber.MethodGet, "/auth/whoami", h.authMiddleware.CurrentUser(), h.Whoami),
		Mapping(fiber.MethodPost, "/auth/signup", h.SignUp),
		Mapping(fiber.MethodPost, "/auth/signin", h.SignIn),
		Mapping(fiber.MethodPost, "/auth/signout", h.SignOut),
	}
}

func (h *authHandler) Whoami(c *fiber.Ctx) error {
	user := c.Locals("user")
	return dto.Response(c, fiber.StatusOK, user)
}

func (h *authHandler) SignUp(c *fiber.Ctx) error {
	var signup auth.SignUp
	if err := c.BodyParser(&signup); err != nil {
		return fiber.NewError(400, err.Error())
	}

	if err := h.validate.Struct(signup); err != nil {
		return fiber.NewError(400, err.Error())
	}

	return dto.Response(c, fiber.StatusOK, nil)
}

func (h *authHandler) SignIn(c *fiber.Ctx) error {
	var signin auth.SignIn
	if err := c.BodyParser(&signin); err != nil {
		return fiber.NewError(400, err.Error())
	}

	if err := h.validate.Struct(signin); err != nil {
		return fiber.NewError(400, err.Error())
	}

	return dto.Response(c, fiber.StatusOK, nil)
}

func (h *authHandler) Refresh(c *fiber.Ctx) error {
	var refresh auth.Refresh
	if err := c.BodyParser(&refresh); err != nil {
		return fiber.NewError(400, err.Error())
	}

	if err := h.validate.Struct(refresh); err != nil {
		return fiber.NewError(400, err.Error())
	}

	return dto.Response(c, fiber.StatusOK, nil)
}

func (h *authHandler) SignOut(c *fiber.Ctx) error {
	c.ClearCookie()
	return dto.Response(c, fiber.StatusOK, nil)
}
