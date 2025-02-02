package main

import (
	"context"
	"log"
	"os/signal"
	"syscall"

	"github.com/gofiber/fiber/v2"
	"github.com/kyh0703/flow/configs"
	"github.com/kyh0703/flow/internal/core/handler"
	"github.com/kyh0703/flow/internal/core/middleware"
	"github.com/kyh0703/flow/internal/core/recorder"
	"github.com/kyh0703/flow/internal/core/repository"
	"github.com/kyh0703/flow/internal/core/service"
	"github.com/kyh0703/flow/internal/pkg"
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
		pkg.Module,
		recorder.Module,
		repository.Module,
		service.Module,
		middleware.Module,
		handler.Module,
		Module,
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
