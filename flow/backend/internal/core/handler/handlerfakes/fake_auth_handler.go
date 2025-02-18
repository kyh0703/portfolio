// Code generated by counterfeiter. DO NOT EDIT.
package handlerfakes

import (
	"sync"

	fiber "github.com/gofiber/fiber/v2"
	"github.com/kyh0703/flow/internal/core/handler"
)

type FakeAuthHandler struct {
	RefreshStub        func(*fiber.Ctx) error
	refreshMutex       sync.RWMutex
	refreshArgsForCall []struct {
		arg1 *fiber.Ctx
	}
	refreshReturns struct {
		result1 error
	}
	refreshReturnsOnCall map[int]struct {
		result1 error
	}
	SignInStub        func(*fiber.Ctx) error
	signInMutex       sync.RWMutex
	signInArgsForCall []struct {
		arg1 *fiber.Ctx
	}
	signInReturns struct {
		result1 error
	}
	signInReturnsOnCall map[int]struct {
		result1 error
	}
	SignOutStub        func(*fiber.Ctx) error
	signOutMutex       sync.RWMutex
	signOutArgsForCall []struct {
		arg1 *fiber.Ctx
	}
	signOutReturns struct {
		result1 error
	}
	signOutReturnsOnCall map[int]struct {
		result1 error
	}
	SignUpStub        func(*fiber.Ctx) error
	signUpMutex       sync.RWMutex
	signUpArgsForCall []struct {
		arg1 *fiber.Ctx
	}
	signUpReturns struct {
		result1 error
	}
	signUpReturnsOnCall map[int]struct {
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
	invocations      map[string][][]interface{}
	invocationsMutex sync.RWMutex
}

func (fake *FakeAuthHandler) Refresh(arg1 *fiber.Ctx) error {
	fake.refreshMutex.Lock()
	ret, specificReturn := fake.refreshReturnsOnCall[len(fake.refreshArgsForCall)]
	fake.refreshArgsForCall = append(fake.refreshArgsForCall, struct {
		arg1 *fiber.Ctx
	}{arg1})
	stub := fake.RefreshStub
	fakeReturns := fake.refreshReturns
	fake.recordInvocation("Refresh", []interface{}{arg1})
	fake.refreshMutex.Unlock()
	if stub != nil {
		return stub(arg1)
	}
	if specificReturn {
		return ret.result1
	}
	return fakeReturns.result1
}

func (fake *FakeAuthHandler) RefreshCallCount() int {
	fake.refreshMutex.RLock()
	defer fake.refreshMutex.RUnlock()
	return len(fake.refreshArgsForCall)
}

func (fake *FakeAuthHandler) RefreshCalls(stub func(*fiber.Ctx) error) {
	fake.refreshMutex.Lock()
	defer fake.refreshMutex.Unlock()
	fake.RefreshStub = stub
}

func (fake *FakeAuthHandler) RefreshArgsForCall(i int) *fiber.Ctx {
	fake.refreshMutex.RLock()
	defer fake.refreshMutex.RUnlock()
	argsForCall := fake.refreshArgsForCall[i]
	return argsForCall.arg1
}

func (fake *FakeAuthHandler) RefreshReturns(result1 error) {
	fake.refreshMutex.Lock()
	defer fake.refreshMutex.Unlock()
	fake.RefreshStub = nil
	fake.refreshReturns = struct {
		result1 error
	}{result1}
}

func (fake *FakeAuthHandler) RefreshReturnsOnCall(i int, result1 error) {
	fake.refreshMutex.Lock()
	defer fake.refreshMutex.Unlock()
	fake.RefreshStub = nil
	if fake.refreshReturnsOnCall == nil {
		fake.refreshReturnsOnCall = make(map[int]struct {
			result1 error
		})
	}
	fake.refreshReturnsOnCall[i] = struct {
		result1 error
	}{result1}
}

func (fake *FakeAuthHandler) SignIn(arg1 *fiber.Ctx) error {
	fake.signInMutex.Lock()
	ret, specificReturn := fake.signInReturnsOnCall[len(fake.signInArgsForCall)]
	fake.signInArgsForCall = append(fake.signInArgsForCall, struct {
		arg1 *fiber.Ctx
	}{arg1})
	stub := fake.SignInStub
	fakeReturns := fake.signInReturns
	fake.recordInvocation("SignIn", []interface{}{arg1})
	fake.signInMutex.Unlock()
	if stub != nil {
		return stub(arg1)
	}
	if specificReturn {
		return ret.result1
	}
	return fakeReturns.result1
}

func (fake *FakeAuthHandler) SignInCallCount() int {
	fake.signInMutex.RLock()
	defer fake.signInMutex.RUnlock()
	return len(fake.signInArgsForCall)
}

func (fake *FakeAuthHandler) SignInCalls(stub func(*fiber.Ctx) error) {
	fake.signInMutex.Lock()
	defer fake.signInMutex.Unlock()
	fake.SignInStub = stub
}

func (fake *FakeAuthHandler) SignInArgsForCall(i int) *fiber.Ctx {
	fake.signInMutex.RLock()
	defer fake.signInMutex.RUnlock()
	argsForCall := fake.signInArgsForCall[i]
	return argsForCall.arg1
}

func (fake *FakeAuthHandler) SignInReturns(result1 error) {
	fake.signInMutex.Lock()
	defer fake.signInMutex.Unlock()
	fake.SignInStub = nil
	fake.signInReturns = struct {
		result1 error
	}{result1}
}

func (fake *FakeAuthHandler) SignInReturnsOnCall(i int, result1 error) {
	fake.signInMutex.Lock()
	defer fake.signInMutex.Unlock()
	fake.SignInStub = nil
	if fake.signInReturnsOnCall == nil {
		fake.signInReturnsOnCall = make(map[int]struct {
			result1 error
		})
	}
	fake.signInReturnsOnCall[i] = struct {
		result1 error
	}{result1}
}

func (fake *FakeAuthHandler) SignOut(arg1 *fiber.Ctx) error {
	fake.signOutMutex.Lock()
	ret, specificReturn := fake.signOutReturnsOnCall[len(fake.signOutArgsForCall)]
	fake.signOutArgsForCall = append(fake.signOutArgsForCall, struct {
		arg1 *fiber.Ctx
	}{arg1})
	stub := fake.SignOutStub
	fakeReturns := fake.signOutReturns
	fake.recordInvocation("SignOut", []interface{}{arg1})
	fake.signOutMutex.Unlock()
	if stub != nil {
		return stub(arg1)
	}
	if specificReturn {
		return ret.result1
	}
	return fakeReturns.result1
}

func (fake *FakeAuthHandler) SignOutCallCount() int {
	fake.signOutMutex.RLock()
	defer fake.signOutMutex.RUnlock()
	return len(fake.signOutArgsForCall)
}

func (fake *FakeAuthHandler) SignOutCalls(stub func(*fiber.Ctx) error) {
	fake.signOutMutex.Lock()
	defer fake.signOutMutex.Unlock()
	fake.SignOutStub = stub
}

func (fake *FakeAuthHandler) SignOutArgsForCall(i int) *fiber.Ctx {
	fake.signOutMutex.RLock()
	defer fake.signOutMutex.RUnlock()
	argsForCall := fake.signOutArgsForCall[i]
	return argsForCall.arg1
}

func (fake *FakeAuthHandler) SignOutReturns(result1 error) {
	fake.signOutMutex.Lock()
	defer fake.signOutMutex.Unlock()
	fake.SignOutStub = nil
	fake.signOutReturns = struct {
		result1 error
	}{result1}
}

func (fake *FakeAuthHandler) SignOutReturnsOnCall(i int, result1 error) {
	fake.signOutMutex.Lock()
	defer fake.signOutMutex.Unlock()
	fake.SignOutStub = nil
	if fake.signOutReturnsOnCall == nil {
		fake.signOutReturnsOnCall = make(map[int]struct {
			result1 error
		})
	}
	fake.signOutReturnsOnCall[i] = struct {
		result1 error
	}{result1}
}

func (fake *FakeAuthHandler) SignUp(arg1 *fiber.Ctx) error {
	fake.signUpMutex.Lock()
	ret, specificReturn := fake.signUpReturnsOnCall[len(fake.signUpArgsForCall)]
	fake.signUpArgsForCall = append(fake.signUpArgsForCall, struct {
		arg1 *fiber.Ctx
	}{arg1})
	stub := fake.SignUpStub
	fakeReturns := fake.signUpReturns
	fake.recordInvocation("SignUp", []interface{}{arg1})
	fake.signUpMutex.Unlock()
	if stub != nil {
		return stub(arg1)
	}
	if specificReturn {
		return ret.result1
	}
	return fakeReturns.result1
}

func (fake *FakeAuthHandler) SignUpCallCount() int {
	fake.signUpMutex.RLock()
	defer fake.signUpMutex.RUnlock()
	return len(fake.signUpArgsForCall)
}

func (fake *FakeAuthHandler) SignUpCalls(stub func(*fiber.Ctx) error) {
	fake.signUpMutex.Lock()
	defer fake.signUpMutex.Unlock()
	fake.SignUpStub = stub
}

func (fake *FakeAuthHandler) SignUpArgsForCall(i int) *fiber.Ctx {
	fake.signUpMutex.RLock()
	defer fake.signUpMutex.RUnlock()
	argsForCall := fake.signUpArgsForCall[i]
	return argsForCall.arg1
}

func (fake *FakeAuthHandler) SignUpReturns(result1 error) {
	fake.signUpMutex.Lock()
	defer fake.signUpMutex.Unlock()
	fake.SignUpStub = nil
	fake.signUpReturns = struct {
		result1 error
	}{result1}
}

func (fake *FakeAuthHandler) SignUpReturnsOnCall(i int, result1 error) {
	fake.signUpMutex.Lock()
	defer fake.signUpMutex.Unlock()
	fake.SignUpStub = nil
	if fake.signUpReturnsOnCall == nil {
		fake.signUpReturnsOnCall = make(map[int]struct {
			result1 error
		})
	}
	fake.signUpReturnsOnCall[i] = struct {
		result1 error
	}{result1}
}

func (fake *FakeAuthHandler) Table() []handler.Mapper {
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

func (fake *FakeAuthHandler) TableCallCount() int {
	fake.tableMutex.RLock()
	defer fake.tableMutex.RUnlock()
	return len(fake.tableArgsForCall)
}

func (fake *FakeAuthHandler) TableCalls(stub func() []handler.Mapper) {
	fake.tableMutex.Lock()
	defer fake.tableMutex.Unlock()
	fake.TableStub = stub
}

func (fake *FakeAuthHandler) TableReturns(result1 []handler.Mapper) {
	fake.tableMutex.Lock()
	defer fake.tableMutex.Unlock()
	fake.TableStub = nil
	fake.tableReturns = struct {
		result1 []handler.Mapper
	}{result1}
}

func (fake *FakeAuthHandler) TableReturnsOnCall(i int, result1 []handler.Mapper) {
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

func (fake *FakeAuthHandler) Invocations() map[string][][]interface{} {
	fake.invocationsMutex.RLock()
	defer fake.invocationsMutex.RUnlock()
	fake.refreshMutex.RLock()
	defer fake.refreshMutex.RUnlock()
	fake.signInMutex.RLock()
	defer fake.signInMutex.RUnlock()
	fake.signOutMutex.RLock()
	defer fake.signOutMutex.RUnlock()
	fake.signUpMutex.RLock()
	defer fake.signUpMutex.RUnlock()
	fake.tableMutex.RLock()
	defer fake.tableMutex.RUnlock()
	copiedInvocations := map[string][][]interface{}{}
	for key, value := range fake.invocations {
		copiedInvocations[key] = value
	}
	return copiedInvocations
}

func (fake *FakeAuthHandler) recordInvocation(key string, args []interface{}) {
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

var _ handler.AuthHandler = new(FakeAuthHandler)
