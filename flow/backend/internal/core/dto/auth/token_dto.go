package auth

type AccessToken struct {
	AccessToken     string `json:"access_token"`
	AccessExpiresIn int64  `json:"access_expires_in"`
}

type RefreshToken struct {
	RefreshToken     string `json:"refresh_token"`
	RefreshExpiresIn int64  `json:"refresh_expires_in"`
}

type Token struct {
	Access  AccessToken
	Refresh RefreshToken
}
