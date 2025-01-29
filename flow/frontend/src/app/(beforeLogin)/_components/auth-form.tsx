'use client'

import { Button } from '@/app/_components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card'
import { useState } from 'react'
import { SignupForm } from './signup-form'
import { SigninForm } from './signin-form'

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <Card className="mx-auto w-full max-w-2xl bg-main shadow-2xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-center text-4xl font-bold">
          {isLogin ? '로그인' : '회원가입'}
        </CardTitle>
        <CardDescription className="text-center text-xl">
          {isLogin ? '계정에 로그인하세요' : '새 계정을 만들어보세요'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        {isLogin ? <SigninForm /> : <SignupForm />}
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
            className="text-lg"
          >
            {isLogin
              ? '계정이 없으신가요? 회원가입'
              : '이미 계정이 있으신가요? 로그인'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
