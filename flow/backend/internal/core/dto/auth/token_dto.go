package auth

type Token struct {
	UserID           int64  `json:"user_id"`
	TokenType        string `json:"token_type"`
	AccessToken      string `json:"access_token"`
	AccessExpiresIn  int64  `json:"access_expires_in"`
	RefreshToken     string `json:"refresh_token"`
	RefreshExpiresIn int64  `json:"refresh_expires_in"`
}
