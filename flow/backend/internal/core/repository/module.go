package repository

import "go.uber.org/fx"

var RepositoryModule = fx.Provide(
	"repository",
	NewUserRepository,
	NewSubFlowRepository,
	NewNodeRepository,
	NewEdgeRepository,
)
