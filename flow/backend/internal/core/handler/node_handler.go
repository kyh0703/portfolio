package handler

import "github.com/gofiber/fiber/v2"

//counterfeiter:generate . NodeHandler
type NodeHandler interface {
	Handler
	CreateOne(c *fiber.Ctx) error
	GetOne(c *fiber.Ctx) error
	DeleteOne(c *fiber.Ctx) error
	UpdateOne(c *fiber.Ctx) error
}

type nodeHandler struct{}

func NewNodeHandler() NodeHandler {
	return &nodeHandler{}
}

func (h *nodeHandler) Table() []Mapper {
	return []Mapper{
		Mapping(fiber.MethodPost, "/node", h.CreateOne),
		Mapping(fiber.MethodGet, "/node/:id", h.GetOne),
		Mapping(fiber.MethodPut, "/node/:id", h.UpdateOne),
		Mapping(fiber.MethodDelete, "/node/:id", h.DeleteOne),
	}
}

func (h *nodeHandler) CreateOne(c *fiber.Ctx) error {
	panic("unimplemented")
}

func (h *nodeHandler) GetOne(c *fiber.Ctx) error {
	panic("unimplemented")
}

func (h *nodeHandler) DeleteOne(c *fiber.Ctx) error {
	panic("unimplemented")
}

func (h *nodeHandler) UpdateOne(c *fiber.Ctx) error {
	panic("unimplemented")
}
