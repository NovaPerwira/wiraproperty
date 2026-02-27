import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Grid as GridIcon } from 'lucide-react'; // Menggunakan icon matahari sebagai contoh hiasan label

// Data dummy untuk galeri. Ganti src dan link dengan data aslimu.
const galleryItems = [
  {
    id: 1,
    title: "Earth Sentinels",
    src: "/api/placeholder/800/800", // Ganti dengan gambar besar kiri
    link: "/projects/earth-sentinels",
    // Class khusus agar item pertama melebar 2 kolom dan 2 baris
    gridClass: "lg:col-span-2 lg:row-span-2",
  },
  {
    id: 2,
    title: "Light Portal",
    src: "/api/placeholder/400/400",
    link: "/projects/light-portal",
    gridClass: "",
  },
  {
    id: 3,
    title: "Night Sculpture",
    src: "/api/placeholder/400/400",
    link: "/projects/night-sculpture",
    gridClass: "",
  },
  {
    id: 4,
    title: "The Dome",
    src: "/api/placeholder/400/400",
    link: "/projects/the-dome",
    gridClass: "",
  },
  {
    id: 5,
    title: "Bamboo Structure",
    src: "/api/placeholder/400/400",
    link: "/projects/bamboo-structure",
    gridClass: "", // Item terakhir akan memiliki tombol "See all"
  },
];

const GallerySection = () => {
  // Variasi animasi stagger untuk container
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  // Variasi animasi fade in untuk setiap item
  const itemVariant: any = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="bg-white py-24 w-full flex justify-center relative z-10">
      <div className="w-full max-w-[1440px] mx-auto px-8 lg:px-16">

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          // Setup CSS Grid: 
          // Di mobile: 1 kolom.
          // Di Laptop (lg): 4 kolom, 2 baris.
          // Set tinggi fix di laptop agar bentuknya terjaga (lg:h-[640px]).
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 lg:gap-6 min-h-[800px] lg:min-h-[640px]"
        >
          {galleryItems.map((item, index) => {
            const isLastItem = index === galleryItems.length - 1;

            return (
              <motion.a
                key={item.id}
                variants={itemVariant}
                href={item.link} // Direct link untuk setiap foto
                // Gunakan class 'group' untuk trigger hover effect
                className={`relative block rounded-[32px] overflow-hidden group ${item.gridClass} h-64 md:h-full`}
              >
                {/* Gambar Latar */}
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />

                {/* Overlay Gelap saat Hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Label Judul di Tengah (Muncul saat hover) */}
                {/* Kita sembunyikan label hover ini KHUSUS untuk item terakhir, karena dia punya tombol statis */}
                {!isLastItem && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100">
                    <div className="bg-white/90 backdrop-blur-md text-[#1a2320] px-6 py-3 rounded-full text-sm md:text-base font-medium flex items-center gap-2 shadow-sm">
                      <Sun size={18} className="text-[#1a2320]" /> {/* Icon Hiasan */}
                      {item.title}
                    </div>
                  </div>
                )}

                {/* Tombol "See all photos" (Hanya di item terakhir, selalu terlihat) */}
                {isLastItem && (
                  <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6">
                    <div className="bg-white text-[#1a2320] px-5 py-2.5 rounded-full text-[13px] font-medium flex items-center gap-2 shadow-md hover:bg-[#f0f0f0] transition-colors">
                      See all {galleryItems.length} photos
                      <GridIcon size={16} />
                    </div>
                  </div>
                )}
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default GallerySection;