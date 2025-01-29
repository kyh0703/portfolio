// Code generated by counterfeiter. DO NOT EDIT.
package repositoryfakes

import (
	"context"
	"sync"

	"github.com/kyh0703/flow/internal/core/domain/model"
	"github.com/kyh0703/flow/internal/core/domain/repository"
)

type FakeUserRepository struct {
	CreateOneStub        func(context.Context, model.CreateUserParams) (model.User, error)
	createOneMutex       sync.RWMutex
	createOneArgsForCall []struct {
		arg1 context.Context
		arg2 model.CreateUserParams
	}
	createOneReturns struct {
		result1 model.User
		result2 error
	}
	createOneReturnsOnCall map[int]struct {
		result1 model.User
		result2 error
	}
	DeleteOneStub        func(context.Context, int64) error
	deleteOneMutex       sync.RWMutex
	deleteOneArgsForCall []struct {
		arg1 context.Context
		arg2 int64
	}
	deleteOneReturns struct {
		result1 error
	}
	deleteOneReturnsOnCall map[int]struct {
		result1 error
	}
	FindOneStub        func(context.Context, int64) (model.User, error)
	findOneMutex       sync.RWMutex
	findOneArgsForCall []struct {
		arg1 context.Context
		arg2 int64
	}
	findOneReturns struct {
		result1 model.User
		result2 error
	}
	findOneReturnsOnCall map[int]struct {
		result1 model.User
		result2 error
	}
	FindOneByEmailStub        func(context.Context, string) (model.User, error)
	findOneByEmailMutex       sync.RWMutex
	findOneByEmailArgsForCall []struct {
		arg1 context.Context
		arg2 string
	}
	findOneByEmailReturns struct {
		result1 model.User
		result2 error
	}
	findOneByEmailReturnsOnCall map[int]struct {
		result1 model.User
		result2 error
	}
	UpdateOneStub        func(context.Context, model.UpdateUserParams) error
	updateOneMutex       sync.RWMutex
	updateOneArgsForCall []struct {
		arg1 context.Context
		arg2 model.UpdateUserParams
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

func (fake *FakeUserRepository) CreateOne(arg1 context.Context, arg2 model.CreateUserParams) (model.User, error) {
	fake.createOneMutex.Lock()
	ret, specificReturn := fake.createOneReturnsOnCall[len(fake.createOneArgsForCall)]
	fake.createOneArgsForCall = append(fake.createOneArgsForCall, struct {
		arg1 context.Context
		arg2 model.CreateUserParams
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

func (fake *FakeUserRepository) CreateOneCallCount() int {
	fake.createOneMutex.RLock()
	defer fake.createOneMutex.RUnlock()
	return len(fake.createOneArgsForCall)
}

func (fake *FakeUserRepository) CreateOneCalls(stub func(context.Context, model.CreateUserParams) (model.User, error)) {
	fake.createOneMutex.Lock()
	defer fake.createOneMutex.Unlock()
	fake.CreateOneStub = stub
}

func (fake *FakeUserRepository) CreateOneArgsForCall(i int) (context.Context, model.CreateUserParams) {
	fake.createOneMutex.RLock()
	defer fake.createOneMutex.RUnlock()
	argsForCall := fake.createOneArgsForCall[i]
	return argsForCall.arg1, argsForCall.arg2
}

func (fake *FakeUserRepository) CreateOneReturns(result1 model.User, result2 error) {
	fake.createOneMutex.Lock()
	defer fake.createOneMutex.Unlock()
	fake.CreateOneStub = nil
	fake.createOneReturns = struct {
		result1 model.User
		result2 error
	}{result1, result2}
}

func (fake *FakeUserRepository) CreateOneReturnsOnCall(i int, result1 model.User, result2 error) {
	fake.createOneMutex.Lock()
	defer fake.createOneMutex.Unlock()
	fake.CreateOneStub = nil
	if fake.createOneReturnsOnCall == nil {
		fake.createOneReturnsOnCall = make(map[int]struct {
			result1 model.User
			result2 error
		})
	}
	fake.createOneReturnsOnCall[i] = struct {
		result1 model.User
		result2 error
	}{result1, result2}
}

func (fake *FakeUserRepository) DeleteOne(arg1 context.Context, arg2 int64) error {
	fake.deleteOneMutex.Lock()
	ret, specificReturn := fake.deleteOneReturnsOnCall[len(fake.deleteOneArgsForCall)]
	fake.deleteOneArgsForCall = append(fake.deleteOneArgsForCall, struct {
		arg1 context.Context
		arg2 int64
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

func (fake *FakeUserRepository) DeleteOneCallCount() int {
	fake.deleteOneMutex.RLock()
	defer fake.deleteOneMutex.RUnlock()
	return len(fake.deleteOneArgsForCall)
}

func (fake *FakeUserRepository) DeleteOneCalls(stub func(context.Context, int64) error) {
	fake.deleteOneMutex.Lock()
	defer fake.deleteOneMutex.Unlock()
	fake.DeleteOneStub = stub
}

func (fake *FakeUserRepository) DeleteOneArgsForCall(i int) (context.Context, int64) {
	fake.deleteOneMutex.RLock()
	defer fake.deleteOneMutex.RUnlock()
	argsForCall := fake.deleteOneArgsForCall[i]
	return argsForCall.arg1, argsForCall.arg2
}

func (fake *FakeUserRepository) DeleteOneReturns(result1 error) {
	fake.deleteOneMutex.Lock()
	defer fake.deleteOneMutex.Unlock()
	fake.DeleteOneStub = nil
	fake.deleteOneReturns = struct {
		result1 error
	}{result1}
}

func (fake *FakeUserRepository) DeleteOneReturnsOnCall(i int, result1 error) {
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

func (fake *FakeUserRepository) FindOne(arg1 context.Context, arg2 int64) (model.User, error) {
	fake.findOneMutex.Lock()
	ret, specificReturn := fake.findOneReturnsOnCall[len(fake.findOneArgsForCall)]
	fake.findOneArgsForCall = append(fake.findOneArgsForCall, struct {
		arg1 context.Context
		arg2 int64
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

func (fake *FakeUserRepository) FindOneCallCount() int {
	fake.findOneMutex.RLock()
	defer fake.findOneMutex.RUnlock()
	return len(fake.findOneArgsForCall)
}

func (fake *FakeUserRepository) FindOneCalls(stub func(context.Context, int64) (model.User, error)) {
	fake.findOneMutex.Lock()
	defer fake.findOneMutex.Unlock()
	fake.FindOneStub = stub
}

func (fake *FakeUserRepository) FindOneArgsForCall(i int) (context.Context, int64) {
	fake.findOneMutex.RLock()
	defer fake.findOneMutex.RUnlock()
	argsForCall := fake.findOneArgsForCall[i]
	return argsForCall.arg1, argsForCall.arg2
}

func (fake *FakeUserRepository) FindOneReturns(result1 model.User, result2 error) {
	fake.findOneMutex.Lock()
	defer fake.findOneMutex.Unlock()
	fake.FindOneStub = nil
	fake.findOneReturns = struct {
		result1 model.User
		result2 error
	}{result1, result2}
}

func (fake *FakeUserRepository) FindOneReturnsOnCall(i int, result1 model.User, result2 error) {
	fake.findOneMutex.Lock()
	defer fake.findOneMutex.Unlock()
	fake.FindOneStub = nil
	if fake.findOneReturnsOnCall == nil {
		fake.findOneReturnsOnCall = make(map[int]struct {
			result1 model.User
			result2 error
		})
	}
	fake.findOneReturnsOnCall[i] = struct {
		result1 model.User
		result2 error
	}{result1, result2}
}

func (fake *FakeUserRepository) FindOneByEmail(arg1 context.Context, arg2 string) (model.User, error) {
	fake.findOneByEmailMutex.Lock()
	ret, specificReturn := fake.findOneByEmailReturnsOnCall[len(fake.findOneByEmailArgsForCall)]
	fake.findOneByEmailArgsForCall = append(fake.findOneByEmailArgsForCall, struct {
		arg1 context.Context
		arg2 string
	}{arg1, arg2})
	stub := fake.FindOneByEmailStub
	fakeReturns := fake.findOneByEmailReturns
	fake.recordInvocation("FindOneByEmail", []interface{}{arg1, arg2})
	fake.findOneByEmailMutex.Unlock()
	if stub != nil {
		return stub(arg1, arg2)
	}
	if specificReturn {
		return ret.result1, ret.result2
	}
	return fakeReturns.result1, fakeReturns.result2
}

func (fake *FakeUserRepository) FindOneByEmailCallCount() int {
	fake.findOneByEmailMutex.RLock()
	defer fake.findOneByEmailMutex.RUnlock()
	return len(fake.findOneByEmailArgsForCall)
}

func (fake *FakeUserRepository) FindOneByEmailCalls(stub func(context.Context, string) (model.User, error)) {
	fake.findOneByEmailMutex.Lock()
	defer fake.findOneByEmailMutex.Unlock()
	fake.FindOneByEmailStub = stub
}

func (fake *FakeUserRepository) FindOneByEmailArgsForCall(i int) (context.Context, string) {
	fake.findOneByEmailMutex.RLock()
	defer fake.findOneByEmailMutex.RUnlock()
	argsForCall := fake.findOneByEmailArgsForCall[i]
	return argsForCall.arg1, argsForCall.arg2
}

func (fake *FakeUserRepository) FindOneByEmailReturns(result1 model.User, result2 error) {
	fake.findOneByEmailMutex.Lock()
	defer fake.findOneByEmailMutex.Unlock()
	fake.FindOneByEmailStub = nil
	fake.findOneByEmailReturns = struct {
		result1 model.User
		result2 error
	}{result1, result2}
}

func (fake *FakeUserRepository) FindOneByEmailReturnsOnCall(i int, result1 model.User, result2 error) {
	fake.findOneByEmailMutex.Lock()
	defer fake.findOneByEmailMutex.Unlock()
	fake.FindOneByEmailStub = nil
	if fake.findOneByEmailReturnsOnCall == nil {
		fake.findOneByEmailReturnsOnCall = make(map[int]struct {
			result1 model.User
			result2 error
		})
	}
	fake.findOneByEmailReturnsOnCall[i] = struct {
		result1 model.User
		result2 error
	}{result1, result2}
}

func (fake *FakeUserRepository) UpdateOne(arg1 context.Context, arg2 model.UpdateUserParams) error {
	fake.updateOneMutex.Lock()
	ret, specificReturn := fake.updateOneReturnsOnCall[len(fake.updateOneArgsForCall)]
	fake.updateOneArgsForCall = append(fake.updateOneArgsForCall, struct {
		arg1 context.Context
		arg2 model.UpdateUserParams
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

func (fake *FakeUserRepository) UpdateOneCallCount() int {
	fake.updateOneMutex.RLock()
	defer fake.updateOneMutex.RUnlock()
	return len(fake.updateOneArgsForCall)
}

func (fake *FakeUserRepository) UpdateOneCalls(stub func(context.Context, model.UpdateUserParams) error) {
	fake.updateOneMutex.Lock()
	defer fake.updateOneMutex.Unlock()
	fake.UpdateOneStub = stub
}

func (fake *FakeUserRepository) UpdateOneArgsForCall(i int) (context.Context, model.UpdateUserParams) {
	fake.updateOneMutex.RLock()
	defer fake.updateOneMutex.RUnlock()
	argsForCall := fake.updateOneArgsForCall[i]
	return argsForCall.arg1, argsForCall.arg2
}

func (fake *FakeUserRepository) UpdateOneReturns(result1 error) {
	fake.updateOneMutex.Lock()
	defer fake.updateOneMutex.Unlock()
	fake.UpdateOneStub = nil
	fake.updateOneReturns = struct {
		result1 error
	}{result1}
}

func (fake *FakeUserRepository) UpdateOneReturnsOnCall(i int, result1 error) {
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

func (fake *FakeUserRepository) Invocations() map[string][][]interface{} {
	fake.invocationsMutex.RLock()
	defer fake.invocationsMutex.RUnlock()
	fake.createOneMutex.RLock()
	defer fake.createOneMutex.RUnlock()
	fake.deleteOneMutex.RLock()
	defer fake.deleteOneMutex.RUnlock()
	fake.findOneMutex.RLock()
	defer fake.findOneMutex.RUnlock()
	fake.findOneByEmailMutex.RLock()
	defer fake.findOneByEmailMutex.RUnlock()
	fake.updateOneMutex.RLock()
	defer fake.updateOneMutex.RUnlock()
	copiedInvocations := map[string][][]interface{}{}
	for key, value := range fake.invocations {
		copiedInvocations[key] = value
	}
	return copiedInvocations
}

func (fake *FakeUserRepository) recordInvocation(key string, args []interface{}) {
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

var _ repository.UserRepository = new(FakeUserRepository)
