'use client'

import { Button } from '@/app/_components/button'
import FormInput from '@/app/_components/form-input'
import { signIn } from '@/services/auth/api/singin'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import logger from '@/utils/logger'
import { useRouter } from 'next/navigation'

const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type Signin = z.infer<typeof SigninSchema>

export function SigninForm() {
  const router = useRouter()
  const { handleSubmit, control } = useForm<Signin>({
    resolver: zodResolver(SigninSchema),
  })

  const onSubmit = async (data: Signin) => {
    try {
      const response = await signIn(data.email, data.password)
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
        required
      />
      <FormInput
        control={control}
        name="password"
        type="password"
        placeholder="••••••••"
        required
      />
      <Button className="w-full" type="submit">
        로그인
      </Button>
    </form>
  )
}
