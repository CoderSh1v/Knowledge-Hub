"use client"
import Navbar from "@/components/navbar"
import { useForm, SubmitHandler } from "react-hook-form"
import { signUpSchema } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
function SignUp() {
    type Inputs = z.infer<typeof signUpSchema>
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(signUpSchema)
    })
    const router = useRouter();
    const onSubmit: SubmitHandler<Inputs> = async (formData) => {
        const res = await fetch('/api/auth/signup', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
        const data = await res.json()
        if (!res.ok) {
            console.log(data.message)
            return
        }
        router.replace('/signin')
    }

    return (
        <div className="min-h-screen bg-white">
            
            <Navbar/>

            {/* Sign Up Form */}
            <main className="flex items-center justify-center px-8 py-20">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-600">Join Knowledge Hub today</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">    Name</label>
                            <Input type="text" placeholder="Your name" {...register('name')} className="w-full" />
                            {errors.name && (<p className="text-sm text-red-500">  {errors.name.message}</p>)}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2"> Email </label>
                            <Input type="email" placeholder="your@email.com" {...register('email')} className="w-full" />
                            {errors.email && (<p className="text-sm text-red-500">  {errors.email.message}</p>)}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2"> Password</label>
                            <Input type="password" placeholder="••••••••"{...register('password')} className="w-full" />
                            {errors.password && (<p className="text-sm text-red-500">  {errors.password.message}</p>)}
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full"> Create Account</Button>
                    </form>

                    {/* Sign In Link */}
                    <div className="mt-6 text-center">
                        <span className="text-gray-600">Already a member? </span>
                        <Link href="/signin" className="font-semibold text-gray-900 hover:underline"> Sign in</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default SignUp
