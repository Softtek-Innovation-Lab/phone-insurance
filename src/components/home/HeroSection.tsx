import { Button } from "@/components/ui/button";

import cameraImage from '@/assets/camera-nikon.webp';
import laptopImage from '@/assets/laptop.webp';
import phoneImage from '@/assets/phone.webp';
import { products } from "@/data/products";

export default function HeroSection() {
    return (
        <section className="relative py-16 mb-12 bg-hero-index text-white">

            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center">
                {/* Left Content */}
                <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0 animate-fade-in">
                    <div className="flex justify-center md:justify-start mb-4 animate-slide-up">
                        <span className="text-green-400 font-semibold">Trustpilot</span>
                        <span className="ml-2 text-yellow-400">⭐⭐⭐⭐☆</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight animate-slide-up">
                        Your Trusted Partner <br /> for Electronic Device Insurance
                    </h1>
                    <p className="opacity-0 text-lg md:text-xl text-gray-200 mb-6 animate-slide-up animation-delay-200">
                        Reliable coverage for all your devices, backed by decades of expertise.
                    </p>
                    <div className="opacity-0 flex justify-center md:justify-start space-x-4 mb-6 animate-slide-up animation-delay-400">
                        <Button
                            variant="default"
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            Get Individual Quotes
                        </Button>
                        <Button
                            variant="destructive"
                            className="px-6 py-2 bg-red-900 hover:bg-red-1000 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            K-12 School Quotes
                        </Button>
                    </div>
                    <div className="opacity-0 flex justify-center md:justify-start gap-4 items-center mb-6 animate-slide-up animation-delay-600">
                        {products.sort(() => 0.5 - Math.random()).slice(0, 3).map((product, index) => (
                            <span
                                key={index}
                                style={{ "backgroundImage": `url(${product.image})` }}
                                className="w-16 h-16 bg-cover bg-center bg-no-repeat rounded-lg shadow-md"
                            />
                        ))}
                    </div>
                    <div className="opacity-0  flex flex-wrap justify-center md:justify-start gap-4 text-sm animate-slide-up animation-delay-800">
                        <div className="flex items-center bg-yellow-900 bg-opacity-50 px-4 py-2 rounded-full shadow-md text-yellow-100">
                            <span className="mr-2">✅</span> +50 Years in the Business
                        </div>
                        <div className="flex items-center bg-blue-800 bg-opacity-50 px-4 py-2 rounded-full shadow-md text-blue-100">
                            <span className="mr-2">👍</span> Backed by an A Best Rated Underwriter
                        </div>
                    </div>
                </div>

                {/* Right Side (imgs with Animation) */}
                <div className="w-full md:w-1/2 relative flex justify-center h-[500px]">
                    {/* Floating text */}
                    <div className="opacity-0 absolute bottom-0 right-0 bg-blue-800 bg-opacity-90 p-3 rounded-lg shadow-lg max-w-[200px] text-center z-[25] animate-fade-up animation-delay-1000">
                        <h3 className="text-lg font-bold mb-1">All Devices Covered</h3>
                        <p className="text-sm text-gray-200">From smartphones to professional equipment</p>
                    </div>

                    {/* Laptop */}
                    <div
                        className="absolute z-10 animate-zoom-in"
                        style={{ bottom: "85px", right: "140px", transform: "rotate(0deg)" }}
                    >
                        <div className="relative">
                            <img
                                src={laptopImage}
                                width={280}
                                height={200}
                                alt="Laptop"
                                className="w-[280px] drop-shadow-2xl"
                            />
                            <div className="absolute -bottom-6 left-0 right-0 text-center">
                                <span className="bg-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                    Laptop Coverage
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="opacity-0  absolute z-[9] animate-zoom-in" style={{ top: "15rem", right: "-5rem" }}>
                        <div className="relative">
                            <img
                                src={phoneImage}
                                width={150}
                                height={300}
                                alt="Smartphone"
                                className="w-[220px] drop-shadow-2xl"
                            />
                            <div className="absolute -bottom-6 left-0 right-0 text-center">
                                <span className="bg-red-600 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                    Phone Protection
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Camera */}
                    <div
                        className="absolute z-30"
                        style={{ top: "-2rem", right: "-5rem", transform: "rotate(4deg)" }}
                    >
                        <div className="relative">
                            <img
                                src={cameraImage}
                                width={200}
                                height={200}
                                alt="Camera"
                                className="w-[230px] drop-shadow-2xl"
                            />
                            <div className="absolute -bottom-6 left-0 right-0 text-center">
                                <span className="bg-green-600 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                    Camera Insurance
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

