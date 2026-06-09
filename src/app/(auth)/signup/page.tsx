"use client"
import { useForm, SubmitHandler } from "react-hook-form"
import { signUpSchema } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { useRouter } from "next/navigation"

function SignUp() {
    type Inputs = z.infer<typeof signUpSchema>
    const {
        register,
        handleSubmit,
        watch,
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
        const data =await res.json()
        if(!res.ok){
            console.log(data.message)
            return
        }
        router.replace('/signin')
    }

    return (
        <div >
            <span className='text-5xl flex justify-center mb-8 mt-20'>Sign Up</span>
            <div className='flex border-2 m-auto w-96 rounded-2xl h-52'>
                <form onSubmit={handleSubmit(onSubmit)} className='flex justify-around flex-col ml-10  '>
                    <div className='flex justify-between '>
                        <label htmlFor="name">Name : </label>
                        <input type="text" className="border-2 "  {...register("name")} />
                    </div>
                    <div className='flex justify-between '>
                        <label htmlFor="email">Email : </label>
                        <input type="email" className="border-2 "  {...register("email")} />
                    </div>
                    <div>
                        <label htmlFor="password">Password : </label>
                        <input type="password" className="border-2 " {...register("password")} />
                    </div>
                    <input type="submit" value="Submit" className='border-2 flex self-center w-20 rounded-3xl' />
                </form>
            </div>
        </div>
    )
}

export default SignUp
