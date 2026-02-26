import { useState, useRef, useEffect } from 'react';
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { useNavigate } from 'react-router-dom';
import { products } from '@/data/products';
import { SearchBar } from '@/components/ui/SearchBar';
import DefaultLayout from "@/layouts/default";
import '../components/home/ProductsSection/ProductsSection.css';

const ProductsServicesPage = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeSection, setActiveSection] = useState<'patrimonio' | 'dispositivos' | null>(null);
    const [patrimonioProducts, setPatrimonioProducts] = useState(
        products.filter(product => product.isHomeInsurance)
    );
    const [dispositivosProducts, setDispositivosProducts] = useState(
        products.filter(product => !product.isHomeInsurance)
    );
    const [searchQuery, setSearchQuery] = useState('');
    const sectionRef = useRef(null);
    const navigate = useNavigate();

    const categories = [
        { name: "Mobile", icon: "📱" },
        { name: "Computers", icon: "💻" },
        { name: "Tablets", icon: "📟" },
        { name: "Wearables", icon: "⌚" },
        { name: "Other", icon: "📷" },
    ];

    // Filter products based on category and search query
    useEffect(() => {
        // Filter Patrimonio products
        let filteredPatrimonio = products.filter(product => product.isHomeInsurance);
        if (searchQuery.trim()) {
            filteredPatrimonio = filteredPatrimonio.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setPatrimonioProducts(filteredPatrimonio);

        // Filter Dispositivos products
        let filteredDispositivos = products.filter(product => !product.isHomeInsurance);
        if (activeCategory !== 'All') {
            filteredDispositivos = filteredDispositivos.filter(product => product.category === activeCategory);
        }
        if (searchQuery.trim()) {
            filteredDispositivos = filteredDispositivos.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setDispositivosProducts(filteredDispositivos);
    }, [activeCategory, searchQuery]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const handleGetInsurance = (product: (typeof products)[0]) => {
        if (product.isHomeInsurance) {
            navigate('/home-insurance', { state: { product } });
        } else {
            navigate(`/get-insurance/${product.ProductId}`, { state: { product } });
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <DefaultLayout>
            <section
                className="py-16 bg-white dark:bg-gray-800 products-section min-h-screen" 
                ref={sectionRef}
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12 product-title">
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                            Products & Services
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
                            Comprehensive coverage for all your electronic devices and property, with flexible plans tailored to your needs.
                        </p>
                    </div>

                    {/* Main Category Buttons */}
                    {!activeSection && (
                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {/* Patrimonio Button */}
                            <button
                                onClick={() => setActiveSection('patrimonio')}
                                className="group relative overflow-hidden rounded-2xl border-4 border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-800 p-12 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                            >
                                <div className="text-center">
                                    <div className="text-8xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                        🏠
                                    </div>
                                    <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-3">
                                        Patrimonio
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                                        Protection for your home
                                    </p>
                                </div>
                            </button>

                            {/* Dispositivos Button */}
                            <button
                                onClick={() => setActiveSection('dispositivos')}
                                className="group relative overflow-hidden rounded-2xl border-4 border-purple-200 dark:border-purple-900 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-700 dark:to-gray-800 p-12 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                            >
                                <div className="text-center">
                                    <div className="text-8xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                        📱
                                    </div>
                                    <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-3">
                                        Dispositivos
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                                        Electronic devices coverage
                                    </p>
                                </div>
                            </button>
                        </div>
                    )}

                    {/* Patrimonio Section Content */}
                    {activeSection === 'patrimonio' && (
                        <div className="animate-fadeIn">
                            <div className="mb-6">
                                <button
                                    onClick={() => {
                                        setActiveSection(null);
                                        setSearchQuery('');
                                    }}
                                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors"
                                >
                                    <span className="text-xl">←</span> Back to Categories
                                </button>
                            </div>
                            <div className="mb-10 max-w-2xl mx-auto">
                                <SearchBar
                                    placeholder="Search for products..."
                                    onSearch={handleSearch}
                                />
                            </div>
                            <div className="products-grid">
                                {patrimonioProducts.map((product, index) => (
                                    <div
                                        key={product.name}
                                        className="product-card"
                                        style={{ "--delay": `${index * 0.05}s` } as React.CSSProperties}
                                    >
                                        <Card className="h-full">
                                            <CardBody className="flex flex-col items-center p-4">
                                                <div className="product-image-container mb-4">
                                                    <Image
                                                        src={product.image || "/placeholder.svg"}
                                                        alt={product.name}
                                                        className="product-image"
                                                    />
                                                </div>
                                                <h3 className="product-name">{product.name}</h3>
                                                <span className="product-category">{product.category}</span>
                                                <button
                                                    className="product-button"
                                                    onClick={() => handleGetInsurance(product)}
                                                >
                                                    Get Insurance
                                                </button>
                                            </CardBody>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Dispositivos Section Content */}
                    {activeSection === 'dispositivos' && (
                        <div className="animate-fadeIn">
                            <div className="mb-6">
                                <button
                                    onClick={() => {
                                        setActiveSection(null);
                                        setSearchQuery('');
                                        setActiveCategory('All');
                                    }}
                                    className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-semibold transition-colors"
                                >
                                    <span className="text-xl">←</span> Back to Categories
                                </button>
                            </div>
                            <div className="mb-10 max-w-2xl mx-auto">
                                <SearchBar
                                    placeholder="Search for products or categories..."
                                    onSearch={handleSearch}
                                />
                            </div>
                            <div className="mb-6 flex flex-wrap justify-center gap-3">
                                <button
                                    className={`category-btn ${activeCategory === 'All' ? 'active' : ''}`}
                                    onClick={() => setActiveCategory('All')}
                                >
                                    All
                                </button>
                                {categories.map((category, index) => (
                                    <button
                                        key={category.name}
                                        className={`category-btn ${activeCategory === category.name ? 'active' : ''}`}
                                        style={{ "--delay": `${index * 0.1}s` } as React.CSSProperties}
                                        onClick={() => setActiveCategory(category.name)}
                                    >
                                        <span className="mr-2">{category.icon}</span>
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                            {dispositivosProducts.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                                        No products found matching your search.
                                    </p>
                                </div>
                            ) : (
                                <div className="products-grid">
                                    {dispositivosProducts.map((product, index) => (
                                        <div
                                            key={product.name}
                                            className="product-card"
                                            style={{ "--delay": `${index * 0.05}s` } as React.CSSProperties}
                                        >
                                            <Card className="h-full">
                                                <CardBody className="flex flex-col items-center p-4">
                                                    <div className="product-image-container mb-4">
                                                        <Image
                                                            src={product.image || "/placeholder.svg"}
                                                            alt={product.name}
                                                            className="product-image"
                                                        />
                                                    </div>
                                                    <h3 className="product-name">{product.name}</h3>
                                                    <span className="product-category">{product.category}</span>
                                                    <button
                                                        className="product-button"
                                                        onClick={() => handleGetInsurance(product)}
                                                    >
                                                        Get Insurance
                                                    </button>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </DefaultLayout>
    );
};

export default ProductsServicesPage;
