package repository

import "go.uber.org/fx"

var RepositoryModule = fx.Provide(
	"repository",
	NewAuthRepository,
	NewUserRepository,
	NewSubFlowRepository,
	NewNodeRepository,
	NewEdgeRepository,
)
