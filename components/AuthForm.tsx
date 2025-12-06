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
        <div className="absolute top-10 left-10 w-96 h-96 bg-[#c0fe72]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#9cd052]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-[#7cb342]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Main Card */}
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-[#c0fe72]/40 rounded-3xl p-8 md:p-10 shadow-2xl shadow-[#c0fe72]/30 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-[#c0fe72]/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#9cd052]/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            {/* Logo Section */}
            <div className="flex flex-col items-center gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-[#c0fe72] to-[#9cd052] rounded-2xl flex items-center justify-center shadow-xl shadow-[#c0fe72]/40 p-2">
                  <Image src="/logo.svg" alt="logo" height={40} width={40} className="w-full h-full" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#c0fe72] to-[#9cd052] bg-clip-text text-transparent">Prepify</h2>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {isSignIn ? 'Welcome Back! 👋' : 'Join Prepify Today! 🚀'}
                </h3>
                <p className="text-gray-400">
                  {isSignIn ? 'Sign in to continue your interview prep journey' : 'Practice job interviews with AI and ace your next opportunity'}
                </p>
              </div>

              {/* Feature Badges */}
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-gradient-to-r from-[#c0fe72]/20 to-[#9cd052]/20 text-[#c0fe72] text-xs font-bold rounded-full border border-[#c0fe72]/30">
                  🤖 AI-Powered
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30">
                  ⚡ Instant Feedback
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 text-xs font-bold rounded-full border border-blue-500/30">
                  📊 Track Progress
                </span>
              </div>
            </div>

            {/* Form Section */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
                {!isSignIn && (
                  <FormField control={form.control} name="name" label="Name" placeholder="Your name"></FormField>
                )}
                <FormField control={form.control} name="email" label="Email" placeholder="Your email address" type="email"></FormField>
                <FormField control={form.control} name="password" label="Password" placeholder="Enter your password" type="password"></FormField>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#c0fe72] via-[#9cd052] to-[#c0fe72] text-black font-extrabold text-lg py-6 rounded-2xl shadow-2xl shadow-[#c0fe72]/40 hover:shadow-[#c0fe72]/60 transition-all mt-6"
                >
                  {isSignIn ? '🔓 Sign In' : '🎯 Create Account'}
                </Button>
              </form>
            </Form>

            {/* Footer Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                {isSignIn ? "Don't have an account?" : 'Already have an account?'}
                <Link href={isSignIn ? '/signup' : '/signin'} className="font-bold text-[#c0fe72] ml-2 hover:text-[#d4ff8f] transition-colors">
                  {isSignIn ? 'Sign Up' : 'Sign In'}
                </Link>
              </p>
            </div>

            {/* Additional Info for Sign Up */}
            {!isSignIn && (
              <div className="mt-6 p-4 bg-white/5 border border-[#c0fe72]/20 rounded-2xl">
                <p className="text-gray-300 text-sm text-center">
                  ✨ By signing up, you'll get access to AI-powered interviews, personalized feedback, and progress tracking!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Feature Cards */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-[#c0fe72]/30 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-[#c0fe72] font-bold text-sm">Realistic</p>
            <p className="text-gray-400 text-xs">Practice</p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">📈</div>
            <p className="text-purple-400 font-bold text-sm">Track</p>
            <p className="text-gray-400 text-xs">Progress</p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-black border border-blue-500/30 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">🏆</div>
            <p className="text-blue-400 font-bold text-sm">Ace</p>
            <p className="text-gray-400 text-xs">Interviews</p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AuthForm;
