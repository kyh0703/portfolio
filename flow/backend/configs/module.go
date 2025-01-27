package configs

import "go.uber.org/fx"

var Module = fx.Module(
	"config",
	fx.Provide(
		NewConfig,
		NewVars,
	),
)
