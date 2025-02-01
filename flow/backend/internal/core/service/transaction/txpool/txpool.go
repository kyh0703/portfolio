package txpool

import (
	"fmt"
	"sync"

	"github.com/gofrs/uuid"
)

type TxPool struct {
	txMap      map[uuid.UUID]*Tx
	txCountMap map[string]int
	wg         sync.WaitGroup
	mutex      sync.RWMutex
}

func NewTxPool() *TxPool {
	return &TxPool{
		txMap:      make(map[uuid.UUID]*Tx),
		txCountMap: make(map[string]int),
	}
}

func (pool *TxPool) PrintTx() {
	pool.mutex.RLock()
	defer pool.mutex.RUnlock()

	for _, tx := range pool.txMap {
		fmt.Println(tx)
	}
}

func (pool *TxPool) BeginTx(inner *dto.TxConfigDto) {
	// create tx data.
	pool.mutex.Lock()
	defer pool.mutex.Unlock()
	// compute tx type and count.
	uuid, _ := uuid.NewV4()
	pool.wg.Add(1)
	go func() {
		defer pool.wg.Done()
		defer pool.EndTx(uuid)
	}()
}

func (pool *TxPool) EndTx(id uuid.UUID) {
	pool.mutex.Lock()
	defer pool.mutex.Unlock()

	tx, ok := pool.txMap[id]
	if !ok {
		return
	}
	tx.Close()
	delete(pool.txMap, id)
}

func (pool *TxPool) EndAllTx() {
	pool.mutex.Lock()
	defer pool.mutex.Unlock()

	for _, tx := range pool.txMap {
		tx.Close()
	}
	pool.wg.Wait()
	for k := range pool.txMap {
		delete(pool.txMap, k)
	}
	for t := range pool.txCountMap {
		delete(pool.txCountMap, t)
	}
}
