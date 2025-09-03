'use client';
import Image from "next/image";
import { motion } from "framer-motion";
import { User, Mail } from "lucide-react";

const consultants = [
  {
    name: "Akoto Ankrah",
    specialty: "Motivator",
    email: "akotoankrah@gmail.com",
    image: "https://i.postimg.cc/7LyCXQWB/consultant-1.jpg"
  },
  {
    name: "Ataa Williams",
    specialty: "Community Moderator",
    email: "attawilliams@hotmail.com",
    image: "https://i.postimg.cc/cCjC3D3B/consultant-2.jpg"
  },
  {
    name: "Philip Appiah",
    specialty: "Peer Supporter",
    email: "philipappiah@gmail.com",
    image: "https://i.postimg.cc/sf0vb2LG/consultant-3.jpg"
  },
  {
    name: "Alice Johnson",
    specialty: "Anonymity Advocate",
    email: "alicejohnson@yahoo.com",
    image: "https://i.postimg.cc/NMsKv2Ym/consultant-4.jpg"
  },
];

export default function ConsultantsCarousel() {
  return (
    <section className="relative w-full py-20 bg-gradient-to-br from-teal-50 via-white to-blue-100 overflow-hidden">
      {/* Wave SVG divider for modern look */}
      <div className="absolute top-0 left-0 w-full -mt-20 pointer-events-none z-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-28">
          <path fill="#2dd4bf" fillOpacity="0.1" d="M0,32L60,42.7C120,53,240,75,360,101.3C480,128,600,160,720,149.3C840,139,960,85,1080,80C1200,75,1320,117,1380,138.7L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
        </svg>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 drop-shadow-lg">
         Meet Our Motivators & Community Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 overflow-x-auto">
          {consultants.map((c, i) => (
            <motion.div
              key={c.email}
              whileHover={{
                y: -10,
                boxShadow: "0 16px 32px 0 rgba(34,197,94,0.12), 0 0 0 4px #2dd4bf44"
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white/80 backdrop-blur-md border border-teal-100 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:border-teal-400"
              style={{
                minWidth: 260,
              }}
            >
              <div className="relative mb-4">
                <span className="absolute inset-0 rounded-full ring-4 ring-teal-200 group-hover:ring-teal-400 transition"></span>
                <Image
                  src={c.image}
                  alt={c.name}
                  width={96}
                  height={96}
                  className="rounded-full object-cover border-4 border-white shadow-md relative z-10"
                  priority={i === 0}
                />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">{c.name}</h3>
              <div className="flex items-center justify-center gap-1 mb-2">
                <User className="w-4 h-4 text-teal-400 mr-1" />
                <span className="text-sm font-medium text-teal-600">{c.specialty}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Mail className="w-4 h-4" />
                <span>{c.email}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}