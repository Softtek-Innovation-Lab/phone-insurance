import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: {
                translation: {
                    // Navbar
                    contactUs: 'Contact Us',
                    findBroker: 'Find a Broker',
                    getInsuranceNav: 'Get Insurance',
                    industrySolutions: 'Industry Solutions',
                    productsAndServices: 'Products & Services',
                    whyTravelers: 'Why Travelers',
                    brokers: 'Brokers',
                    claimsCentre: 'Claims Centre',
                    logout: 'Logout',
                    login: 'Login',

                    // Cart
                    cart: {
                        nav: 'Cart',
                        title: 'Your Cart',
                        step: 'Cart',
                        coverage: 'Coverage',
                        serial: 'Serial Number',
                        state: 'State',
                        term: 'Policy Term',
                        deductible: 'Deductible',
                        riskFactor: 'Risk Factor',
                        perYear: 'per year',
                        remove: 'Remove',
                        continueShopping: 'Continue Shopping',
                        clearCart: 'Clear Cart',
                        proceedToCheckout: 'Proceed to Checkout',
                    },
                    checkout: {
                        step: 'Checkout',
                    },
                    confirmation: {
                        step: 'Confirmation',
                    },

                    // Profile Page
                    profileTabsAria: 'User Profile Tabs',
                    profileDetailsTab: 'Profile Details',
                    myClaimsTab: 'My Claims',
                    personalInfo: 'Personal Information',
                    contactInfo: 'Contact Information',

                    // Claims Centre Page
                    claimsCentreTabsAria: 'Claims Centre Tabs',
                    newAccidentTab: 'New Accident',
                    myClaimsSectionPlaceholder: 'My Claims section (to be implemented).',

                    // Hero Section
                    heroTitle: 'Protect Your Devices with Confidence',
                    heroSubtitle: 'Affordable, reliable insurance for your phone, laptop, and more. Get covered in minutes.',
                    getStarted: 'Get Started',
                    learnMore: 'Learn More',

                    // Products Section
                    productsTitle: 'Our Insurance Products',

                    // Stats Section
                    stat1: 'Claim Approval Rate',
                    stat2: 'Support Availability',
                    stat3: 'Devices Insured',
                    stat4: 'Customer Rating',

                    // Premium Calculator
                    premiumCalculatorTitle: 'Instant Premium Calculator',
                    productLabel: 'Select Product',
                    deviceValueLabel: 'Device Value (USD)',
                    calculatePremium: 'Calculate Premium',

                    // Testimonials
                    testimonialsTitle: 'What Our Customers Say',
                    testimonial1Name: 'Juan Perez',
                    testimonial1Text: 'The claim process was fast and easy. Highly recommended!',
                    testimonial2Name: 'Maria Gomez',
                    testimonial2Text: 'Great customer service and affordable prices.',
                    testimonial3Name: 'Carlos Ruiz',
                    testimonial3Text: 'I got my phone replaced in just a few days!',

                    // FAQ
                    faqTitle: 'Frequently Asked Questions',
                    faq1q: 'How do I file a claim?',
                    faq1a: 'You can file a claim online through our Claims Centre in just a few steps.',
                    faq2q: 'What devices are covered?',
                    faq2a: 'We cover phones, laptops, tablets, smartwatches, and more.',
                    faq3q: 'How long does it take to process a claim?',
                    faq3a: 'Most claims are processed within 48 hours after submission.',
                    faq4q: 'Can I cancel my policy anytime?',
                    faq4a: 'Yes, you can cancel your policy at any time with no penalty.',
                    faq5q: 'Is there a waiting period before coverage begins?',
                    faq5a: 'Coverage begins immediately upon policy activation for mechanical breakdown. For theft and accidental damage, there is a 48-hour waiting period to prevent fraud.',
                    faq6q: 'How many claims can I make per year?',
                    faq6a: 'Most policies allow 2-3 claims per year, depending on your coverage level. Unlimited claims are available with our premium plans.',
                }
            },
            es: {
                translation: {
                    // Navbar
                    contactUs: 'Contáctanos',
                    findBroker: 'Buscar un corredor',
                    getInsuranceNav: 'Contratar Seguro',
                    industrySolutions: 'Soluciones para la industria',
                    productsAndServices: 'Productos y Servicios',
                    whyTravelers: 'Por qué Travelers',
                    brokers: 'Corredores',
                    claimsCentre: 'Centro de Siniestros',
                    logout: 'Cerrar sesión',
                    login: 'Iniciar sesión',

                    // Cart
                    cart: {
                        nav: 'Carrito',
                        title: 'Tu Carrito',
                        step: 'Carrito',
                        coverage: 'Cobertura',
                        serial: 'Número de serie',
                        state: 'Provincia',
                        term: 'Plazo de la póliza',
                        deductible: 'Deducible',
                        riskFactor: 'Nivel de riesgo',
                        perYear: 'por año',
                        remove: 'Eliminar',
                        continueShopping: 'Seguir comprando',
                        clearCart: 'Vaciar carrito',
                        proceedToCheckout: 'Ir a pagar',
                    },
                    checkout: {
                        step: 'Pagar',
                    },
                    confirmation: {
                        step: 'Confirmación',
                    },

                    // Profile Page
                    profileTabsAria: 'Pestañas de perfil de usuario',
                    profileDetailsTab: 'Detalles del perfil',
                    myClaimsTab: 'Mis Siniestros',
                    personalInfo: 'Información personal',
                    contactInfo: 'Información de contacto',

                    // Claims Centre Page
                    claimsCentreTabsAria: 'Pestañas del Centro de Siniestros',
                    newAccidentTab: 'Nuevo Siniestro',
                    myClaimsSectionPlaceholder: 'Sección de siniestros (pendiente de implementación).',

                    // Hero Section
                    heroTitle: 'Protege tus dispositivos con confianza',
                    heroSubtitle: 'Seguro asequible y confiable para tu teléfono, laptop y más. Obtén cobertura en minutos.',
                    getStarted: 'Comenzar',
                    learnMore: 'Saber más',

                    // Products Section
                    productsTitle: 'Nuestros Productos de Seguro',

                    // Stats Section
                    stat1: 'Tasa de aprobación de siniestros',
                    stat2: 'Atención 24/7',
                    stat3: 'Dispositivos asegurados',
                    stat4: 'Calificación de clientes',

                    // Premium Calculator
                    premiumCalculatorTitle: 'Calculadora de Prima Instantánea',
                    productLabel: 'Selecciona el producto',
                    deviceValueLabel: 'Valor del dispositivo (USD)',
                    calculatePremium: 'Calcular Prima',

                    // Testimonials
                    testimonialsTitle: 'Lo que dicen nuestros clientes',
                    testimonial1Name: 'Juan Perez',
                    testimonial1Text: 'El proceso de siniestro fue rápido y sencillo. ¡Muy recomendable!',
                    testimonial2Name: 'Maria Gomez',
                    testimonial2Text: 'Excelente atención al cliente y precios accesibles.',
                    testimonial3Name: 'Carlos Ruiz',
                    testimonial3Text: '¡Me reemplazaron el teléfono en solo unos días!',

                    // FAQ
                    faqTitle: 'Preguntas Frecuentes',
                    faq1q: '¿Cómo presento un siniestro?',
                    faq1a: 'Puedes presentar un siniestro en línea a través de nuestro Centro de Siniestros en pocos pasos.',
                    faq2q: '¿Qué dispositivos están cubiertos?',
                    faq2a: 'Cubrimos teléfonos, laptops, tablets, relojes inteligentes y más.',
                    faq3q: '¿Cuánto tarda en procesarse un siniestro?',
                    faq3a: 'La mayoría de los siniestros se procesan en 48 horas después de la presentación.',
                    faq4q: '¿Puedo cancelar mi póliza en cualquier momento?',
                    faq4a: 'Sí, puedes cancelar tu póliza en cualquier momento sin penalización.',
                    faq5q: '¿Hay un período de espera antes de que comience la cobertura?',
                    faq5a: 'La cobertura comienza inmediatamente después de la activación de la póliza para fallas mecánicas. Para robo y daño accidental, hay un período de espera de 48 horas para prevenir fraudes.',
                    faq6q: '¿Cuántos siniestros puedo presentar por año?',
                    faq6a: 'La mayoría de las pólizas permiten 2-3 siniestros por año, según tu nivel de cobertura. Los planes premium ofrecen siniestros ilimitados.',
                }
            }
        }
    });

export default i18n;