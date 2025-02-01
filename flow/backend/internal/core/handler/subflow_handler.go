package handler

import "github.com/gofiber/fiber/v2"

//counterfeiter:generate . SubFlowHandler
type SubFlowHandler interface {
	Handler
	CreateOne(c *fiber.Ctx) error
	GetOne(c *fiber.Ctx) error
	DeleteOne(c *fiber.Ctx) error
	UpdateOne(c *fiber.Ctx) error
	Capture(c *fiber.Ctx) error
	Undo(c *fiber.Ctx) error
	Redo(c *fiber.Ctx) error
}

type subFlowHandler struct{}

func NewSubFlowHandler() SubFlowHandler {
	return &subFlowHandler{}
}

func (h *subFlowHandler) Table() []Mapper {
	return []Mapper{
		Mapping(fiber.MethodPost, "/subflow", h.CreateOne),
		Mapping(fiber.MethodGet, "/subflow/:id", h.GetOne),
		Mapping(fiber.MethodPut, "/subflow/:id", h.UpdateOne),
		Mapping(fiber.MethodDelete, "/subflow/:id", h.DeleteOne),
		Mapping(fiber.MethodPost, "/subflow/:id/capture", h.Capture),
		Mapping(fiber.MethodPost, "/subflow/:id/undo", h.Undo),
		Mapping(fiber.MethodPost, "/subflow/:id/redo", h.Redo),
	}
}

func (h *subFlowHandler) CreateOne(c *fiber.Ctx) error {
	panic("unimplemented")
}

func (h *subFlowHandler) GetOne(c *fiber.Ctx) error {
	panic("unimplemented")
}

func (h *subFlowHandler) DeleteOne(c *fiber.Ctx) error {
	panic("unimplemented")
}

func (h *subFlowHandler) UpdateOne(c *fiber.Ctx) error {
	panic("unimplemented")
}

func (h *subFlowHandler) Capture(c *fiber.Ctx) error {
	panic("unimplemented")
}

func (h *subFlowHandler) Undo(c *fiber.Ctx) error {
	panic("unimplemented")
}

func (h *subFlowHandler) Redo(c *fiber.Ctx) error {
	panic("unimplemented")
}
