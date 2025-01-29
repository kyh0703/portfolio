package db

import (
	"database/sql"

	"github.com/kyh0703/flow/configs"
	"github.com/kyh0703/flow/internal/core/domain/model"
)

func NewDB(config *configs.Config) model.DBTX {
	db, err := sql.Open("sqlite", ":memory:")
	if err != nil {
		return nil
	}

	return db
}

func NewQueries(db model.DBTX) *model.Queries {
	return model.New(db)
}
