package handler

import (
	"go.uber.org/fx"
)

var HandlerModule = fx.Module(
	"handler",
	fx.Provide(
		AsHandler(NewAuthHandler),
		AsHandler(NewEdgeHandler),
		AsHandler(NewNodeHandler),
		AsHandler(NewSubFlowHandler),
		AsHandler(NewUserHandler),
	),
)
