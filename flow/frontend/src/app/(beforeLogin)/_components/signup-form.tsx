'use client'

import FormInput from '@/app/_components/form-input'
import { Button } from '@/app/_components/button'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const SignupSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
    confirmPassword: z
      .string()
      .min(6, '비밀번호 확인은 6자 이상이어야 합니다.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  })

type Signup = z.infer<typeof SignupSchema>

export function SignupForm() {
  const { handleSubmit, control } = useForm<Signup>({
    resolver: zodResolver(SignupSchema),
  })

  const onSubmit = (data: Signup) => {
    console.log(data)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <FormInput control={control} name="name" placeholder="홍길동" required />
      <FormInput
        control={control}
        name="email"
        type="email"
        placeholder="your@email.com"
        required
      />
      <FormInput
        control={control}
        name="password"
        type="password"
        placeholder="••••••••"
        required
      />
      <FormInput
        control={control}
        name={'confirmPassword'}
        id="confirmPassword"
        type="password"
        placeholder="••••••••"
        required
      />
      <Button className="w-full" type="submit">
        회원가입
      </Button>
    </form>
  )
}
