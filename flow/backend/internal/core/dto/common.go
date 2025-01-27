package dto

import "github.com/gofiber/fiber/v2"

type response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func Response(c *fiber.Ctx, status int, data interface{}) error {
	return c.Status(status).JSON(response{
		Code:    0,
		Message: "success",
		Data:    data,
	})
}

type ErrorResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Detail  string `json:"detail"`
}
