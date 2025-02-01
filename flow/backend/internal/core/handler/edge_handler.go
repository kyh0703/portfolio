package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/kyh0703/flow/internal/core/domain/repository"
)

//counterfeiter:generate . EdgeHandler
type EdgeHandler interface {
	Handler
	CreateOne(c *fiber.Ctx) error
	GetOne(c *fiber.Ctx) error
	DeleteOne(c *fiber.Ctx) error
	UpdateOne(c *fiber.Ctx) error
}

type edgeHandler struct {
	edgeRepository repository.EdgeRepository
}

func NewEdgeHandler(
	edgeRepository repository.EdgeRepository,
) EdgeHandler {
	return &edgeHandler{
		edgeRepository: edgeRepository,
	}
}

func (h *edgeHandler) Table() []Mapper {
	return []Mapper{
		Mapping(fiber.MethodPost, "/edge", h.CreateOne),
		Mapping(fiber.MethodGet, "/edge/:id", h.GetOne),
		Mapping(fiber.MethodPut, "/edge/:id", h.UpdateOne),
		Mapping(fiber.MethodDelete, "/edge/:id", h.DeleteOne),
	}
}

func (h *edgeHandler) CreateOne(c *fiber.Ctx) error {
	panic("unimplemented")
}

func (h *edgeHandler) GetOne(c *fiber.Ctx) error {
	panic("unimplemented")
}

func (h *edgeHandler) DeleteOne(c *fiber.Ctx) error {
	panic("unimplemented")
}

func (h *edgeHandler) UpdateOne(c *fiber.Ctx) error {
	panic("unimplemented")
}
