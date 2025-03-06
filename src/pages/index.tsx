import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { motion } from "framer-motion";

const LandingPage = () => {
  const products = [
    { name: "iPhone Insurance", image: "https://http2.mlstatic.com/D_NQ_NP_896424-MLA71783367608_092023-O.webp" },
    { name: "Cell Phone Insurance", image: "https://http2.mlstatic.com/D_NQ_NP_896424-MLA71783367608_092023-O.webp" },
    { name: "Chromebook Insurance", image: "https://http2.mlstatic.com/D_NQ_NP_896424-MLA71783367608_092023-O.webp" },
    { name: "Laptop Insurance", image: "https://http2.mlstatic.com/D_NQ_NP_896424-MLA71783367608_092023-O.webp" },
    { name: "iPad Insurance", image: "https://http2.mlstatic.com/D_NQ_NP_896424-MLA71783367608_092023-O.webp" },
    { name: "Tablet Insurance", image: "https://http2.mlstatic.com/D_NQ_NP_896424-MLA71783367608_092023-O.webp" },
    { name: "Camera Insurance", image: "https://http2.mlstatic.com/D_NQ_NP_896424-MLA71783367608_092023-O.webp" },
    { name: "Gaming System Insurance", image: "https://http2.mlstatic.com/D_NQ_NP_896424-MLA71783367608_092023-O.webp" },
    { name: "iPod Insurance", image: "https://http2.mlstatic.com/D_NQ_NP_896424-MLA71783367608_092023-O.webp" },
    { name: "eReader Insurance", image: "https://http2.mlstatic.com/D_NQ_NP_896424-MLA71783367608_092023-O.webp" },
    { name: "Apple Watch Insurance", image: "https://http2.mlstatic.com/D_NQ_NP_896424-MLA71783367608_092023-O.webp" },
    { name: "Smartwatch Insurance", image: "https://http2.mlstatic.com/D_NQ_NP_896424-MLA71783367608_092023-O.webp" },
  ];

  const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 1 } } };
  const slideUp = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.8 } } };
  const slideRight = { hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1, transition: { duration: 0.8 } } };

  return (
    <DefaultLayout>
      <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-r from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 text-white mb-12" style={{ background: 'radial-gradient(#ab65655e, #e0e4ee)' }}>
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center">
            {/* Left Content */}
            <motion.div
              className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <motion.div className="flex justify-center mb-4" variants={slideUp}>
                <span className="text-green-600 font-semibold dark:text-green-400">Trustpilot</span>
                <span className="ml-2 text-yellow-400">⭐⭐⭐⭐☆</span>
              </motion.div>
              <motion.h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight" variants={slideUp}>
                Your Trusted Partner <br /> for Electronic Device Insurance
              </motion.h1>
              <motion.p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6" variants={slideUp} transition={{ delay: 0.2 }}>
                Reliable coverage for all your devices, backed by decades of expertise.
              </motion.p>
              <motion.div className="flex justify-center space-x-4 mb-6" variants={slideUp} transition={{ delay: 0.4 }}>
                <Button color="primary" size="md" className="px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow dark:bg-blue-600 dark:hover:bg-blue-700">
                  Get Individual Quotes
                </Button>
                <Button color="danger" size="md" className="px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow dark:bg-red-600 dark:hover:bg-red-700">
                  K-12 School Quotes
                </Button>
              </motion.div>
              <motion.div className="flex justify-center gap-4 items-center mb-6" variants={slideUp} transition={{ delay: 0.6 }}>
                <Image src="https://via.placeholder.com/150?text=Damaged+Laptop" alt="Damaged Laptop" className="w-20 h-20 object-cover rounded-lg shadow-md" />
                <Image src="https://via.placeholder.com/150?text=Damaged+Phone" alt="Damaged Phone" className="w-16 h-16 object-cover rounded-lg shadow-md" />
                <Image src="https://via.placeholder.com/150?text=Damaged+Tablet" alt="Damaged Tablet" className="w-18 h-18 object-cover rounded-lg shadow-md" />
              </motion.div>
              <motion.div className="flex justify-center gap-4 text-sm text-gray-700 dark:text-gray-300" variants={slideUp} transition={{ delay: 0.8 }}>
                <div className="flex items-center bg-yellow-100 dark:bg-yellow-800 px-4 py-2 rounded-full shadow-md">
                  <span className="mr-2">✅</span> +50 Years in the Business
                </div>
                <div className="flex items-center bg-blue-100 dark:bg-blue-800 px-4 py-2 rounded-full shadow-md">
                  <span className="mr-2">👍</span> Backed by an A Best Rated Underwriter
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side (Images with Animation) */}
            <div className="w-full md:w-1/2 relative flex justify-center">
              <motion.img
                src="https://purepng.com/public/uploads/large/purepng.com-apple-iphone-xappleapple-iphonephonesmartphonemobile-devicetouch-screeniphone-xiphone-10electronicsobjects-2515306895701eqxj.png"
                alt="Hero Image"
                initial="hidden"
                animate="visible"
                className="w-64 md:w-96 rotate-12"
                variants={slideRight}
                style={{ top: '4rem', left: '12rem', width: '17rem', transform: 'rotate(25deg) !important', position: 'absolute' }}
              />
              <motion.img
                src="https://purepng.com/public/uploads/large/purepng.com-laptop-notebooklaptopsnotebooknotebook-computerclamshell-1701528355017rdiqu.png"
                alt="Hero Image"
                initial="hidden"
                animate="visible"
                variants={slideRight}
                transition={{ delay: 0.2 }}
                style={{ top: '-17rem', left: '15rem', width: '20rem', transform: 'rotate(5deg)', position: 'absolute' }}
              />
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12 bg-white dark:bg-gray-800">
          <div className="max-w-5xl mx-auto px-4">
            <motion.h2
              className="text-2xl font-semibold text-gray-800 dark:text-white mb-8 text-center"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              Our Products
            </motion.h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product, index) => (
                <motion.div
                  key={index}
                  className="p-3 text-center shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg border border-gray-100 dark:border-gray-700 dark:bg-gray-700"
                  initial="hidden"
                  animate="visible"
                  variants={slideUp}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardBody>
                      <Image
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 mx-auto mb-2 object-contain rounded-md"
                      />
                      <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">{product.name}</p>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
};

export default LandingPage;