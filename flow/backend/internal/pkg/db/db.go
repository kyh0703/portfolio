package db

import (
	"context"
	"database/sql"
	"time"

	"github.com/kyh0703/flow/configs"
	"github.com/kyh0703/flow/internal/core/domain/model"
)

//go:embed schema.sql
var ddl string

func NewDB(config *configs.Config) (model.DBTX, error) {
	db, err := sql.Open("sqlite", ":memory:")
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if _, err := db.ExecContext(ctx, ddl); err != nil {
		return nil, err
	}

	return db, nil
}

func NewQueries(db model.DBTX) *model.Queries {
	return model.New(db)
}
