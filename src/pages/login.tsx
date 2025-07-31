import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { DUMMY_USER } from "@/data/user";
import { useNavigate } from "react-router-dom";
import travelersLogo from "@/assets/generic-logo.webp";
const loginBg = "https://yt3.googleusercontent.com/ytc/AIdro_lyqluIFafhhwC88lk9OE-9KApzRXb7IIgHQO4-GRm04qg=s900-c-k-c0x00ffffff-no-rj"; // Nueva imagen
import DefaultLayout from "@/layouts/default"; // Importar el layout

export default function LoginPage() {
    const [email, setEmail] = useState(DUMMY_USER.email);
    const [password, setPassword] = useState(DUMMY_USER.password || 'password123');
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
            <section className="flex items-center justify-center py-8 md:py-10">
                <div className="relative flex flex-col w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl md:flex-row animate-fade-in-up">
                    {/* Columna Izquierda (Visual con Animación) */}
                    <div className="relative md:w-1/2">
                        <img
                            src={loginBg}
                            alt="Protected device"
                            className="w-full h-full hidden md:block object-cover rounded-l-2xl"
                        />
                        {/* Overlay con gradiente */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-l-2xl hidden md:block"></div>
                        <div className="absolute bottom-10 left-10 hidden md:block">
                            <h2 className="text-3xl font-bold text-white">Peace of Mind, Secured.</h2>
                            <p className="text-white/80 mt-2">Your devices are safe with us. Access your portal to manage your policies.</p>
                        </div>
                    </div>

                    {/* Columna Derecha (Formulario) */}
                    <div className="flex flex-col justify-center p-8 md:p-14 md:w-1/2">
                        <div className="text-center mb-8">
                            <img src={travelersLogo} alt="Logo" className="w-28 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
                            <p className="text-gray-500">Sign in to continue.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <Input
                                label="Email"
                                type="email"
                                value={email}
                                onValueChange={setEmail}
                                startContent={<Mail size={18} className="text-gray-400" />}
                                placeholder="your@email.com"
                                required
                                classNames={{ inputWrapper: "bg-gray-50 focus-within:scale-105 transition-transform" }}
                            />
                            <Input
                                label="Password"
                                type="password"
                                value={password}
                                onValueChange={setPassword}
                                startContent={<Lock size={18} className="text-gray-400" />}
                                placeholder="Enter your password"
                                required
                                classNames={{ inputWrapper: "bg-gray-50 focus-within:scale-105 transition-transform" }}
                            />
                            {error && <p className="text-danger text-sm text-center animate-shake">{error}</p>}
                            <Button color="primary" type="submit" className="w-full text-lg py-3 transition-transform hover:scale-105">
                                Sign In
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </DefaultLayout>
    );
}
