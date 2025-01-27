package auth

type Token struct {
	UserID        int64  `json:"user_id"`
	TokenType     string `json:"token_type"`
	AccessToken   string `json:"access_token"`
	AccessExpire  int64  `json:"access_expire"`
	RefreshToken  string `json:"refresh_token"`
	RefreshExpire int64  `json:"refresh_expire"`
}
