'use client'

import { Button } from '@/app/_components/button'
import FormInput from '@/app/_components/form-input'
import { signin } from '@/services/auth/api/singin'
import logger from '@/utils/logger'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type Signin = z.infer<typeof SigninSchema>

export function SigninForm() {
  const router = useRouter()
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Signin>({
    resolver: zodResolver(SigninSchema),
  })

  const onSubmit = async (data: Signin) => {
    try {
      const response = await signin(data)
      console.log(response)
      router.push('/dashboard')
    } catch (error) {
      logger.error(error)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        control={control}
        name="email"
        type="email"
        placeholder="your@email.com"
      />
      {errors.email && <p className="error-msg">{errors.email.message}</p>}
      <FormInput
        control={control}
        name="password"
        type="password"
        placeholder="••••••••"
      />
      {errors.password && (
        <p className="error-msg">{errors.password.message}</p>
      )}
      <Button className="w-full" type="submit">
        로그인
      </Button>
    </form>
  )
}
