// Code generated by counterfeiter. DO NOT EDIT.
package handlerfakes

import (
	"sync"

	fiber "github.com/gofiber/fiber/v2"
	"github.com/kyh0703/flow/internal/core/handler"
)

type FakeEdgeHandler struct {
	CreateOneStub        func(*fiber.Ctx) error
	createOneMutex       sync.RWMutex
	createOneArgsForCall []struct {
		arg1 *fiber.Ctx
	}
	createOneReturns struct {
		result1 error
	}
	createOneReturnsOnCall map[int]struct {
		result1 error
	}
	DeleteOneStub        func(*fiber.Ctx) error
	deleteOneMutex       sync.RWMutex
	deleteOneArgsForCall []struct {
		arg1 *fiber.Ctx
	}
	deleteOneReturns struct {
		result1 error
	}
	deleteOneReturnsOnCall map[int]struct {
		result1 error
	}
	GetOneStub        func(*fiber.Ctx) error
	getOneMutex       sync.RWMutex
	getOneArgsForCall []struct {
		arg1 *fiber.Ctx
	}
	getOneReturns struct {
		result1 error
	}
	getOneReturnsOnCall map[int]struct {
		result1 error
	}
	TableStub        func() []handler.Mapper
	tableMutex       sync.RWMutex
	tableArgsForCall []struct {
	}
	tableReturns struct {
		result1 []handler.Mapper
	}
	tableReturnsOnCall map[int]struct {
		result1 []handler.Mapper
	}
	UpdateOneStub        func(*fiber.Ctx) error
	updateOneMutex       sync.RWMutex
	updateOneArgsForCall []struct {
		arg1 *fiber.Ctx
	}
	updateOneReturns struct {
		result1 error
	}
	updateOneReturnsOnCall map[int]struct {
		result1 error
	}
	invocations      map[string][][]interface{}
	invocationsMutex sync.RWMutex
}

func (fake *FakeEdgeHandler) CreateOne(arg1 *fiber.Ctx) error {
	fake.createOneMutex.Lock()
	ret, specificReturn := fake.createOneReturnsOnCall[len(fake.createOneArgsForCall)]
	fake.createOneArgsForCall = append(fake.createOneArgsForCall, struct {
		arg1 *fiber.Ctx
	}{arg1})
	stub := fake.CreateOneStub
	fakeReturns := fake.createOneReturns
	fake.recordInvocation("CreateOne", []interface{}{arg1})
	fake.createOneMutex.Unlock()
	if stub != nil {
		return stub(arg1)
	}
	if specificReturn {
		return ret.result1
	}
	return fakeReturns.result1
}

func (fake *FakeEdgeHandler) CreateOneCallCount() int {
	fake.createOneMutex.RLock()
	defer fake.createOneMutex.RUnlock()
	return len(fake.createOneArgsForCall)
}

func (fake *FakeEdgeHandler) CreateOneCalls(stub func(*fiber.Ctx) error) {
	fake.createOneMutex.Lock()
	defer fake.createOneMutex.Unlock()
	fake.CreateOneStub = stub
}

func (fake *FakeEdgeHandler) CreateOneArgsForCall(i int) *fiber.Ctx {
	fake.createOneMutex.RLock()
	defer fake.createOneMutex.RUnlock()
	argsForCall := fake.createOneArgsForCall[i]
	return argsForCall.arg1
}

func (fake *FakeEdgeHandler) CreateOneReturns(result1 error) {
	fake.createOneMutex.Lock()
	defer fake.createOneMutex.Unlock()
	fake.CreateOneStub = nil
	fake.createOneReturns = struct {
		result1 error
	}{result1}
}

func (fake *FakeEdgeHandler) CreateOneReturnsOnCall(i int, result1 error) {
	fake.createOneMutex.Lock()
	defer fake.createOneMutex.Unlock()
	fake.CreateOneStub = nil
	if fake.createOneReturnsOnCall == nil {
		fake.createOneReturnsOnCall = make(map[int]struct {
			result1 error
		})
	}
	fake.createOneReturnsOnCall[i] = struct {
		result1 error
	}{result1}
}

func (fake *FakeEdgeHandler) DeleteOne(arg1 *fiber.Ctx) error {
	fake.deleteOneMutex.Lock()
	ret, specificReturn := fake.deleteOneReturnsOnCall[len(fake.deleteOneArgsForCall)]
	fake.deleteOneArgsForCall = append(fake.deleteOneArgsForCall, struct {
		arg1 *fiber.Ctx
	}{arg1})
	stub := fake.DeleteOneStub
	fakeReturns := fake.deleteOneReturns
	fake.recordInvocation("DeleteOne", []interface{}{arg1})
	fake.deleteOneMutex.Unlock()
	if stub != nil {
		return stub(arg1)
	}
	if specificReturn {
		return ret.result1
	}
	return fakeReturns.result1
}

func (fake *FakeEdgeHandler) DeleteOneCallCount() int {
	fake.deleteOneMutex.RLock()
	defer fake.deleteOneMutex.RUnlock()
	return len(fake.deleteOneArgsForCall)
}

func (fake *FakeEdgeHandler) DeleteOneCalls(stub func(*fiber.Ctx) error) {
	fake.deleteOneMutex.Lock()
	defer fake.deleteOneMutex.Unlock()
	fake.DeleteOneStub = stub
}

func (fake *FakeEdgeHandler) DeleteOneArgsForCall(i int) *fiber.Ctx {
	fake.deleteOneMutex.RLock()
	defer fake.deleteOneMutex.RUnlock()
	argsForCall := fake.deleteOneArgsForCall[i]
	return argsForCall.arg1
}

func (fake *FakeEdgeHandler) DeleteOneReturns(result1 error) {
	fake.deleteOneMutex.Lock()
	defer fake.deleteOneMutex.Unlock()
	fake.DeleteOneStub = nil
	fake.deleteOneReturns = struct {
		result1 error
	}{result1}
}

func (fake *FakeEdgeHandler) DeleteOneReturnsOnCall(i int, result1 error) {
	fake.deleteOneMutex.Lock()
	defer fake.deleteOneMutex.Unlock()
	fake.DeleteOneStub = nil
	if fake.deleteOneReturnsOnCall == nil {
		fake.deleteOneReturnsOnCall = make(map[int]struct {
			result1 error
		})
	}
	fake.deleteOneReturnsOnCall[i] = struct {
		result1 error
	}{result1}
}

func (fake *FakeEdgeHandler) GetOne(arg1 *fiber.Ctx) error {
	fake.getOneMutex.Lock()
	ret, specificReturn := fake.getOneReturnsOnCall[len(fake.getOneArgsForCall)]
	fake.getOneArgsForCall = append(fake.getOneArgsForCall, struct {
		arg1 *fiber.Ctx
	}{arg1})
	stub := fake.GetOneStub
	fakeReturns := fake.getOneReturns
	fake.recordInvocation("GetOne", []interface{}{arg1})
	fake.getOneMutex.Unlock()
	if stub != nil {
		return stub(arg1)
	}
	if specificReturn {
		return ret.result1
	}
	return fakeReturns.result1
}

func (fake *FakeEdgeHandler) GetOneCallCount() int {
	fake.getOneMutex.RLock()
	defer fake.getOneMutex.RUnlock()
	return len(fake.getOneArgsForCall)
}

func (fake *FakeEdgeHandler) GetOneCalls(stub func(*fiber.Ctx) error) {
	fake.getOneMutex.Lock()
	defer fake.getOneMutex.Unlock()
	fake.GetOneStub = stub
}

func (fake *FakeEdgeHandler) GetOneArgsForCall(i int) *fiber.Ctx {
	fake.getOneMutex.RLock()
	defer fake.getOneMutex.RUnlock()
	argsForCall := fake.getOneArgsForCall[i]
	return argsForCall.arg1
}

func (fake *FakeEdgeHandler) GetOneReturns(result1 error) {
	fake.getOneMutex.Lock()
	defer fake.getOneMutex.Unlock()
	fake.GetOneStub = nil
	fake.getOneReturns = struct {
		result1 error
	}{result1}
}

func (fake *FakeEdgeHandler) GetOneReturnsOnCall(i int, result1 error) {
	fake.getOneMutex.Lock()
	defer fake.getOneMutex.Unlock()
	fake.GetOneStub = nil
	if fake.getOneReturnsOnCall == nil {
		fake.getOneReturnsOnCall = make(map[int]struct {
			result1 error
		})
	}
	fake.getOneReturnsOnCall[i] = struct {
		result1 error
	}{result1}
}

func (fake *FakeEdgeHandler) Table() []handler.Mapper {
	fake.tableMutex.Lock()
	ret, specificReturn := fake.tableReturnsOnCall[len(fake.tableArgsForCall)]
	fake.tableArgsForCall = append(fake.tableArgsForCall, struct {
	}{})
	stub := fake.TableStub
	fakeReturns := fake.tableReturns
	fake.recordInvocation("Table", []interface{}{})
	fake.tableMutex.Unlock()
	if stub != nil {
		return stub()
	}
	if specificReturn {
		return ret.result1
	}
	return fakeReturns.result1
}

func (fake *FakeEdgeHandler) TableCallCount() int {
	fake.tableMutex.RLock()
	defer fake.tableMutex.RUnlock()
	return len(fake.tableArgsForCall)
}

func (fake *FakeEdgeHandler) TableCalls(stub func() []handler.Mapper) {
	fake.tableMutex.Lock()
	defer fake.tableMutex.Unlock()
	fake.TableStub = stub
}

func (fake *FakeEdgeHandler) TableReturns(result1 []handler.Mapper) {
	fake.tableMutex.Lock()
	defer fake.tableMutex.Unlock()
	fake.TableStub = nil
	fake.tableReturns = struct {
		result1 []handler.Mapper
	}{result1}
}

func (fake *FakeEdgeHandler) TableReturnsOnCall(i int, result1 []handler.Mapper) {
	fake.tableMutex.Lock()
	defer fake.tableMutex.Unlock()
	fake.TableStub = nil
	if fake.tableReturnsOnCall == nil {
		fake.tableReturnsOnCall = make(map[int]struct {
			result1 []handler.Mapper
		})
	}
	fake.tableReturnsOnCall[i] = struct {
		result1 []handler.Mapper
	}{result1}
}

func (fake *FakeEdgeHandler) UpdateOne(arg1 *fiber.Ctx) error {
	fake.updateOneMutex.Lock()
	ret, specificReturn := fake.updateOneReturnsOnCall[len(fake.updateOneArgsForCall)]
	fake.updateOneArgsForCall = append(fake.updateOneArgsForCall, struct {
		arg1 *fiber.Ctx
	}{arg1})
	stub := fake.UpdateOneStub
	fakeReturns := fake.updateOneReturns
	fake.recordInvocation("UpdateOne", []interface{}{arg1})
	fake.updateOneMutex.Unlock()
	if stub != nil {
		return stub(arg1)
	}
	if specificReturn {
		return ret.result1
	}
	return fakeReturns.result1
}

func (fake *FakeEdgeHandler) UpdateOneCallCount() int {
	fake.updateOneMutex.RLock()
	defer fake.updateOneMutex.RUnlock()
	return len(fake.updateOneArgsForCall)
}

func (fake *FakeEdgeHandler) UpdateOneCalls(stub func(*fiber.Ctx) error) {
	fake.updateOneMutex.Lock()
	defer fake.updateOneMutex.Unlock()
	fake.UpdateOneStub = stub
}

func (fake *FakeEdgeHandler) UpdateOneArgsForCall(i int) *fiber.Ctx {
	fake.updateOneMutex.RLock()
	defer fake.updateOneMutex.RUnlock()
	argsForCall := fake.updateOneArgsForCall[i]
	return argsForCall.arg1
}

func (fake *FakeEdgeHandler) UpdateOneReturns(result1 error) {
	fake.updateOneMutex.Lock()
	defer fake.updateOneMutex.Unlock()
	fake.UpdateOneStub = nil
	fake.updateOneReturns = struct {
		result1 error
	}{result1}
}

func (fake *FakeEdgeHandler) UpdateOneReturnsOnCall(i int, result1 error) {
	fake.updateOneMutex.Lock()
	defer fake.updateOneMutex.Unlock()
	fake.UpdateOneStub = nil
	if fake.updateOneReturnsOnCall == nil {
		fake.updateOneReturnsOnCall = make(map[int]struct {
			result1 error
		})
	}
	fake.updateOneReturnsOnCall[i] = struct {
		result1 error
	}{result1}
}

func (fake *FakeEdgeHandler) Invocations() map[string][][]interface{} {
	fake.invocationsMutex.RLock()
	defer fake.invocationsMutex.RUnlock()
	fake.createOneMutex.RLock()
	defer fake.createOneMutex.RUnlock()
	fake.deleteOneMutex.RLock()
	defer fake.deleteOneMutex.RUnlock()
	fake.getOneMutex.RLock()
	defer fake.getOneMutex.RUnlock()
	fake.tableMutex.RLock()
	defer fake.tableMutex.RUnlock()
	fake.updateOneMutex.RLock()
	defer fake.updateOneMutex.RUnlock()
	copiedInvocations := map[string][][]interface{}{}
	for key, value := range fake.invocations {
		copiedInvocations[key] = value
	}
	return copiedInvocations
}

func (fake *FakeEdgeHandler) recordInvocation(key string, args []interface{}) {
	fake.invocationsMutex.Lock()
	defer fake.invocationsMutex.Unlock()
	if fake.invocations == nil {
		fake.invocations = map[string][][]interface{}{}
	}
	if fake.invocations[key] == nil {
		fake.invocations[key] = [][]interface{}{}
	}
	fake.invocations[key] = append(fake.invocations[key], args)
}

var _ handler.EdgeHandler = new(FakeEdgeHandler)
