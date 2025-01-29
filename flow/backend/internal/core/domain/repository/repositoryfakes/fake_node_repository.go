// Code generated by counterfeiter. DO NOT EDIT.
package repositoryfakes

import (
	"context"
	"sync"

	"github.com/kyh0703/flow/internal/core/domain/model"
	"github.com/kyh0703/flow/internal/core/domain/repository"
)

type FakeNodeRepository struct {
	CreateOneStub        func(context.Context, model.CreateNodeParams) (model.Node, error)
	createOneMutex       sync.RWMutex
	createOneArgsForCall []struct {
		arg1 context.Context
		arg2 model.CreateNodeParams
	}
	createOneReturns struct {
		result1 model.Node
		result2 error
	}
	createOneReturnsOnCall map[int]struct {
		result1 model.Node
		result2 error
	}
	DeleteOneStub        func(context.Context, string) error
	deleteOneMutex       sync.RWMutex
	deleteOneArgsForCall []struct {
		arg1 context.Context
		arg2 string
	}
	deleteOneReturns struct {
		result1 error
	}
	deleteOneReturnsOnCall map[int]struct {
		result1 error
	}
	FindOneStub        func(context.Context, string) (model.Node, error)
	findOneMutex       sync.RWMutex
	findOneArgsForCall []struct {
		arg1 context.Context
		arg2 string
	}
	findOneReturns struct {
		result1 model.Node
		result2 error
	}
	findOneReturnsOnCall map[int]struct {
		result1 model.Node
		result2 error
	}
	GetListStub        func(context.Context, int64) ([]model.Node, error)
	getListMutex       sync.RWMutex
	getListArgsForCall []struct {
		arg1 context.Context
		arg2 int64
	}
	getListReturns struct {
		result1 []model.Node
		result2 error
	}
	getListReturnsOnCall map[int]struct {
		result1 []model.Node
		result2 error
	}
	UpdateOneStub        func(context.Context, model.UpdateNodeParams) error
	updateOneMutex       sync.RWMutex
	updateOneArgsForCall []struct {
		arg1 context.Context
		arg2 model.UpdateNodeParams
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

func (fake *FakeNodeRepository) CreateOne(arg1 context.Context, arg2 model.CreateNodeParams) (model.Node, error) {
	fake.createOneMutex.Lock()
	ret, specificReturn := fake.createOneReturnsOnCall[len(fake.createOneArgsForCall)]
	fake.createOneArgsForCall = append(fake.createOneArgsForCall, struct {
		arg1 context.Context
		arg2 model.CreateNodeParams
	}{arg1, arg2})
	stub := fake.CreateOneStub
	fakeReturns := fake.createOneReturns
	fake.recordInvocation("CreateOne", []interface{}{arg1, arg2})
	fake.createOneMutex.Unlock()
	if stub != nil {
		return stub(arg1, arg2)
	}
	if specificReturn {
		return ret.result1, ret.result2
	}
	return fakeReturns.result1, fakeReturns.result2
}

func (fake *FakeNodeRepository) CreateOneCallCount() int {
	fake.createOneMutex.RLock()
	defer fake.createOneMutex.RUnlock()
	return len(fake.createOneArgsForCall)
}

func (fake *FakeNodeRepository) CreateOneCalls(stub func(context.Context, model.CreateNodeParams) (model.Node, error)) {
	fake.createOneMutex.Lock()
	defer fake.createOneMutex.Unlock()
	fake.CreateOneStub = stub
}

func (fake *FakeNodeRepository) CreateOneArgsForCall(i int) (context.Context, model.CreateNodeParams) {
	fake.createOneMutex.RLock()
	defer fake.createOneMutex.RUnlock()
	argsForCall := fake.createOneArgsForCall[i]
	return argsForCall.arg1, argsForCall.arg2
}

func (fake *FakeNodeRepository) CreateOneReturns(result1 model.Node, result2 error) {
	fake.createOneMutex.Lock()
	defer fake.createOneMutex.Unlock()
	fake.CreateOneStub = nil
	fake.createOneReturns = struct {
		result1 model.Node
		result2 error
	}{result1, result2}
}

func (fake *FakeNodeRepository) CreateOneReturnsOnCall(i int, result1 model.Node, result2 error) {
	fake.createOneMutex.Lock()
	defer fake.createOneMutex.Unlock()
	fake.CreateOneStub = nil
	if fake.createOneReturnsOnCall == nil {
		fake.createOneReturnsOnCall = make(map[int]struct {
			result1 model.Node
			result2 error
		})
	}
	fake.createOneReturnsOnCall[i] = struct {
		result1 model.Node
		result2 error
	}{result1, result2}
}

func (fake *FakeNodeRepository) DeleteOne(arg1 context.Context, arg2 string) error {
	fake.deleteOneMutex.Lock()
	ret, specificReturn := fake.deleteOneReturnsOnCall[len(fake.deleteOneArgsForCall)]
	fake.deleteOneArgsForCall = append(fake.deleteOneArgsForCall, struct {
		arg1 context.Context
		arg2 string
	}{arg1, arg2})
	stub := fake.DeleteOneStub
	fakeReturns := fake.deleteOneReturns
	fake.recordInvocation("DeleteOne", []interface{}{arg1, arg2})
	fake.deleteOneMutex.Unlock()
	if stub != nil {
		return stub(arg1, arg2)
	}
	if specificReturn {
		return ret.result1
	}
	return fakeReturns.result1
}

func (fake *FakeNodeRepository) DeleteOneCallCount() int {
	fake.deleteOneMutex.RLock()
	defer fake.deleteOneMutex.RUnlock()
	return len(fake.deleteOneArgsForCall)
}

func (fake *FakeNodeRepository) DeleteOneCalls(stub func(context.Context, string) error) {
	fake.deleteOneMutex.Lock()
	defer fake.deleteOneMutex.Unlock()
	fake.DeleteOneStub = stub
}

func (fake *FakeNodeRepository) DeleteOneArgsForCall(i int) (context.Context, string) {
	fake.deleteOneMutex.RLock()
	defer fake.deleteOneMutex.RUnlock()
	argsForCall := fake.deleteOneArgsForCall[i]
	return argsForCall.arg1, argsForCall.arg2
}

func (fake *FakeNodeRepository) DeleteOneReturns(result1 error) {
	fake.deleteOneMutex.Lock()
	defer fake.deleteOneMutex.Unlock()
	fake.DeleteOneStub = nil
	fake.deleteOneReturns = struct {
		result1 error
	}{result1}
}

func (fake *FakeNodeRepository) DeleteOneReturnsOnCall(i int, result1 error) {
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

func (fake *FakeNodeRepository) FindOne(arg1 context.Context, arg2 string) (model.Node, error) {
	fake.findOneMutex.Lock()
	ret, specificReturn := fake.findOneReturnsOnCall[len(fake.findOneArgsForCall)]
	fake.findOneArgsForCall = append(fake.findOneArgsForCall, struct {
		arg1 context.Context
		arg2 string
	}{arg1, arg2})
	stub := fake.FindOneStub
	fakeReturns := fake.findOneReturns
	fake.recordInvocation("FindOne", []interface{}{arg1, arg2})
	fake.findOneMutex.Unlock()
	if stub != nil {
		return stub(arg1, arg2)
	}
	if specificReturn {
		return ret.result1, ret.result2
	}
	return fakeReturns.result1, fakeReturns.result2
}

func (fake *FakeNodeRepository) FindOneCallCount() int {
	fake.findOneMutex.RLock()
	defer fake.findOneMutex.RUnlock()
	return len(fake.findOneArgsForCall)
}

func (fake *FakeNodeRepository) FindOneCalls(stub func(context.Context, string) (model.Node, error)) {
	fake.findOneMutex.Lock()
	defer fake.findOneMutex.Unlock()
	fake.FindOneStub = stub
}

func (fake *FakeNodeRepository) FindOneArgsForCall(i int) (context.Context, string) {
	fake.findOneMutex.RLock()
	defer fake.findOneMutex.RUnlock()
	argsForCall := fake.findOneArgsForCall[i]
	return argsForCall.arg1, argsForCall.arg2
}

func (fake *FakeNodeRepository) FindOneReturns(result1 model.Node, result2 error) {
	fake.findOneMutex.Lock()
	defer fake.findOneMutex.Unlock()
	fake.FindOneStub = nil
	fake.findOneReturns = struct {
		result1 model.Node
		result2 error
	}{result1, result2}
}

func (fake *FakeNodeRepository) FindOneReturnsOnCall(i int, result1 model.Node, result2 error) {
	fake.findOneMutex.Lock()
	defer fake.findOneMutex.Unlock()
	fake.FindOneStub = nil
	if fake.findOneReturnsOnCall == nil {
		fake.findOneReturnsOnCall = make(map[int]struct {
			result1 model.Node
			result2 error
		})
	}
	fake.findOneReturnsOnCall[i] = struct {
		result1 model.Node
		result2 error
	}{result1, result2}
}

func (fake *FakeNodeRepository) GetList(arg1 context.Context, arg2 int64) ([]model.Node, error) {
	fake.getListMutex.Lock()
	ret, specificReturn := fake.getListReturnsOnCall[len(fake.getListArgsForCall)]
	fake.getListArgsForCall = append(fake.getListArgsForCall, struct {
		arg1 context.Context
		arg2 int64
	}{arg1, arg2})
	stub := fake.GetListStub
	fakeReturns := fake.getListReturns
	fake.recordInvocation("GetList", []interface{}{arg1, arg2})
	fake.getListMutex.Unlock()
	if stub != nil {
		return stub(arg1, arg2)
	}
	if specificReturn {
		return ret.result1, ret.result2
	}
	return fakeReturns.result1, fakeReturns.result2
}

func (fake *FakeNodeRepository) GetListCallCount() int {
	fake.getListMutex.RLock()
	defer fake.getListMutex.RUnlock()
	return len(fake.getListArgsForCall)
}

func (fake *FakeNodeRepository) GetListCalls(stub func(context.Context, int64) ([]model.Node, error)) {
	fake.getListMutex.Lock()
	defer fake.getListMutex.Unlock()
	fake.GetListStub = stub
}

func (fake *FakeNodeRepository) GetListArgsForCall(i int) (context.Context, int64) {
	fake.getListMutex.RLock()
	defer fake.getListMutex.RUnlock()
	argsForCall := fake.getListArgsForCall[i]
	return argsForCall.arg1, argsForCall.arg2
}

func (fake *FakeNodeRepository) GetListReturns(result1 []model.Node, result2 error) {
	fake.getListMutex.Lock()
	defer fake.getListMutex.Unlock()
	fake.GetListStub = nil
	fake.getListReturns = struct {
		result1 []model.Node
		result2 error
	}{result1, result2}
}

func (fake *FakeNodeRepository) GetListReturnsOnCall(i int, result1 []model.Node, result2 error) {
	fake.getListMutex.Lock()
	defer fake.getListMutex.Unlock()
	fake.GetListStub = nil
	if fake.getListReturnsOnCall == nil {
		fake.getListReturnsOnCall = make(map[int]struct {
			result1 []model.Node
			result2 error
		})
	}
	fake.getListReturnsOnCall[i] = struct {
		result1 []model.Node
		result2 error
	}{result1, result2}
}

func (fake *FakeNodeRepository) UpdateOne(arg1 context.Context, arg2 model.UpdateNodeParams) error {
	fake.updateOneMutex.Lock()
	ret, specificReturn := fake.updateOneReturnsOnCall[len(fake.updateOneArgsForCall)]
	fake.updateOneArgsForCall = append(fake.updateOneArgsForCall, struct {
		arg1 context.Context
		arg2 model.UpdateNodeParams
	}{arg1, arg2})
	stub := fake.UpdateOneStub
	fakeReturns := fake.updateOneReturns
	fake.recordInvocation("UpdateOne", []interface{}{arg1, arg2})
	fake.updateOneMutex.Unlock()
	if stub != nil {
		return stub(arg1, arg2)
	}
	if specificReturn {
		return ret.result1
	}
	return fakeReturns.result1
}

func (fake *FakeNodeRepository) UpdateOneCallCount() int {
	fake.updateOneMutex.RLock()
	defer fake.updateOneMutex.RUnlock()
	return len(fake.updateOneArgsForCall)
}

func (fake *FakeNodeRepository) UpdateOneCalls(stub func(context.Context, model.UpdateNodeParams) error) {
	fake.updateOneMutex.Lock()
	defer fake.updateOneMutex.Unlock()
	fake.UpdateOneStub = stub
}

func (fake *FakeNodeRepository) UpdateOneArgsForCall(i int) (context.Context, model.UpdateNodeParams) {
	fake.updateOneMutex.RLock()
	defer fake.updateOneMutex.RUnlock()
	argsForCall := fake.updateOneArgsForCall[i]
	return argsForCall.arg1, argsForCall.arg2
}

func (fake *FakeNodeRepository) UpdateOneReturns(result1 error) {
	fake.updateOneMutex.Lock()
	defer fake.updateOneMutex.Unlock()
	fake.UpdateOneStub = nil
	fake.updateOneReturns = struct {
		result1 error
	}{result1}
}

func (fake *FakeNodeRepository) UpdateOneReturnsOnCall(i int, result1 error) {
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

func (fake *FakeNodeRepository) Invocations() map[string][][]interface{} {
	fake.invocationsMutex.RLock()
	defer fake.invocationsMutex.RUnlock()
	fake.createOneMutex.RLock()
	defer fake.createOneMutex.RUnlock()
	fake.deleteOneMutex.RLock()
	defer fake.deleteOneMutex.RUnlock()
	fake.findOneMutex.RLock()
	defer fake.findOneMutex.RUnlock()
	fake.getListMutex.RLock()
	defer fake.getListMutex.RUnlock()
	fake.updateOneMutex.RLock()
	defer fake.updateOneMutex.RUnlock()
	copiedInvocations := map[string][][]interface{}{}
	for key, value := range fake.invocations {
		copiedInvocations[key] = value
	}
	return copiedInvocations
}

func (fake *FakeNodeRepository) recordInvocation(key string, args []interface{}) {
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

var _ repository.NodeRepository = new(FakeNodeRepository)
