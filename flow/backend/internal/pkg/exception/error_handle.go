package exception

import (
	"github.com/gofiber/fiber/v2"
	"github.com/kyh0703/flow/internal/pkg/response"
)

func errorResponse(err error) (int, response.Error) {
	if ce, ok := err.(*Error); ok {
		return fiber.StatusBadRequest, response.Error{
			Code:    ce.Code,
			Message: ce.Message,
			Detail:  ce.Detail,
		}
	}

	return 500, response.Error{
		Message: "Internal Server Error",
		Detail:  "",
	}
}

func ErrorHandler(c *fiber.Ctx, err error) error {
	c.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)
	errCode, errBody := errorResponse(err)
	return c.Status(errCode).JSON(errBody)
}
