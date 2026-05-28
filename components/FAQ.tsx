"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "¿De qué materiales están hechas las sandalias?",
    answer: "Nuestras sandalias están confeccionadas a mano con materiales premium, incluyendo cueros sintéticos de alta calidad, yute, fibras naturales y suelas ergonómicas diseñadas para brindar máximo confort y durabilidad."
  },
  {
    question: "¿Cómo sé cuál es mi talla ideal?",
    answer: "Nuestras hormas son estándar. Te recomendamos pedir la talla que usas regularmente. Si estás entre dos tallas, te sugerimos elegir la mayor para garantizar tu comodidad."
  },
  {
    question: "¿Realizan envíos a todo el país?",
    answer: "Sí, hacemos envíos a toda Colombia. El envío es gratuito por compras superiores a $200.000 COP. Los tiempos de entrega varían entre 2 y 5 días hábiles dependiendo de la ciudad de destino."
  },
  {
    question: "¿Tienen política de cambios y devoluciones?",
    answer: "¡Por supuesto! Tienes hasta 15 días calendario después de recibir tu pedido para solicitar un cambio por talla o defectos de fábrica, siempre y cuando el producto no haya sido usado y se encuentre en su empaque original."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-[#FAF6F0]">
      <div className="container mx-auto px-6 md:px-12 max-w-3xl">
        <div className="text-center mb-16">
          <span className="text-secondary font-medium tracking-[0.3em] uppercase text-[10px] mb-4 block">Soporte y Dudas</span>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">Preguntas Frecuentes</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm transition-shadow hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-8 py-6 flex justify-between items-center bg-white"
              >
                <span className="font-serif text-lg text-foreground pr-8">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-primary shrink-0"
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-8 pb-6 pt-0 text-foreground/60 font-light leading-relaxed border-t border-primary/5 mt-2">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
