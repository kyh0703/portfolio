package main

import (
	"context"
	"log"
	"os/signal"
	"syscall"

	"github.com/go-playground/validator"
	"github.com/gofiber/fiber/v2"
	"github.com/kyh0703/flow/configs"
	"github.com/kyh0703/flow/internal/core/handler"
	"go.uber.org/fx"
)

func invoke(lc fx.Lifecycle, config *configs.Config, fiber *fiber.App) {
	app := NewApp(config, fiber)
	lc.Append(fx.Hook{
		OnStart: app.Run,
		OnStop:  app.Stop,
	})
}

// @title flow API
// @version 1.0
// @host localhost:8080
// @accept application/json
// @produce application/json
func main() {
	app := fx.New(
		configs.Module,
		handler.HandlerModule,
		fx.Provide(validator.New()),
		fx.Provide(
			fx.Annotate(NewFiber, fx.ParamTags(`group:"handlers"`)),
		),
		fx.Invoke(invoke),
	)

	// create context that listens for the interrupt signal from the OS
	ctx, stop := signal.NotifyContext(
		context.Background(),
		syscall.SIGINT,
		syscall.SIGTERM,
	)
	defer stop()

	if err := app.Start(ctx); err != nil {
		log.Fatal(err)
	}
	<-ctx.Done()

	app.Stop(ctx)
	stop()
}
