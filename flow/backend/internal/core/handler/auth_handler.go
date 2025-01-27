package handler

import (
	"github.com/go-playground/validator"
	"github.com/gofiber/fiber/v2"
	"github.com/kyh0703/flow/internal/core/middleware"
	"github.com/kyh0703/flow/internal/core/service/auth"
	"github.com/kyh0703/flow/internal/pkg/response"

	dto "github.com/kyh0703/flow/internal/core/dto/auth"
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
	authService    auth.Service
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
		Mapping(fiber.MethodPost, "/auth/refresh", h.Refresh),
	}
}

func (h *authHandler) Whoami(c *fiber.Ctx) error {
	user := c.Locals("user")
	return response.Success(c, fiber.StatusOK, user)
}

func (h *authHandler) SignUp(c *fiber.Ctx) error {
	var signup dto.SignUp
	if err := c.BodyParser(&signup); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if err := h.validate.Struct(signup); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	user, err := h.authService.SignUp(c.Context(), &signup)
	if err != nil {
		return err
	}

	return response.Success(c, fiber.StatusOK, user)
}

func (h *authHandler) SignIn(c *fiber.Ctx) error {
	var signin dto.SignIn
	if err := c.BodyParser(&signin); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if err := h.validate.Struct(signin); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	token, err := h.authService.SignIn(c.Context(), &signin)
	if err != nil {
		return err
	}

	return response.Success(c, fiber.StatusOK, token)
}

func (h *authHandler) SignOut(c *fiber.Ctx) error {
	return response.Success(c, fiber.StatusOK, nil)
}

func (h *authHandler) Refresh(c *fiber.Ctx) error {
	var refresh dto.Refresh
	if err := c.BodyParser(&refresh); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if err := h.validate.Struct(refresh); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	token, err := h.authService.RefreshToken(c.Context(), &refresh)
	if err != nil {
		return err
	}

	return response.Success(c, fiber.StatusOK, token)
}
