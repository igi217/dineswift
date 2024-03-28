import TerminalImage from "@/assets/images/Terminal.jpg"
import Loading from "@/components/Loading"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React from "react"
import { useNavigate } from "react-router-dom"
import Install from "./Install"
import { db } from "@/db"
import toast from "react-hot-toast"
import { useAuthUserStore } from "@/stores/auth"
import Dashboard from "./Dashboard"
import { DBCollections } from "@/db/index.type"
import { API } from "@/constants"
export default function Login() {
    const [ready, setReady] = React.useState(false);
    const [formData, setFormData] = React.useState({
        username: "",
        password: ""
    })
    const [_, setAuth] = useAuthUserStore()

    const navigate = useNavigate()

    const checkLicense = async (key: string) => {
        let response = await fetch(API.LOGIN, {
            method: "POST",
            headers: {
                'content-type': "application/json",
                'accept': 'application/json'
            },
            body: JSON.stringify({ license: key })
        })

        let payload = await response.json()

        return payload.status
    }

    React.useEffect(() => {
        (async () => {
            let database = window.localStorage.getItem("@db_key")
            let auth_data = window.localStorage.getItem("@auth_store")
            let license = window.localStorage.getItem("@license")

            let isValid = await checkLicense(license ?? "")

            if (!isValid) {
                window.localStorage.clear();
                navigate(Install.route)
                return;
            }

            if (!database) {
                navigate(Install.route)
                return;
            }
            if (!auth_data) {
                setReady(true)
                return;
            }
            let users = await db.find({
                selector: { ...JSON.parse(auth_data), table: DBCollections.USER }
            })
            if (users.docs.length >= 1) {
                setAuth(users.docs.at(0) as any)
                navigate(Dashboard.route)
                return;
            }

            setReady(true)

        })();
    }, [])

    const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;

        setFormData({ ...formData, [name]: value })
    }

    const handleFormSubmit = async () => {
        setReady(false)
        let users = await db.find({
            selector: { table: DBCollections.USER, ...formData },
        })
        setReady(true)

        if (users.docs.length < 1) {
            toast.error("Invalid Username/Password!")
        }
        else {
            toast.success("Login Successfull")
            localStorage.setItem("@auth_store", JSON.stringify(formData))
            setAuth(users.docs.at(0) as any)
            navigate(Dashboard.route)
        }
    }


    return (
        <div className="h-full relative w-full">
            <img
                className="w-full filter hue-rotate-[270deg] absolute inset-0 h-full object-cover"
                src={TerminalImage}
                alt="Terminal Image" />
            <div className="w-full relative h-full bg-[rgba(255,255,255,0.2)] backdrop-blur-md z-[1] flex justify-center items-center">
                <Card className="min-w-[330px]">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl">Let's get started</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">

                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input name="username" id="username" onChange={handleFormDataChange} value={formData.username} type="text" placeholder="username" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input name="password" id="password" onChange={handleFormDataChange} value={formData.password} placeholder="******" type="password" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleFormSubmit} className="w-full">Login</Button>
                    </CardFooter>
                </Card>
            </div>
            <Loading show={!ready} />
        </div>
    )
}
Login.route = "/"