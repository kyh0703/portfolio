package logger

import (
	"fmt"
	"os"

	"github.com/kyh0703/flow/configs"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var Zap *Sugared

type Sugared struct {
	*zap.SugaredLogger
}

func New(config *configs.Config) *Sugared {
	level := zap.InfoLevel
	if config.App.LogLevel != "" {
		levelFromEnv, err := zapcore.ParseLevel(config.App.LogLevel)
		if err != nil {
			fmt.Println("Invalid Level, defaulting to INFO: %w", err)
		}
		level = levelFromEnv
	}

	var encoderConfig zapcore.EncoderConfig
	var encoding string

	if os.Getenv("env") == "prod" {
		encoderConfig = zap.NewProductionEncoderConfig()
		encoding = "json"
	} else {
		encoderConfig = zap.NewDevelopmentEncoderConfig()
		encoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
		encoding = "console"
	}

	encoderConfig.MessageKey = "message"
	encoderConfig.LevelKey = "level"
	encoderConfig.TimeKey = "time"
	encoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	encoderConfig.CallerKey = "caller"
	encoderConfig.EncodeCaller = zapcore.ShortCallerEncoder

	zapConfig := zap.Config{
		Level:             zap.NewAtomicLevelAt(level),
		Development:       false,
		DisableCaller:     false,
		DisableStacktrace: false,
		Sampling:          nil,
		Encoding:          encoding,
		EncoderConfig:     encoderConfig,
		OutputPaths: []string{
			"stderr",
		},
		ErrorOutputPaths: []string{
			"stderr",
		},
		InitialFields: map[string]interface{}{},
	}

	Zap = &Sugared{
		zap.Must(zapConfig.Build()).Sugar(),
	}

	return Zap
}

func (l *Sugared) Printf(format string, args ...interface{}) {
	l.Infof(format, args...)
}
