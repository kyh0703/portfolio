package recorder

import "go.uber.org/fx"

var RepositoryModule = fx.Provide(
	"recorder",
	NewNodeRecorder,
	NewEdgeRecorder,
)
