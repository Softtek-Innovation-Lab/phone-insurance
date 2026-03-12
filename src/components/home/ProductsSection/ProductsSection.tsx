import { useRef, useEffect } from 'react';
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import './ProductsSection.css';
import { useNavigate } from 'react-router-dom';
import { products } from '@/data/products';
import { useTranslation } from 'react-i18next';

const ProductsSection = () => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);
    const navigate = useNavigate();

    // Mostrar solo los productos específicos: Phone, iPhone, Laptop, Camera e iPad
    const featuredProducts = products.filter(product => 
        product.name === "Phone Insurance" || 
        product.name === "iPhone Insurance" || 
        product.name === "Laptop Insurance" || 
        product.name === "Home Insurance"
    );

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

    return (
        <section
            id='get-insurance'
            className="py-16 bg-white dark:bg-gray-800 products-section" ref={sectionRef}>
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12 product-title">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                        {t("productsSection.title")}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        {t("productsSection.subtitle")}
                    </p>
                </div>

                <div className="products-grid">
                    {featuredProducts.map((product, index) => (
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
                                        {t("productsSection.getInsurance")}
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
