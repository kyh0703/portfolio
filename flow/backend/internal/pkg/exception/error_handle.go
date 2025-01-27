package exception

import (
	"github.com/gofiber/fiber/v2"
	"github.com/kyh0703/flow/internal/core/dto"
)

func errorResponse(err error) (int, dto.ErrorResponse) {
	if ce, ok := err.(*Error); ok {
		return fiber.StatusBadRequest, dto.ErrorResponse{
			Code:    ce.Code,
			Message: ce.Message,
			Detail:  ce.Detail,
		}
	}

	return 500, dto.ErrorResponse{
		Message: "Internal Server Error",
		Detail:  "",
	}
}

func ErrorHandler(c *fiber.Ctx, err error) error {
	c.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)
	errCode, errBody := errorResponse(err)
	return c.Status(errCode).JSON(errBody)
}
