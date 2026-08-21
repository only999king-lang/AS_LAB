import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, LogOut, Wrench, Package, Inbox } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/api";

const CATEGORIES = ["Covers", "Glass", "Displays", "Back Panels", "Earbuds", "Headphones", "Speakers"];
const emptyForm = { name: "", category: "Covers", price: "", image: "", description: "", badge: "", in_stock: true };

export default function AdminDashboard() {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const [p, e] = await Promise.all([api.get("/products"), api.get("/enquiries")]);
      setProducts(p.data);
      setEnquiries(e.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("aslabs_token");
        navigate("/admin/login");
      }
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("aslabs_token")) {
      navigate("/admin/login");
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    localStorage.removeItem("aslabs_token");
    navigate("/admin/login");
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: parseFloat(form.price) };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product added");
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      load();
    } catch {
      toast.error("Save failed");
    }
  };

  const edit = (p) => {
    setForm({ name: p.name, category: p.category, price: p.price, image: p.image, description: p.description, badge: p.badge, in_stock: p.in_stock });
    setEditingId(p.id);
    setShowForm(true);
  };

  const remove = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
     };

  const removeEnquiry = async (id) => {
    await api.delete(`/enquiries/${id}`);
    load();
  };

  const inputCls =
    "w-full bg-[#0B0C10] border border-[#282C3D] rounded-xl px-4 py-2.5 text-sm text-[#F4F5F7] placeholder-[#8A90A3]/60 focus:outline-none focus:border-[#FFB800] transition-colors duration-300";

  return (
    <div className="min-h-screen" data-testid="admin-dashboard">
      <header className="border-b border-[#282C3D] bg-[#0E1016]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5" data-testid="admin-brand">
            <span className="w-8 h-8 rounded-lg bg-[#FFB800] flex items-center justify-center">
              <Wrench className="w-4 h-4 text-[#0B0C10]" strokeWidth={2.5} />
            </span>
            <span className="font-heading font-extrabold uppercase tracking-tight text-sm">
              AS<span className="text-[#FFB800]">Labs</span>
              <span className="ml-2 font-mono2 text-[10px] text-[#8A90A3] tracking-[0.25em]">ADMIN</span>
            </span>
          </Link>
          <button
            onClick={logout}
            data-testid="admin-logout-button"
            className="flex items-center gap-2 font-mono2 text-xs uppercase tracking-wider text-[#8A90A3] hover:text-[#EF4444] transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-3 mb-8" data-testid="admin-tabs">
          <button
            onClick={() => setTab("products")}
            data-testid="admin-tab-products"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-mono2 text-xs uppercase tracking-wider transition-colors ${tab === "products" ? "bg-[#FFB800] text-[#0B0C10] font-bold" : "border border-[#282C3D] text-[#8A90A3]"}`}
          >
            <Package className="w-4 h-4" /> Products ({products.length})
          </button>
          <button
            onClick={() => setTab("enquiries")}
            data-testid="admin-tab-enquiries"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-mono2 text-xs uppercase tracking-wider transition-colors ${tab === "enquiries" ? "bg-[#FFB800] text-[#0B0C10] font-bold" : "border border-[#282C3D] text-[#8A90A3]"}`}
          >
            <Inbox className="w-4 h-4" /> Enquiries ({enquiries.length})
          </button>
        </div>

        {tab === "products" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button
              onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm); }}
              data-testid="admin-add-product-button"
              className="mb-6 flex items-center gap-2 px-5 py-2.5 bg-[#FFB800] text-[#0B0C10] font-heading font-bold uppercase text-xs tracking-wide rounded-full hover:bg-[#E0A200] transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
            
                        {showForm && (
              <motion.form
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={save}
                className="bg-[#12141C] border border-[#282C3D] rounded-2xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
                data-testid="admin-product-form"
              >
                <input required placeholder="Product name" data-testid="admin-product-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
                <select data-testid="admin-product-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <input required type="number" min="0" step="1" placeholder="Price (₹)" data-testid="admin-product-price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} />
                <input placeholder="Badge (e.g. New)" data-testid="admin-product-badge" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className={inputCls} />
                <input required placeholder="Image URL" data-testid="admin-product-image" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={`${inputCls} sm:col-span-2`} />
                <textarea placeholder="Description" rows={2} data-testid="admin-product-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputCls} sm:col-span-2 resize-none`} />
                <label className="flex items-center gap-2 text-sm text-[#8A90A3]">
                  <input type="checkbox" data-testid="admin-product-instock" checked={form.in_stock} onChange={(e) => setForm({ ...form, in_stock: e.target.checked })} className="accent-[#FFB800]" />
                  In stock
                </label>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-[#282C3D] rounded-full font-mono2 text-xs uppercase tracking-wider text-[#8A90A3]">Cancel</button>
                  <button type="submit" data-testid="admin-product-save" className="px-5 py-2.5 bg-[#FFB800] text-[#0B0C10] rounded-full font-mono2 text-xs font-bold uppercase tracking-wider">
                    {editingId ? "Update" : "Save"}
                  </button>
                </div>
              </motion.form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="admin-product-list">
              {products.map((p) => (
                <div key={p.id} className="bg-[#12141C] border border-[#282C3D] rounded-2xl overflow-hidden" data-testid={`admin-product-${p.id}`}>
                  <img src={p.image} alt={p.name} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-heading font-bold">{p.name}</h3>
                        <p className="font-mono2 text-[10px] uppercase tracking-wider text-[#8A90A3] mt-1">{p.category} · ₹{p.price.toLocaleString("en-IN")}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => edit(p)} data-testid={`admin-edit-${p.id}`} className="w-8 h-8 rounded-lg border border-[#282C3D] flex items-center justify-center text-[#00E5FF] hover:border-[#00E5FF] transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => remove(p.id)} data-testid={`admin-delete-${p.id}`} className="w-8 h-8 rounded-lg border border-[#282C3D] flex items-center justify-center text-[#EF4444] hover:border-[#EF4444] transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === "enquiries" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4" data-testid="admin-enquiry-list">
            {enquiries.length === 0 && (
              <p className="font-mono2 text-sm text-[#8A90A3]" data-testid="admin-enquiries-empty">No enquiries yet.</p>
            )}
            {enquiries.map((enq) => (
              <div key={enq.id} className="bg-[#12141C] border border-[#282C3D] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" data-testid={`admin-enquiry-${enq.id}`}>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-heading font-bold">{enq.name}</h3>
                    <span className="font-mono2 text-[10px] uppercase tracking-wider bg-[#1A1D28] border border-[#282C3D] text-[#00E5FF] px-2.5 py-1 rounded-full">{enq.interest}</span>
                  </div>
                  <a href={`tel:${enq.phone}`} className="font-mono2 text-sm text-[#FFB800] mt-1 inline-block">{enq.phone}</a>
                  <p className="text-sm text-[#8A90A3] mt-2">{enq.message}</p>
                  <p className="font-mono2 text-[10px] text-[#8A90A3]/60 mt-2">{new Date(enq.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => removeEnquiry(enq.id)} data-testid={`admin-enquiry-delete-${enq.id}`} className="w-9 h-9 shrink-0 rounded-lg border border-[#282C3D] flex items-center justify-center text-[#EF4444] hover:border-[#EF4444] transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}