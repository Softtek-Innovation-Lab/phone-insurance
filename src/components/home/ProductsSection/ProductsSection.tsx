import { useState, useRef, useEffect } from 'react';
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import './ProductsSection.css';
import { useNavigate } from 'react-router-dom';
import { products } from '@/data/products';
 
const ProductsSection = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [visibleProducts, setVisibleProducts] = useState(products);
    const sectionRef = useRef(null);
    const navigate = useNavigate();

    const categories = [
        { name: "Mobile", icon: "📱" },
        { name: "Computers", icon: "💻" },
        { name: "Tablets", icon: "📟" },
        { name: "Wearables", icon: "⌚" },
        { name: "Other", icon: "📷" },
    ];

    useEffect(() => {
        if (activeCategory === 'All') {
            setVisibleProducts(products);
        } else {
            setVisibleProducts(products.filter(product => product.category === activeCategory));
        }
    }, [activeCategory]);

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

    return (
        <section className="py-16 bg-white dark:bg-gray-800 products-section" ref={sectionRef}>
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12 product-title">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                        Our Insurance Products
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
                            key={index}
                            className={`category-btn ${activeCategory === category.name ? 'active' : ''}`}
                            style={{ "--delay": `${index * 0.1}s` } as React.CSSProperties}
                            onClick={() => setActiveCategory(category.name)}
                        >
                            <span className="mr-2">{category.icon}</span>
                            {category.name}
                        </button>
                    ))}
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
                                        onClick={() => navigate('/get-insurance', { state: { product } })}
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