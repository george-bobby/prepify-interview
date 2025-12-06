"use client"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import React from "react";
import { Button } from "@/components/ui/button"
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { signUp, signIn } from "@/lib/actions/auth.action"
import {
  Form,
} from "@/components/ui/form"
import { FormField } from "./FormFields";
import { useRouter } from "next/navigation";


type FormType = "signup" | "sign-in";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === 'signup' ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3)
  })
}

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter()
  const formSchema = authFormSchema(type)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      if (type === 'signup') {
        const { name, email, password } = values
        //register a new user in firebase auth not firestore i.e. firebase database
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password
        })
        if (!result?.success) {
          toast.error(result?.message)
          return
        }
        toast.success("Account created successfully")

        // Auto-login the user after successful signup
        const idToken = await userCredentials.user.getIdToken()
        const signInResult = await signIn({
          email,
          idToken
        })

        if (signInResult?.success) {
          toast.success("Welcome! You're now logged in.")
          router.push('/dashboard')
        } else {
          // If auto-login fails, redirect to signin page
          router.push('/signin')
        }
      } else {
        const { email, password } = values
        const userCredentials = await signInWithEmailAndPassword(auth, email, password)
        //create a token for the user
        const idToken = await userCredentials.user.getIdToken()
        if (!idToken) {
          toast.error("Failed to sign in")
          return
        }
        const result = await signIn({
          email,
          idToken
        })

        if (!result?.success) {
          toast.error(result?.message)
          return
        }

        toast.success("Logged in successfully")
        router.push('/dashboard')
      }
    } catch (error) {
      console.log(error)
      toast.error(`There was an error: ${error}`);
    }

  }
  const isSignIn = type === "sign-in"
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#c0fe72]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#9cd052]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7cb342]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Main Card */}
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-2xl p-8 shadow-2xl shadow-[#c0fe72]/20">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <Image src="/logo.svg" alt="logo" height={48} width={48} />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#c0fe72] to-[#9cd052] bg-clip-text text-transparent">
                Prepify
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isSignIn ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-400 text-sm">
              {isSignIn ? 'Sign in to continue' : 'Start your interview prep journey'}
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {!isSignIn && (
                <FormField control={form.control} name="name" label="Name" placeholder="Enter your name" />
              )}
              <FormField control={form.control} name="email" label="Email" placeholder="Enter your email" type="email" />
              <FormField control={form.control} name="password" label="Password" placeholder="Enter your password" type="password" />
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black font-bold text-base py-6 rounded-xl shadow-lg shadow-[#c0fe72]/30 transition-all duration-200"
              >
                {isSignIn ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-black text-gray-500">
                {isSignIn ? "Don't have an account?" : "Already have an account?"}
              </span>
            </div>
          </div>

          {/* Switch Link */}
          <div className="text-center">
            <Link 
              href={isSignIn ? '/signup' : '/signin'} 
              className="text-[#c0fe72] hover:text-[#9cd052] font-semibold transition-colors"
            >
              {isSignIn ? 'Create an account' : 'Sign in instead'}
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-[#c0fe72]/20 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-xl mb-1">🤖</div>
            <p className="text-[#c0fe72] text-xs font-semibold">AI-Powered</p>
          </div>
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-[#c0fe72]/20 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-xl mb-1">⚡</div>
            <p className="text-[#c0fe72] text-xs font-semibold">Instant Feedback</p>
          </div>
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-[#c0fe72]/20 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-xl mb-1">📊</div>
            <p className="text-[#c0fe72] text-xs font-semibold">Track Progress</p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AuthForm;
