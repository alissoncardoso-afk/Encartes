
import { useState, useRef, useCallback } from "react";

const DEFAULT_COLORS = { primary: "#E8000D", accent: "#FFD600" };

function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function ImgUpload({ label, onImg, preview, icon = "📁" }) {
  const inp = useRef();
  return (
    <div
      onClick={() => inp.current.click()}
      style={{
        border: "2px dashed #333", borderRadius: 8, padding: 12,
        textAlign: "center", cursor: "pointer", marginBottom: 10,
        background: "#111", transition: "border-color .2s",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#FFD600"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#333"}
    >
      <input ref={inp} type="file" accept="image/*" style={{ display: "none" }}
        onChange={async e => { if (e.target.files[0]) onImg(await toBase64(e.target.files[0])); }} />
      {preview
        ? <img src={preview} alt="" style={{ maxHeight: 70, objectFit: "contain", borderRadius: 4 }} />
        : <p style={{ color: "#666", fontSize: 12, margin: 0 }}>{icon} {label}</p>}
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#777", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{label}</div>
      {props.textarea
        ? <textarea rows={2} style={inputStyle} {...props} />
        : <input style={inputStyle} {...props} />}
    </div>
  );
}
const inputStyle = {
  width: "100%", background: "#111", border: "1px solid #2a2a2a",
  borderRadius: 6, color: "#f0f0f0", fontFamily: "inherit",
  fontSize: 13, padding: "7px 10px", outline: "none", boxSizing: "border-box",
};

// ── ENCARTE ──
function Encarte({ config, products, cols }) {
  const { primary, accent, storeName, tagline, promoTitle, promoPeriod, footer, logo } = config;
  return (
    <div style={{
      width: 794, minHeight: 1000, background: "#fff", color: "#111",
      fontFamily: "'Arial', sans-serif", position: "relative", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 28px 16px", display: "flex", alignItems: "center",
        justifyContent: "space-between", borderBottom: `4px solid ${primary}`,
        background: "#fff",
      }}>
        <div>
          {logo && <img src={logo} alt="" style={{ maxHeight: 56, maxWidth: 160, objectFit: "contain", display: "block", marginBottom: 4 }} />}
          <div style={{ fontWeight: 900, fontSize: 32, letterSpacing: 3, lineHeight: 1, color: primary, fontFamily: "Impact, Arial Black, sans-serif" }}>
            {(storeName || "SUA LOJA").toUpperCase()}
          </div>
          {tagline && <div style={{ fontSize: 11, color: "#777", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>{tagline}</div>}
        </div>
        <div style={{ background: primary, color: "#fff", padding: "10px 18px", borderRadius: 6, textAlign: "center" }}>
          <div style={{ fontFamily: "Impact, Arial Black, sans-serif", fontSize: 22, letterSpacing: 3, lineHeight: 1 }}>
            {(promoTitle || "OFERTAS").split(" ").slice(0, 2).join(" ").toUpperCase()}
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, opacity: .9 }}>
            {(promoTitle || "DA SEMANA").split(" ").slice(2).join(" ").toUpperCase() || "DA SEMANA"}
          </div>
        </div>
      </div>

      {/* Promo bar */}
      <div style={{ background: primary, color: "#fff", padding: "7px 28px", display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontFamily: "Impact, Arial Black, sans-serif", fontSize: 16, letterSpacing: 3 }}>
          🔥 {(promoTitle || "OFERTAS DA SEMANA").toUpperCase()}
        </span>
        {promoPeriod && <span style={{ fontSize: 11, fontWeight: 700, opacity: .9 }}>📅 Válido: {promoPeriod}</span>}
      </div>

      {/* Grid */}
      <div style={{
        padding: "16px 24px",
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 14,
      }}>
        {products.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#bbb", fontSize: 14 }}>
            Adicione produtos para montar seu encarte →
          </div>
        )}
        {products.map(p => (
          <div key={p.id} style={{
            border: `${p.highlight ? 3 : 2}px solid ${p.highlight ? primary : "#e8e8e8"}`,
            borderRadius: 8, overflow: "hidden", background: "#fff", position: "relative",
          }}>
            {p.badge && (
              <div style={{
                position: "absolute", top: 6, right: 6,
                background: accent, color: "#000",
                fontWeight: 900, fontSize: 11, padding: "2px 8px", borderRadius: 3,
              }}>{p.badge}</div>
            )}
            {p.img
              ? <img src={p.img} alt={p.name} style={{ width: "100%", aspectRatio: "1", objectFit: "contain", background: "#f8f8f8", padding: 6, display: "block" }} />
              : <div style={{ width: "100%", aspectRatio: "1", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>📦</div>}
            <div style={{ padding: "8px 10px 10px" }}>
              <div style={{ fontWeight: 800, fontSize: 12, color: "#222", marginBottom: 2, lineHeight: 1.3 }}>{p.name}</div>
              {p.desc && <div style={{ fontSize: 10, color: "#888", marginBottom: 6 }}>{p.desc}</div>}
              <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                {p.oldPrice && <span style={{ fontSize: 10, color: "#bbb", textDecoration: "line-through" }}>{p.oldPrice}</span>}
                <span style={{ fontFamily: "Impact, Arial Black, sans-serif", fontSize: p.highlight ? 26 : 22, color: primary, lineHeight: 1 }}>{p.price}</span>
                {p.unit && <span style={{ fontSize: 10, color: "#999", fontWeight: 700 }}>{p.unit}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ background: "#111", color: "#ccc", fontSize: 10, padding: "10px 28px", display: "flex", justifyContent: "space-between" }}>
        <span>{footer || "Adicione seu endereço e telefone nas configurações"}</span>
        <span style={{ opacity: .5 }}>Imagens meramente ilustrativas. Oferta válida enquanto durar o estoque.</span>
      </div>
    </div>
  );
}

export default function App() {
  const [config, setConfig] = useState({
    storeName: "", tagline: "", promoTitle: "OFERTAS DA SEMANA",
    promoPeriod: "", footer: "", logo: null, ...DEFAULT_COLORS,
  });
  const [products, setProducts] = useState([]);
  const [cols, setCols] = useState(3);
  const [form, setForm] = useState({ name: "", desc: "", price: "", oldPrice: "", unit: "", badge: "", img: null });
  const [toast, setToast] = useState("");
  const encarteRef = useRef();

  const cfg = (k, v) => setConfig(c => ({ ...c, [k]: v }));
  const fld = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function addProduct() {
    if (!form.name.trim()) return alert("Digite o nome do produto!");
    setProducts(ps => [...ps, { ...form, id: Date.now(), highlight: false }]);
    setForm({ name: "", desc: "", price: "", oldPrice: "", unit: "", badge: "", img: null });
    showToast("Produto adicionado!");
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  function moveProduct(from, to) {
    setProducts(ps => {
      const a = [...ps];
      const [x] = a.splice(from, 1);
      a.splice(to, 0, x);
      return a;
    });
  }

  function printEncarte() {
    const html = encarteRef.current?.innerHTML;
    if (!html) return;
    const win = window.open("", "_blank");
    win.document.write(`<html><head><title>Encarte</title>
      <style>@page{margin:0;size:A4 portrait}body{margin:0;font-family:Arial,sans-serif}</style>
      </head><body>${html}<script>window.onload=()=>{window.print();window.close()}<\/script></body></html>`);
    win.document.close();
  }

  const sideStyle = {
    width: 290, background: "#141414", borderRight: "1px solid #222",
    overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 14, flexShrink: 0,
  };
  const sectionTitle = { fontSize: 10, fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 };
  const card = { background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: 14 };
  const btn = (bg, color = "#fff") => ({
    padding: "8px 14px", borderRadius: 6, border: "none", background: bg, color,
    fontWeight: 700, fontSize: 12, cursor: "pointer", letterSpacing: .5,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0a0a0a", color: "#f0f0f0", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#141414", borderBottom: "2px solid #E8000D", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "Impact, Arial Black, sans-serif", fontSize: 22, letterSpacing: 2 }}>
          <span style={{ color: "#FFD600" }}>ENCARTE</span><span style={{ color: "#E8000D" }}>PRO</span>
        </div>
        <button style={btn("#FFD600", "#000")} onClick={printEncarte}>⬇ Exportar PDF</button>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* SIDEBAR */}
        <aside style={sideStyle}>
          {/* Config */}
          <div>
            <div style={sectionTitle}>⚙ Configurações</div>
            <div style={card}>
              <Field label="Nome da loja" placeholder="Ex: Supermercado Silva" value={config.storeName} onChange={e => cfg("storeName", e.target.value)} />
              <Field label="Slogan" placeholder="O melhor preço da cidade!" value={config.tagline} onChange={e => cfg("tagline", e.target.value)} />
              <Field label="Título da promoção" value={config.promoTitle} onChange={e => cfg("promoTitle", e.target.value)} />
              <Field label="Período de validade" placeholder="01/07 a 07/07/2025" value={config.promoPeriod} onChange={e => cfg("promoPeriod", e.target.value)} />
              <Field label="Rodapé (endereço, tel...)" placeholder="Rua das Flores, 123 — (11) 99999-9999" value={config.footer} onChange={e => cfg("footer", e.target.value)} />
              <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#777", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Cor principal</div>
                  <input type="color" value={config.primary} onChange={e => cfg("primary", e.target.value)}
                    style={{ width: "100%", height: 34, borderRadius: 6, border: "1px solid #333", cursor: "pointer", background: "none" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#777", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Cor destaque</div>
                  <input type="color" value={config.accent} onChange={e => cfg("accent", e.target.value)}
                    style={{ width: "100%", height: 34, borderRadius: 6, border: "1px solid #333", cursor: "pointer", background: "none" }} />
                </div>
              </div>
              <ImgUpload label="Clique para enviar logo" icon="🏷" preview={config.logo} onImg={v => cfg("logo", v)} />
            </div>
          </div>

          {/* Add product */}
          <div>
            <div style={sectionTitle}>➕ Adicionar produto</div>
            <div style={card}>
              <ImgUpload label="Foto do produto" icon="📷" preview={form.img} onImg={v => fld("img", v)} />
              <Field label="Nome do produto *" placeholder="Ex: Arroz Branco 5kg" value={form.name} onChange={e => fld("name", e.target.value)} />
              <Field label="Descrição" placeholder="Ex: Tipo 1, grão longo" value={form.desc} onChange={e => fld("desc", e.target.value)} />
              <Field label="Preço de oferta" placeholder="R$ 18,90" value={form.price} onChange={e => fld("price", e.target.value)} />
              <Field label="Preço anterior" placeholder="R$ 24,90" value={form.oldPrice} onChange={e => fld("oldPrice", e.target.value)} />
              <Field label="Unidade" placeholder="o kg / unid." value={form.unit} onChange={e => fld("unit", e.target.value)} />
              <Field label="Etiqueta" placeholder="Ex: -25% / OFERTA" value={form.badge} onChange={e => fld("badge", e.target.value)} />
              <button style={{ ...btn("#E8000D"), width: "100%", marginTop: 4 }} onClick={addProduct}>+ Adicionar ao encarte</button>
            </div>
          </div>

          {/* Product list */}
          <div>
            <div style={sectionTitle}>📦 Produtos ({products.length})</div>
            {products.map((p, i) => (
              <div key={p.id} style={{
                background: "#111", border: "1px solid #2a2a2a", borderRadius: 6,
                padding: "8px 10px", display: "flex", gap: 8, alignItems: "center", marginBottom: 6,
              }}>
                {p.img
                  ? <img src={p.img} style={{ width: 38, height: 38, objectFit: "contain", borderRadius: 4, background: "#1a1a1a", flexShrink: 0 }} />
                  : <div style={{ width: 38, height: 38, background: "#222", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>📦</div>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#FFD600" }}>{p.price}</div>
                </div>
                <div style={{ display: "flex", gap: 3 }}>
                  {i > 0 && <button style={{ ...btn("transparent"), border: "1px solid #333", padding: "4px 7px", fontSize: 11 }} onClick={() => moveProduct(i, i - 1)}>↑</button>}
                  {i < products.length - 1 && <button style={{ ...btn("transparent"), border: "1px solid #333", padding: "4px 7px", fontSize: 11 }} onClick={() => moveProduct(i, i + 1)}>↓</button>}
                  <button
                    title="Destaque"
                    style={{ ...btn("transparent"), border: "1px solid #333", padding: "4px 7px", fontSize: 13, color: p.highlight ? "#FFD600" : "#555" }}
                    onClick={() => setProducts(ps => ps.map((x, j) => j === i ? { ...x, highlight: !x.highlight } : x))}>★</button>
                  <button style={{ ...btn("transparent"), border: "1px solid #c0392b", padding: "4px 7px", fontSize: 11, color: "#c0392b" }}
                    onClick={() => setProducts(ps => ps.filter((_, j) => j !== i))}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* PREVIEW */}
        <div style={{ flex: 1, background: "#0d0d0d", overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#141414", borderBottom: "1px solid #222", padding: "8px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: "#666", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Colunas:</span>
            {[2, 3, 4].map(c => (
              <button key={c} style={{ ...btn(cols === c ? "#FFD600" : "transparent", cols === c ? "#000" : "#aaa"), border: "1px solid #333", padding: "5px 12px", fontSize: 12 }}
                onClick={() => setCols(c)}>{c}</button>
            ))}
          </div>
          <div style={{ flex: 1, padding: 24, display: "flex", justifyContent: "center" }}>
            <div ref={encarteRef} style={{ transform: "scale(0.78)", transformOrigin: "top center", flexShrink: 0 }}>
              <Encarte config={config} products={products} cols={cols} />
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
          background: "#FFD600", color: "#000", fontWeight: 700, fontSize: 13,
          padding: "10px 22px", borderRadius: 6, zIndex: 999,
        }}>✔ {toast}</div>
      )}
    </div>
  );
}
