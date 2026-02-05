import { useState, useRef, useEffect } from 'react';
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import './ProductsSection.css';
import { useNavigate } from 'react-router-dom';
import { products } from '@/data/products';
import { SearchBar } from '@/components/ui/SearchBar';

const ProductsSection = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [visibleProducts, setVisibleProducts] = useState(products);
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
        // Filtrar productos excluyendo Home Insurance
        let filtered = products.filter(product => !product.isHomeInsurance);

        // Filter by category
        if (activeCategory !== 'All') {
            filtered = filtered.filter(product => product.category === activeCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setVisibleProducts(filtered);
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
        // Redirigir a la página específica de seguros de hogar
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
        <section
            id='get-insurance'
            className="py-16 bg-white dark:bg-gray-800 products-section" ref={sectionRef}>
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12 product-title">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                        Our most popular insurance products
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Comprehensive coverage for all your electronic devices, with flexible plans tailored to your needs.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mb-10">
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

                <div className="mb-10">
                    <SearchBar
                        placeholder="Search for products or categories..."
                        onSearch={handleSearch}
                    />
                </div>

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
            </div>
        </section>
    );
};

export default ProductsSection;
