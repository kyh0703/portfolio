package auth

import "database/sql"

type SignUp struct {
	Email           string         `json:"email" validate:"required,email"`
	Name            string         `json:"name" validate:"required,min=2,max=20"`
	Password        string         `json:"password" validate:"required,min=6,max=20"`
	ConfirmPassword string         `json:"confirmPassword" validate:"required,min=6,max=20"`
	Bio             sql.NullString `json:"bio" validate:"max=100"`
}
