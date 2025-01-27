package auth

type Refresh struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}
