import { useState, useEffect, useRef, useCallback } from "react";
import PageWrapper from "../components/PageWrapper";
import { supabase } from "../supabaseClient"; // Make sure this path is correct

const typeColor = { photo: "#3b82f6", video: "#e53e00", transform: "#22c55e" };
const typeIcon  = { photo: "📷", video: "🎥", transform: "⚡" };

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // 1. Data load from Supabase
  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const { data } = await supabase.from("gallery_items").select("*");
    if (data) setItems(data);
  };

  // 2. Upload to Storage + Save URL to DB (single pass — no duplication)
  const addFiles = useCallback(async (files) => {
    setUploading(true);
    try {
      for (let file of Array.from(files)) {
        const fileName = `${Date.now()}_${file.name}`;

        // Upload to Storage
        const { error: uploadError } = await supabase.storage
          .from("Gallery")
          .upload(fileName, file);
        if (uploadError) throw uploadError;

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage.from("Gallery").getPublicUrl(fileName);

        // Save to DB
        const newItem = {
          src: publicUrl,
          label: file.name.replace(/\.[^.]+$/, ""),
          type: file.type.startsWith("video/") ? "video" : "photo",
        };

        const { data: dbData, error: dbError } = await supabase
          .from("gallery_items")
          .insert([newItem])
          .select();
        if (dbError) throw dbError;

        if (dbData) setItems((prev) => [...prev, ...dbData]);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  }, []);

  // 3. Delete from Storage + DB
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    const item = items.find((i) => i.id === id);
    if (!item) return;

    // Delete from Storage (Extract file name from URL)
    const fileName = item.src.split("/").pop();
    await supabase.storage.from("Gallery").remove([fileName]);

    // Delete from DB
    await supabase.from("gallery_items").delete().eq("id", id);

    setItems((prev) => prev.filter((i) => i.id !== id));
    if (lightbox?.id === id) setLightbox(null);
  };

  const handleFileInput = (e) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = ""; // allow re-selecting the same file again
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const filtered = filter === "all" ? items : items.filter((i) => i.type === filter);

  const filters = [
    { key: "all", label: "All" },
    { key: "photo", label: "📷 Photos" },
    { key: "video", label: "🎥 Videos" },
    { key: "transform", label: "⚡ Transformations" },
  ];

  return (
    <PageWrapper
      icon="🖼️"
      title='GAL<span>LERY</span>'
      subtitle="Gym photos, workout videos, and transformation stories"
      accentColor="#a855f7"
    >
      <style>{`
        /* ── Filters bar ── */
        .gallery-filters {
          display: flex;
          gap: 0.6rem;
          margin-bottom: 1.8rem;
          flex-wrap: wrap;
          align-items: center;
        }
        .filter-btn {
          background: #111;
          border: 1px solid #2a2a2a;
          color: #888;
          padding: 7px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-family: 'Barlow', sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .filter-btn:hover, .filter-btn.active {
          border-color: #a855f7;
          color: #a855f7;
          background: rgba(168,85,247,0.08);
        }
        .upload-btn {
          background: #a855f7;
          border: none;
          color: #fff;
          padding: 7px 18px;
          border-radius: 20px;
          cursor: pointer;
          font-family: 'Barlow', sans-serif;
          font-weight: 700;
          font-size: 0.85rem;
          margin-left: auto;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .upload-btn:hover { background: #9333ea; }
        .upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Drop zone ── */
        .drop-zone {
          border: 2px dashed #2a2a2a;
          border-radius: 14px;
          padding: 2rem;
          text-align: center;
          color: #444;
          margin-bottom: 1.5rem;
          transition: all 0.2s;
          cursor: pointer;
        }
        .drop-zone.drag-over {
          border-color: #a855f7;
          background: rgba(168,85,247,0.06);
          color: #a855f7;
        }
        .drop-zone.uploading {
          cursor: wait;
          border-color: #a855f7;
          color: #a855f7;
        }
        .drop-zone-icon { font-size: 2rem; display: block; margin-bottom: 0.4rem; }
        .drop-zone-text { font-size: 0.88rem; font-weight: 600; font-family: 'Barlow', sans-serif; }
        .drop-zone-sub  { font-size: 0.78rem; margin-top: 0.25rem; color: #333; }
        .spinner { display: inline-block; font-size: 1.6rem; animation: spin 1s linear infinite; margin-bottom: 0.4rem; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        /* ── Grid ── */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        @media (max-width: 600px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr); gap: 0.6rem; }
          .gallery-filters { gap: 0.4rem; }
          .filter-btn { font-size: 0.78rem; padding: 6px 12px; }
          .upload-btn { font-size: 0.78rem; padding: 6px 13px; }
        }
        @media (max-width: 360px) {
          .gallery-grid { grid-template-columns: 1fr; }
        }

        /* ── Gallery item ── */
        .gallery-item {
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 12px;
          aspect-ratio: 4/3;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          overflow: hidden;
          position: relative;
        }
        .gallery-item:hover { border-color: #444; transform: scale(1.02); }
        .gallery-item img,
        .gallery-item video {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }
        .gallery-type-badge {
          position: absolute;
          top: 8px; right: 8px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          pointer-events: none;
        }
        .gallery-label {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.75));
          color: #ccc;
          font-size: 0.75rem;
          font-weight: 600;
          font-family: 'Barlow', sans-serif;
          padding: 18px 10px 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .gallery-item:hover .gallery-label { opacity: 1; }
        .delete-btn {
          position: absolute;
          top: 8px; left: 8px;
          background: rgba(0,0,0,0.6);
          border: none;
          color: #ff4d4d;
          width: 26px; height: 26px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 0.75rem;
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
          z-index: 2;
        }
        .gallery-item:hover .delete-btn { opacity: 1; }

        /* ── Add tile ── */
        .add-tile {
          background: transparent;
          border: 2px dashed #2a2a2a;
          border-radius: 12px;
          aspect-ratio: 4/3;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: #444;
          font-size: 0.85rem;
          gap: 0.4rem;
          font-family: 'Barlow', sans-serif;
          font-weight: 600;
        }
        .add-tile:hover { border-color: #a855f7; color: #a855f7; }

        /* ── Empty state ── */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem 1rem;
          color: #444;
          font-family: 'Barlow', sans-serif;
        }
        .empty-state-icon { font-size: 3rem; display: block; margin-bottom: 0.75rem; }
        .empty-state-title { font-size: 1rem; font-weight: 700; color: #555; margin-bottom: 0.3rem; }
        .empty-state-sub   { font-size: 0.85rem; }

        /* ── Type toggle in lightbox ── */
        .type-toggle {
          display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.75rem;
        }
        .type-toggle-btn {
          padding: 4px 14px;
          border-radius: 20px;
          border: 1px solid transparent;
          cursor: pointer;
          font-size: 0.78rem;
          font-weight: 700;
          font-family: 'Barlow', sans-serif;
          transition: all 0.15s;
        }

        /* ── Lightbox ── */
        .lightbox-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.92);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;
          padding: 1rem;
        }
        .lightbox-box {
          background: #111;
          border: 1px solid #2a2a2a;
          border-radius: 16px;
          max-width: 860px;
          width: 100%;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .lightbox-media {
          width: 100%;
          max-height: 70vh;
          object-fit: contain;
          background: #000;
        }
        .lightbox-footer {
          padding: 1rem 1.2rem;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .lightbox-label-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid #333;
          color: #ddd;
          font-family: 'Barlow', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          outline: none;
          width: 100%;
          max-width: 320px;
          padding-bottom: 3px;
          transition: border-color 0.2s;
        }
        .lightbox-label-input:focus { border-color: #a855f7; }
        .lightbox-close {
          position: absolute;
          top: 12px; right: 12px;
          background: rgba(0,0,0,0.55);
          border: 1px solid #333;
          color: #aaa;
          width: 32px; height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1rem;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .lightbox-close:hover { background: #222; color: #fff; border-color: #555; }
        .lb-nav {
          position: absolute;
          top: 50%; transform: translateY(-50%);
          background: rgba(0,0,0,0.5);
          border: 1px solid #333;
          color: #aaa;
          width: 36px; height: 36px;
          border-radius: 50%;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
          transition: all 0.15s;
        }
        .lb-nav:hover { background: rgba(168,85,247,0.25); color: #a855f7; border-color: #a855f7; }
        .lb-prev { left: 10px; }
        .lb-next { right: 10px; }
        @media (max-width: 600px) {
          .lightbox-media { max-height: 55vh; }
        }
      `}</style>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        style={{ display: "none" }}
        onChange={handleFileInput}
      />

      {/* Filter bar */}
      <div className="gallery-filters">
        {filters.map((f) => (
          <button
            key={f.key}
            className={`filter-btn${filter === f.key ? " active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            {f.key !== "all" && items.filter((i) => i.type === f.key).length > 0 && (
              <span style={{ marginLeft: 6, opacity: 0.6, fontWeight: 400 }}>
                {items.filter((i) => i.type === f.key).length}
              </span>
            )}
          </button>
        ))}
        <button className="upload-btn" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          + Upload
        </button>
      </div>

      {/* Drag & drop zone (single, with built-in loading state) */}
      <div
        className={`drop-zone${dragOver ? " drag-over" : ""}${uploading ? " uploading" : ""}`}
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!uploading) setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { if (!uploading) handleDrop(e); else e.preventDefault(); }}
      >
        {uploading ? (
          <>
            <span className="spinner">⏳</span>
            <span className="drop-zone-text">Uploading your media…</span>
          </>
        ) : (
          <>
            <span className="drop-zone-icon">📁</span>
            <span className="drop-zone-text">
              {dragOver ? "Drop to add media" : "Drag & drop photos or videos here"}
            </span>
            <span className="drop-zone-sub">or click to browse · JPG, PNG, GIF, MP4, MOV, etc.</span>
          </>
        )}
      </div>

      {/* Grid */}
      <div className="gallery-grid">
        {filtered.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-icon">🖼️</span>
            <div className="empty-state-title">
              {filter === "all" ? "No media yet" : `No ${filter}s yet`}
            </div>
            <div className="empty-state-sub">Upload some files above to get started.</div>
          </div>
        )}

        {filtered.map((item, idx) => (
          <div
            className="gallery-item"
            key={item.id}
            onClick={() => setLightbox({ ...item, filteredIdx: idx })}
          >
            {item.type === "video" ? (
              <video src={item.src} muted playsInline preload="metadata" />
            ) : (
              <img src={item.src} alt={item.label} loading="lazy" />
            )}
            <span
              className="gallery-type-badge"
              style={{ background: `${typeColor[item.type]}22`, color: typeColor[item.type] }}
            >
              {typeIcon[item.type]} {item.type}
            </span>
            <span className="gallery-label">{item.label}</span>
            <button
              className="delete-btn"
              title="Remove"
              onClick={(e) => handleDelete(item.id, e)}
            >✕</button>
          </div>
        ))}

        {/* Add tile always at end */}
        <div className="add-tile" onClick={() => fileInputRef.current?.click()}>
          <span style={{ fontSize: "1.8rem" }}>+</span>
          <span>Add Media</span>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (() => {
        const lbFiltered = filter === "all" ? items : items.filter((i) => i.type === filter);
        const lbIdx = lbFiltered.findIndex((i) => i.id === lightbox.id);

        const goTo = (newIdx) => {
          const clamped = (newIdx + lbFiltered.length) % lbFiltered.length;
          setLightbox({ ...lbFiltered[clamped], filteredIdx: clamped });
        };

        const updateLabel = (val) => {
          setItems((prev) =>
            prev.map((i) => (i.id === lightbox.id ? { ...i, label: val } : i))
          );
          setLightbox((lb) => ({ ...lb, label: val }));
        };

        const updateType = (newType) => {
          setItems((prev) =>
            prev.map((i) => (i.id === lightbox.id ? { ...i, type: newType } : i))
          );
          setLightbox((lb) => ({ ...lb, type: newType }));
        };

        return (
          <div
            className="lightbox-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) setLightbox(null); }}
          >
            <div className="lightbox-box">
              {lightbox.type === "video" ? (
                <video
                  src={lightbox.src}
                  controls
                  autoPlay
                  className="lightbox-media"
                />
              ) : (
                <img
                  src={lightbox.src}
                  alt={lightbox.label}
                  className="lightbox-media"
                />
              )}

              {/* Nav arrows */}
              {lbFiltered.length > 1 && (
                <>
                  <button className="lb-nav lb-prev" onClick={() => goTo(lbIdx - 1)}>‹</button>
                  <button className="lb-nav lb-next" onClick={() => goTo(lbIdx + 1)}>›</button>
                </>
              )}

              <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>

              <div className="lightbox-footer">
                <div style={{ flex: 1 }}>
                  <input
                    className="lightbox-label-input"
                    value={lightbox.label}
                    onChange={(e) => updateLabel(e.target.value)}
                    placeholder="Add a label…"
                  />
                  {/* Type override */}
                  <div className="type-toggle">
                    {Object.entries(typeIcon).map(([t, icon]) => (
                      <button
                        key={t}
                        className="type-toggle-btn"
                        style={{
                          background: lightbox.type === t ? `${typeColor[t]}22` : "transparent",
                          color: lightbox.type === t ? typeColor[t] : "#555",
                          borderColor: lightbox.type === t ? typeColor[t] : "#2a2a2a",
                        }}
                        onClick={() => updateType(t)}
                      >
                        {icon} {t}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  style={{
                    background: "rgba(255,77,77,0.1)",
                    border: "1px solid rgba(255,77,77,0.3)",
                    color: "#ff4d4d",
                    padding: "6px 14px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    fontFamily: "'Barlow', sans-serif",
                    alignSelf: "flex-end",
                  }}
                  onClick={(e) => { handleDelete(lightbox.id, e); setLightbox(null); }}
                >
                  Delete
                </button>
              </div>

              {lbFiltered.length > 1 && (
                <div style={{ textAlign: "center", padding: "0 1rem 0.75rem", color: "#444", fontSize: "0.78rem" }}>
                  {lbIdx + 1} / {lbFiltered.length}
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </PageWrapper>
  );
}