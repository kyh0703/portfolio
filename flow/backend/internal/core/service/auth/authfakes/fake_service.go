// Code generated by counterfeiter. DO NOT EDIT.
package authfakes

import (
	"context"
	"sync"

	"github.com/kyh0703/flow/internal/core/domain/model"
	autha "github.com/kyh0703/flow/internal/core/dto/auth"
	"github.com/kyh0703/flow/internal/core/service/auth"
)

type FakeService struct {
	RefreshTokenStub        func(context.Context, *autha.Refresh) (*autha.Token, error)
	refreshTokenMutex       sync.RWMutex
	refreshTokenArgsForCall []struct {
		arg1 context.Context
		arg2 *autha.Refresh
	}
	refreshTokenReturns struct {
		result1 *autha.Token
		result2 error
	}
	refreshTokenReturnsOnCall map[int]struct {
		result1 *autha.Token
		result2 error
	}
	SignInStub        func(context.Context, *autha.SignIn) (*autha.Token, error)
	signInMutex       sync.RWMutex
	signInArgsForCall []struct {
		arg1 context.Context
		arg2 *autha.SignIn
	}
	signInReturns struct {
		result1 *autha.Token
		result2 error
	}
	signInReturnsOnCall map[int]struct {
		result1 *autha.Token
		result2 error
	}
	SignOutStub        func(context.Context) error
	signOutMutex       sync.RWMutex
	signOutArgsForCall []struct {
		arg1 context.Context
	}
	signOutReturns struct {
		result1 error
	}
	signOutReturnsOnCall map[int]struct {
		result1 error
	}
	SignUpStub        func(context.Context, *autha.SignUp) (*model.User, error)
	signUpMutex       sync.RWMutex
	signUpArgsForCall []struct {
		arg1 context.Context
		arg2 *autha.SignUp
	}
	signUpReturns struct {
		result1 *model.User
		result2 error
	}
	signUpReturnsOnCall map[int]struct {
		result1 *model.User
		result2 error
	}
	invocations      map[string][][]interface{}
	invocationsMutex sync.RWMutex
}

func (fake *FakeService) RefreshToken(arg1 context.Context, arg2 *autha.Refresh) (*autha.Token, error) {
	fake.refreshTokenMutex.Lock()
	ret, specificReturn := fake.refreshTokenReturnsOnCall[len(fake.refreshTokenArgsForCall)]
	fake.refreshTokenArgsForCall = append(fake.refreshTokenArgsForCall, struct {
		arg1 context.Context
		arg2 *autha.Refresh
	}{arg1, arg2})
	stub := fake.RefreshTokenStub
	fakeReturns := fake.refreshTokenReturns
	fake.recordInvocation("RefreshToken", []interface{}{arg1, arg2})
	fake.refreshTokenMutex.Unlock()
	if stub != nil {
		return stub(arg1, arg2)
	}
	if specificReturn {
		return ret.result1, ret.result2
	}
	return fakeReturns.result1, fakeReturns.result2
}

func (fake *FakeService) RefreshTokenCallCount() int {
	fake.refreshTokenMutex.RLock()
	defer fake.refreshTokenMutex.RUnlock()
	return len(fake.refreshTokenArgsForCall)
}

func (fake *FakeService) RefreshTokenCalls(stub func(context.Context, *autha.Refresh) (*autha.Token, error)) {
	fake.refreshTokenMutex.Lock()
	defer fake.refreshTokenMutex.Unlock()
	fake.RefreshTokenStub = stub
}

func (fake *FakeService) RefreshTokenArgsForCall(i int) (context.Context, *autha.Refresh) {
	fake.refreshTokenMutex.RLock()
	defer fake.refreshTokenMutex.RUnlock()
	argsForCall := fake.refreshTokenArgsForCall[i]
	return argsForCall.arg1, argsForCall.arg2
}

func (fake *FakeService) RefreshTokenReturns(result1 *autha.Token, result2 error) {
	fake.refreshTokenMutex.Lock()
	defer fake.refreshTokenMutex.Unlock()
	fake.RefreshTokenStub = nil
	fake.refreshTokenReturns = struct {
		result1 *autha.Token
		result2 error
	}{result1, result2}
}

func (fake *FakeService) RefreshTokenReturnsOnCall(i int, result1 *autha.Token, result2 error) {
	fake.refreshTokenMutex.Lock()
	defer fake.refreshTokenMutex.Unlock()
	fake.RefreshTokenStub = nil
	if fake.refreshTokenReturnsOnCall == nil {
		fake.refreshTokenReturnsOnCall = make(map[int]struct {
			result1 *autha.Token
			result2 error
		})
	}
	fake.refreshTokenReturnsOnCall[i] = struct {
		result1 *autha.Token
		result2 error
	}{result1, result2}
}

func (fake *FakeService) SignIn(arg1 context.Context, arg2 *autha.SignIn) (*autha.Token, error) {
	fake.signInMutex.Lock()
	ret, specificReturn := fake.signInReturnsOnCall[len(fake.signInArgsForCall)]
	fake.signInArgsForCall = append(fake.signInArgsForCall, struct {
		arg1 context.Context
		arg2 *autha.SignIn
	}{arg1, arg2})
	stub := fake.SignInStub
	fakeReturns := fake.signInReturns
	fake.recordInvocation("SignIn", []interface{}{arg1, arg2})
	fake.signInMutex.Unlock()
	if stub != nil {
		return stub(arg1, arg2)
	}
	if specificReturn {
		return ret.result1, ret.result2
	}
	return fakeReturns.result1, fakeReturns.result2
}

func (fake *FakeService) SignInCallCount() int {
	fake.signInMutex.RLock()
	defer fake.signInMutex.RUnlock()
	return len(fake.signInArgsForCall)
}

func (fake *FakeService) SignInCalls(stub func(context.Context, *autha.SignIn) (*autha.Token, error)) {
	fake.signInMutex.Lock()
	defer fake.signInMutex.Unlock()
	fake.SignInStub = stub
}

func (fake *FakeService) SignInArgsForCall(i int) (context.Context, *autha.SignIn) {
	fake.signInMutex.RLock()
	defer fake.signInMutex.RUnlock()
	argsForCall := fake.signInArgsForCall[i]
	return argsForCall.arg1, argsForCall.arg2
}

func (fake *FakeService) SignInReturns(result1 *autha.Token, result2 error) {
	fake.signInMutex.Lock()
	defer fake.signInMutex.Unlock()
	fake.SignInStub = nil
	fake.signInReturns = struct {
		result1 *autha.Token
		result2 error
	}{result1, result2}
}

func (fake *FakeService) SignInReturnsOnCall(i int, result1 *autha.Token, result2 error) {
	fake.signInMutex.Lock()
	defer fake.signInMutex.Unlock()
	fake.SignInStub = nil
	if fake.signInReturnsOnCall == nil {
		fake.signInReturnsOnCall = make(map[int]struct {
			result1 *autha.Token
			result2 error
		})
	}
	fake.signInReturnsOnCall[i] = struct {
		result1 *autha.Token
		result2 error
	}{result1, result2}
}

func (fake *FakeService) SignOut(arg1 context.Context) error {
	fake.signOutMutex.Lock()
	ret, specificReturn := fake.signOutReturnsOnCall[len(fake.signOutArgsForCall)]
	fake.signOutArgsForCall = append(fake.signOutArgsForCall, struct {
		arg1 context.Context
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

func (fake *FakeService) SignOutCallCount() int {
	fake.signOutMutex.RLock()
	defer fake.signOutMutex.RUnlock()
	return len(fake.signOutArgsForCall)
}

func (fake *FakeService) SignOutCalls(stub func(context.Context) error) {
	fake.signOutMutex.Lock()
	defer fake.signOutMutex.Unlock()
	fake.SignOutStub = stub
}

func (fake *FakeService) SignOutArgsForCall(i int) context.Context {
	fake.signOutMutex.RLock()
	defer fake.signOutMutex.RUnlock()
	argsForCall := fake.signOutArgsForCall[i]
	return argsForCall.arg1
}

func (fake *FakeService) SignOutReturns(result1 error) {
	fake.signOutMutex.Lock()
	defer fake.signOutMutex.Unlock()
	fake.SignOutStub = nil
	fake.signOutReturns = struct {
		result1 error
	}{result1}
}

func (fake *FakeService) SignOutReturnsOnCall(i int, result1 error) {
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

func (fake *FakeService) SignUp(arg1 context.Context, arg2 *autha.SignUp) (*model.User, error) {
	fake.signUpMutex.Lock()
	ret, specificReturn := fake.signUpReturnsOnCall[len(fake.signUpArgsForCall)]
	fake.signUpArgsForCall = append(fake.signUpArgsForCall, struct {
		arg1 context.Context
		arg2 *autha.SignUp
	}{arg1, arg2})
	stub := fake.SignUpStub
	fakeReturns := fake.signUpReturns
	fake.recordInvocation("SignUp", []interface{}{arg1, arg2})
	fake.signUpMutex.Unlock()
	if stub != nil {
		return stub(arg1, arg2)
	}
	if specificReturn {
		return ret.result1, ret.result2
	}
	return fakeReturns.result1, fakeReturns.result2
}

func (fake *FakeService) SignUpCallCount() int {
	fake.signUpMutex.RLock()
	defer fake.signUpMutex.RUnlock()
	return len(fake.signUpArgsForCall)
}

func (fake *FakeService) SignUpCalls(stub func(context.Context, *autha.SignUp) (*model.User, error)) {
	fake.signUpMutex.Lock()
	defer fake.signUpMutex.Unlock()
	fake.SignUpStub = stub
}

func (fake *FakeService) SignUpArgsForCall(i int) (context.Context, *autha.SignUp) {
	fake.signUpMutex.RLock()
	defer fake.signUpMutex.RUnlock()
	argsForCall := fake.signUpArgsForCall[i]
	return argsForCall.arg1, argsForCall.arg2
}

func (fake *FakeService) SignUpReturns(result1 *model.User, result2 error) {
	fake.signUpMutex.Lock()
	defer fake.signUpMutex.Unlock()
	fake.SignUpStub = nil
	fake.signUpReturns = struct {
		result1 *model.User
		result2 error
	}{result1, result2}
}

func (fake *FakeService) SignUpReturnsOnCall(i int, result1 *model.User, result2 error) {
	fake.signUpMutex.Lock()
	defer fake.signUpMutex.Unlock()
	fake.SignUpStub = nil
	if fake.signUpReturnsOnCall == nil {
		fake.signUpReturnsOnCall = make(map[int]struct {
			result1 *model.User
			result2 error
		})
	}
	fake.signUpReturnsOnCall[i] = struct {
		result1 *model.User
		result2 error
	}{result1, result2}
}

func (fake *FakeService) Invocations() map[string][][]interface{} {
	fake.invocationsMutex.RLock()
	defer fake.invocationsMutex.RUnlock()
	fake.refreshTokenMutex.RLock()
	defer fake.refreshTokenMutex.RUnlock()
	fake.signInMutex.RLock()
	defer fake.signInMutex.RUnlock()
	fake.signOutMutex.RLock()
	defer fake.signOutMutex.RUnlock()
	fake.signUpMutex.RLock()
	defer fake.signUpMutex.RUnlock()
	copiedInvocations := map[string][][]interface{}{}
	for key, value := range fake.invocations {
		copiedInvocations[key] = value
	}
	return copiedInvocations
}

func (fake *FakeService) recordInvocation(key string, args []interface{}) {
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

var _ auth.Service = new(FakeService)
