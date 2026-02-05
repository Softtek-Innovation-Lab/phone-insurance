import { useState, useRef, useEffect } from 'react';
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { useNavigate } from 'react-router-dom';
import { products } from '@/data/products';
import { SearchBar } from '@/components/ui/SearchBar';
import DefaultLayout from "@/layouts/default";
import '../components/home/ProductsSection/ProductsSection.css';

const ProductsServicesPage = () => {
    const [visibleProducts, setVisibleProducts] = useState(
        products.filter(product => product.isHomeInsurance)
    );
    const [searchQuery, setSearchQuery] = useState('');
    const sectionRef = useRef(null);
    const navigate = useNavigate();

    // Filter products based on search query
    useEffect(() => {
        let filtered = products.filter(product => product.isHomeInsurance);

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setVisibleProducts(filtered);
    }, [searchQuery]);

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
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12 product-title">
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                            Products & Services
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
                            Discover our home insurance products. Comprehensive protection for your home and belongings.
                        </p>
                    </div>

                    <div className="mb-10 max-w-2xl mx-auto">
                        <SearchBar
                            placeholder="Search products..."
                            onSearch={handleSearch}
                        />
                    </div>

                    {visibleProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                No products found matching your search.
                            </p>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {visibleProducts.map((product, index) => (
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
            </section>
        </DefaultLayout>
    );
};

export default ProductsServicesPage;
