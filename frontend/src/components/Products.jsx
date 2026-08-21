import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, MessageCircle } from "lucide-react";
import { api, waLink } from "@/api";

const CATEGORIES = ["All", "Covers", "Glass", "Displays", "Back Panels", "Earbuds", "Headphones", "Speakers"];

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products")
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <section id="products" className="relative py-24 sm:py-32" data-testid="products-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div>
            <p className="font-mono2 text-xs uppercase tracking-[0.3em] text-[#FFB800] mb-3">02 · The Gear Wall</p>
            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight leading-none" data-testid="products-heading">
              Tech Gear<br />In Stock
            </h2>
          </div>
          <p className="text-sm text-[#8A90A3] max-w-xs leading-relaxed">
            Every product is hand-tested at the bench before it hits the shelf. Prices include free fitting.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-10" data-testid="product-category-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-full font-mono2 text-xs uppercase tracking-wider transition-all duration-300 ${
                active === cat
                  ? "bg-[#FFB800] text-[#0B0C10] font-bold"
                  : "border border-[#282C3D] text-[#8A90A3] hover:border-[#FFB800] hover:text-[#FFB800]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
              
       {loading ? (
          <p className="font-mono2 text-sm text-[#8A90A3]" data-testid="products-loading">Loading stock…</p>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.article
                  layout
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-[#12141C] border border-[#282C3D] hover:border-[#FFB800] transition-colors duration-300 rounded-2xl overflow-hidden group shadow-xl"
                  data-testid={`product-card-${p.id}`}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12141C] via-transparent to-transparent" />
                    {p.badge && (
                      <span className="absolute top-3 left-3 bg-[#FFB800] text-[#0B0C10] font-mono2 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        {p.badge}
                      </span>
                    )}
                    <span className="absolute top-3 right-3 bg-[#0B0C10]/70 backdrop-blur-md text-[#00E5FF] font-mono2 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-[#282C3D]">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-xl font-bold tracking-tight">{p.name}</h3>
                    <p className="text-sm text-[#8A90A3] mt-2 leading-relaxed line-clamp-2">{p.description}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="font-heading text-2xl font-extrabold text-[#FFB800]" data-testid={`product-price-${p.id}`}>
                        ₹{p.price.toLocaleString("en-IN")}
                      </span>
                      <a
                        href={waLink(`Hi Aslam! I want to buy: ${p.name} (₹${p.price})`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`product-enquire-${p.id}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#282C3D] font-mono2 text-xs uppercase tracking-wider hover:border-[#00E5FF] hover:text-[#00E5FF] transition-colors duration-300"
                      >
                        {p.in_stock ? <MessageCircle className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                        {p.in_stock ? "Enquire" : "Notify Me"}
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="font-mono2 text-sm text-[#8A90A3]" data-testid="products-empty">No products in this category yet.</p>
        )}
      </div>
    </section>
  );
};