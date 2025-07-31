import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import DefaultLayout from "@/layouts/default";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { DUMMY_USER, useAuth } from "@/auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState(DUMMY_USER.email);
    const [password, setPassword] = useState(DUMMY_USER.password)
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const success = await login(email, password);
        if (success) {
            navigate("/");
        } else {
            setError("Invalid email or password");
        }
    };

    return (
        <DefaultLayout>
            <section className="flex justify-center items-center py-20">
                <Card className="max-w-md w-full">
                    <CardBody className="p-8">
                        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <Input
                                label="Email"
                                type="email"
                                value={email}
                                onValueChange={setEmail}
                                startContent={<Mail size={18} />}
                                placeholder="Enter your email"
                                required
                            />
                            <Input
                                label="Password"
                                type="password"
                                value={password}
                                onValueChange={setPassword}
                                startContent={<Lock size={18} />}
                                placeholder="Enter your password"
                                required
                            />
                            {error && <p className="text-danger text-sm text-center">{error}</p>}
                            <Button color="primary" type="submit" className="w-full">
                                Sign In
                            </Button>
                        </form>
                    </CardBody>
                </Card>
            </section>
        </DefaultLayout>
    );
}
