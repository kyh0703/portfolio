import NextAuth  from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
// import { signIn } from './services/auth'

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth({
    pages: {
        signIn: '/signin',
        signOut: '/signout',
        newUser: '/signup',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: {  label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials) {
                    throw new Error("No credentials")
                }

                return {
                    id: credentials.email,
                    email: credentials.email,
                    name: credentials.email,
                }
            }
        })
    ]
})
