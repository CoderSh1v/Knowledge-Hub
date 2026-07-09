"use client"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { signInSchema } from "@/lib/schema"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Navbar from "@/components/navbar2"
import { toast } from "sonner"
import { useEffect } from "react"

function SignIn() {
    type Inputs = z.infer<typeof signInSchema>
    const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({ resolver: zodResolver(signInSchema) })

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    useEffect(() => {
        if (searchParams.get("reason") === "session_expired") {
            setTimeout(() => {
                toast("You have been logged out. Please sign in again.", { position: "top-center", });
            }, 1);
                const params = new URLSearchParams(searchParams.toString());
                params.delete("reason");
                const query = params.toString();
                router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false, });
           
        }
    }, []);

    const onSubmit: SubmitHandler<Inputs> = async (formData) => {
        const res = await fetch('/api/auth/signin', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
        const data = await res.json()
        if (!res.ok) { toast(data.message); return }
        router.replace('/dashboard')
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="flex items-center justify-center px-8 py-20">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2"> Email</label>
                            <Input type="email" placeholder="your@email.com"{...register('email')} className="w-full" />
                            {errors.email && (<p className="text-sm text-red-500">  {errors.email.message}</p>)}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">Password</label>
                            <Input type="password" placeholder="••••••••"{...register('password')} className="w-full" />
                            {errors.password && (<p className="text-sm text-red-500">  {errors.password.message}</p>)}

                        </div>
                        <Button type="submit" className="w-full">Sign In</Button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <span className="text-gray-600">Don&apos;t have an account? </span>
                        <Link href="/signup" className="font-semibold text-gray-900 hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default SignIn

