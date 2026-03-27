import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../apiConfig';

const API_URL = `${API_BASE_URL}/products`;
const categories = ["Accessories & Bouquet", "Bags", "Clothing", "Home Decor"];

const crudStyles = `
  :root {
    --cream: #fdf6ec; --warm-white: #fffbf5; --blush: #f4a7b2;
    --rose: #e8728a; --deep-rose: #c4556b; --terracotta: #d4735e;
    --amber: #e8a45a; --sage: #8aab8e; --charcoal: #2c2420;
    --muted: #8a7a74; --border: rgba(212,115,94,0.15);
  }
  .ch-crud-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: .7rem; letter-spacing: .24em; text-transform: uppercase; color: var(--terracotta); font-weight: 700; margin-bottom: 8px; }
  .ch-crud-eyebrow::before { content: ''; display: block; width: 28px; height: 1.5px; background: var(--terracotta); }
  .ch-crud-title { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 800; color: var(--charcoal); letter-spacing: -.03em; line-height: 1.1; margin-bottom: 28px; }
  .ch-crud-title em { font-style: italic; color: var(--rose); }

  .ch-add-form { background: var(--warm-white); border: 1px solid var(--border); border-radius: 4px; margin-bottom: 36px; overflow: hidden; }
  .ch-form-head { display: flex; align-items: center; gap: 12px; padding: 18px 22px; border-bottom: 1px solid var(--border); background: rgba(253,246,236,.6); }
  .ch-form-head-icon { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg,var(--rose),var(--blush)); display: flex; align-items: center; justify-content: center; font-size: .9rem; flex-shrink: 0; }
  .ch-form-head-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 600; color: var(--charcoal); }
  .ch-form-body { padding: 22px; }
  .ch-form-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); gap: 16px; margin-bottom: 18px; }
  .ch-form-group { display: flex; flex-direction: column; gap: 6px; }
  .ch-form-label { font-size: .67rem; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); font-weight: 700; }
  .ch-form-input { padding: 9px 13px; border: 1.5px solid var(--border); border-radius: 3px; background: var(--cream); color: var(--charcoal); font-family: 'Lato',sans-serif; font-size: .85rem; transition: border-color .18s, box-shadow .18s; outline: none; width: 100%; }
  .ch-form-input:focus { border-color: var(--rose); box-shadow: 0 0 0 3px rgba(232,114,138,.1); }
  .ch-form-input::placeholder { color: var(--muted); opacity: .6; }
  .ch-form-actions { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .ch-form-img-area { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
  .ch-img-label { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: transparent; border: 1.5px solid var(--border); border-radius: 3px; color: var(--muted); font-family: 'Lato',sans-serif; font-size: .77rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: all .18s; }
  .ch-img-label:hover { border-color: var(--rose); color: var(--rose); }
  .ch-btn-toggle-imgs { background: transparent; border: none; color: var(--muted); font-size: 1.1rem; cursor: pointer; padding: 5px; transition: color .15s; }
  .ch-btn-toggle-imgs:hover { color: var(--rose); }
  .ch-btn-add { display: inline-flex; align-items: center; gap: 7px; padding: 10px 24px; background: var(--charcoal); color: var(--cream); border: none; border-radius: 3px; font-family: 'Lato',sans-serif; font-size: .79rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: all .22s; position: relative; overflow: hidden; }
  .ch-btn-add::after { content: ''; position: absolute; inset: 0; background: var(--rose); transform: translateX(-100%); transition: transform .28s; }
  .ch-btn-add:hover::after { transform: translateX(0); }
  .ch-btn-add span { position: relative; z-index: 1; }
  .ch-img-preview-grid { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 14px; }
  .ch-img-thumb-wrap { position: relative; width: 84px; height: 84px; border-radius: 3px; overflow: hidden; border: 1px solid var(--border); }
  .ch-img-thumb { width: 100%; height: 100%; object-fit: cover; }
  .ch-img-thumb-remove { position: absolute; top: 3px; right: 3px; width: 20px; height: 20px; border-radius: 50%; background: rgba(44,36,32,.7); color: #fff; border: none; font-size: .73rem; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background .15s; padding: 0; line-height: 1; }
  .ch-img-thumb-remove:hover { background: var(--rose); }

  .ch-products-section { display: flex; flex-direction: column; gap: 28px; }
  .ch-cat-group { background: var(--warm-white); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; }
  .ch-cat-group-head { display: flex; align-items: center; justify-content: space-between; padding: 15px 20px; border-bottom: 1px solid var(--border); background: rgba(253,246,236,.5); }
  .ch-cat-group-name { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 600; color: var(--charcoal); }
  .ch-cat-group-count { background: rgba(232,114,138,.1); color: var(--rose); font-size: .67rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; padding: 3px 9px; border-radius: 2px; }
  .ch-product-cards { display: grid; grid-template-columns: repeat(auto-fill,minmax(240px,1fr)); gap: 1px; background: var(--border); }
  .ch-product-card { background: var(--warm-white); padding: 20px; transition: background .15s; }
  .ch-product-card:hover { background: rgba(253,246,236,.7); }
  .ch-product-card-name { font-family: 'Playfair Display', serif; font-size: .97rem; font-weight: 600; color: var(--charcoal); margin-bottom: 5px; }
  .ch-product-card-desc { font-size: .79rem; color: var(--muted); line-height: 1.55; margin-bottom: 9px; font-weight: 300; }
  .ch-product-card-price { font-family: 'Playfair Display', serif; font-size: 1.02rem; font-weight: 700; color: var(--charcoal); margin-bottom: 14px; }
  .ch-card-actions { display: flex; gap: 7px; flex-wrap: wrap; }
  .ch-btn-view-img, .ch-btn-edit, .ch-btn-delete { padding: 6px 12px; background: transparent; border: 1.5px solid var(--border); border-radius: 3px; color: var(--muted); font-family: 'Lato',sans-serif; font-size: .71rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: all .15s; }
  .ch-btn-view-img:hover { border-color: var(--amber); color: var(--terracotta); }
  .ch-btn-edit:hover { border-color: var(--rose); color: var(--rose); }
  .ch-btn-delete:hover { border-color: #c0392b; color: #c0392b; }
  .ch-edit-form { display: flex; flex-direction: column; gap: 9px; }
  .ch-edit-input { padding: 8px 11px; border: 1.5px solid var(--border); border-radius: 3px; background: var(--cream); color: var(--charcoal); font-family: 'Lato',sans-serif; font-size: .83rem; outline: none; width: 100%; transition: border-color .15s; }
  .ch-edit-input:focus { border-color: var(--rose); }
  .ch-edit-actions { display: flex; gap: 7px; margin-top: 3px; }
  .ch-btn-save { padding: 7px 16px; background: var(--rose); color: #fff; border: none; border-radius: 3px; font-family: 'Lato',sans-serif; font-size: .74rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: background .18s; }
  .ch-btn-save:hover { background: var(--deep-rose); }
  .ch-btn-cancel { padding: 7px 16px; background: transparent; border: 1.5px solid var(--border); border-radius: 3px; color: var(--muted); font-family: 'Lato',sans-serif; font-size: .74rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: all .15s; }
  .ch-btn-cancel:hover { border-color: var(--rose); color: var(--rose); }

  .ch-modal-backdrop { position: fixed; inset: 0; background: rgba(44,36,32,.55); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9998; padding: 16px; }
  .ch-modal-box { background: var(--warm-white); border-radius: 6px; padding: 36px 30px; max-width: 420px; width: 100%; text-align: center; box-shadow: 0 30px 80px rgba(44,36,32,.22); border: 1px solid var(--border); font-family: 'Lato',sans-serif; animation: crudModalIn .22s ease; }
  @keyframes crudModalIn { from { opacity:0; transform:translateY(14px) scale(.96); } to { opacity:1; transform:translateY(0) scale(1); } }
  .ch-modal-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; color: var(--charcoal); margin-bottom: 9px; }
  .ch-modal-desc { font-size: .85rem; color: var(--muted); line-height: 1.65; margin-bottom: 24px; font-weight: 300; }
  .ch-modal-desc strong { color: var(--charcoal); font-weight: 700; }
  .ch-modal-actions { display: flex; gap: 11px; justify-content: center; flex-wrap: wrap; }
  .ch-modal-img-wrap { margin-bottom: 14px; }
  .ch-modal-img { max-width: 100%; max-height: 280px; border-radius: 3px; object-fit: contain; border: 1px solid var(--border); }
  .ch-modal-img-counter { font-size: .74rem; color: var(--muted); margin-bottom: 9px; }
  .ch-modal-nav { display: flex; gap: 7px; justify-content: center; margin-bottom: 14px; }
  .ch-modal-nav-btn { width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid var(--border); background: transparent; color: var(--charcoal); font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .15s; }
  .ch-modal-nav-btn:hover { border-color: var(--rose); color: var(--rose); }
  .ch-btn-danger { padding: 10px 22px; background: #c0392b; color: #fff; border: none; border-radius: 3px; font-family: 'Lato',sans-serif; font-size: .79rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: background .18s; }
  .ch-btn-danger:hover { background: #a93226; }
  .ch-btn-neutral { padding: 10px 22px; background: transparent; border: 1.5px solid var(--border); border-radius: 3px; color: var(--muted); font-family: 'Lato',sans-serif; font-size: .79rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: all .15s; }
  .ch-btn-neutral:hover { border-color: var(--rose); color: var(--rose); }

  .ch-crud-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 260px; gap: 14px; color: var(--muted); font-size: .83rem; }
  .ch-crud-loader { width: 32px; height: 32px; border: 2.5px solid rgba(232,114,138,.2); border-top-color: var(--rose); border-radius: 50%; animation: cSpin .8s linear infinite; }
  @keyframes cSpin { to { transform: rotate(360deg); } }

  @media (max-width: 1024px) {
    .ch-form-grid { grid-template-columns: repeat(2,1fr); }
    .ch-product-cards { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width: 768px) {
    .ch-crud-title { font-size: 1.5rem; }
    .ch-form-body { padding: 14px; }
    .ch-form-grid { grid-template-columns: 1fr; gap: 10px; margin-bottom: 14px; }
    .ch-form-head { padding: 14px 16px; }
    .ch-form-actions { flex-direction: column; align-items: stretch; }
    .ch-btn-add { justify-content: center; }
    .ch-product-cards { grid-template-columns: 1fr; }
    .ch-product-card { padding: 14px; }
    .ch-cat-group-head { padding: 12px 14px; }
    .ch-modal-box { padding: 24px 16px; }
  }
`;

const CrudApp = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({ id: "", name: "", description: "", price: "", category: "", images: [] });
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProduct, setEditProduct] = useState({ id: "", name: "", description: "", price: "", category: "", images: [] });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [productToShow, setProductToShow] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showNewImageList, setShowNewImageList] = useState(false);
  const [showEditImageList, setShowEditImageList] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (e) { console.error(e); setProducts([]); }
    finally { setLoading(false); }
  };

  const addProduct = async () => {
    if (!newProduct.id || !newProduct.name || !newProduct.description || !newProduct.price || !newProduct.category) return;
    const res = await axios.post(API_URL, newProduct);
    setProducts([...products, res.data]);
    setNewProduct({ id: "", name: "", description: "", price: "", category: "", images: [] });
    setShowNewImageList(false);
  };

  const deleteProduct = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setProducts(products.filter(p => p.id !== id));
  };

  const startEditing = (p) => { setEditingProduct(p.id); setEditProduct(p); };

  const updateProduct = async (id) => {
    await axios.put(`${API_URL}/${id}`, editProduct);
    setProducts(products.map(p => p.id === id ? editProduct : p));
    setEditingProduct(null);
    setEditProduct({ id: "", name: "", description: "", price: "", category: "", images: [] });
  };

  const handleImgUpload = (files, setter, current) => {
    const promises = Array.from(files).map(file => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    }));
    Promise.all(promises).then(urls => setter({ ...current, images: [...current.images, ...urls] }));
  };

  const groupedProducts = products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  if (loading) return (
    <><style>{crudStyles}</style>
      <div className="ch-crud-loading"><div className="ch-crud-loader" /><span>Loading products…</span></div>
    </>
  );

  return (
    <>
      <style>{crudStyles}</style>
      <p className="ch-crud-eyebrow">Inventory</p>
      <h1 className="ch-crud-title">Manage <em>Products</em></h1>

      <div className="ch-add-form">
        <div className="ch-form-head">
          <div className="ch-form-head-icon">✦</div>
          <span className="ch-form-head-title">Add New Product</span>
        </div>
        <div className="ch-form-body">
          <div className="ch-form-grid">
            <div className="ch-form-group">
              <label className="ch-form-label">Product ID</label>
              <input className="ch-form-input" placeholder="e.g. PROD-001" value={newProduct.id} onChange={e => setNewProduct({ ...newProduct, id: e.target.value })} />
            </div>
            <div className="ch-form-group">
              <label className="ch-form-label">Product Name</label>
              <input className="ch-form-input" placeholder="e.g. Rose Bouquet" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
            </div>
            <div className="ch-form-group">
              <label className="ch-form-label">Description</label>
              <input className="ch-form-input" placeholder="A short description…" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
            </div>
            <div className="ch-form-group">
              <label className="ch-form-label">Price (₱)</label>
              <input className="ch-form-input" placeholder="0.00" type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
            </div>
            <div className="ch-form-group">
              <label className="ch-form-label">Category</label>
              <select className="ch-form-input" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                <option value="">Select category…</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="ch-form-actions">
            <div className="ch-form-img-area">
              <label className="ch-img-label">
                🖼 Images{newProduct.images.length > 0 ? ` (${newProduct.images.length})` : ""}
                <input type="file" multiple style={{ display: "none" }} onChange={e => handleImgUpload(e.target.files, setNewProduct, newProduct)} />
              </label>
              {newProduct.images.length > 0 && (
                <button className="ch-btn-toggle-imgs" onClick={() => setShowNewImageList(!showNewImageList)}>
                  {showNewImageList ? "🙈" : "👁"}
                </button>
              )}
            </div>
            <button className="ch-btn-add" onClick={addProduct}><span>+ Add Product</span></button>
          </div>
          {showNewImageList && newProduct.images.length > 0 && (
            <div className="ch-img-preview-grid">
              {newProduct.images.map((img, i) => (
                <div key={i} className="ch-img-thumb-wrap">
                  <img src={img} alt="" className="ch-img-thumb" />
                  <button className="ch-img-thumb-remove" onClick={() => setNewProduct({ ...newProduct, images: newProduct.images.filter((_, j) => j !== i) })}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="ch-products-section">
        {Object.keys(groupedProducts).map(category => (
          <div key={category} className="ch-cat-group">
            <div className="ch-cat-group-head">
              <span className="ch-cat-group-name">{category}</span>
              <span className="ch-cat-group-count">{groupedProducts[category].length} items</span>
            </div>
            <div className="ch-product-cards">
              {groupedProducts[category].map(product => (
                <div key={product.id} className="ch-product-card">
                  {editingProduct === product.id ? (
                    <div className="ch-edit-form">
                      {[
                        { key: "name", placeholder: "Product name" },
                        { key: "description", placeholder: "Description" },
                        { key: "price", placeholder: "Price" },
                      ].map(({ key, placeholder }) => (
                        <input key={key} className="ch-edit-input" placeholder={placeholder} value={editProduct[key]} onChange={e => setEditProduct({ ...editProduct, [key]: e.target.value })} />
                      ))}
                      <select className="ch-edit-input" value={editProduct.category} onChange={e => setEditProduct({ ...editProduct, category: e.target.value })}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <div>
                        <label className="ch-img-label" style={{ display: "inline-flex", cursor: "pointer" }}>
                          🖼 Images {editProduct.images.length > 0 ? `(${editProduct.images.length})` : ""}
                          <input type="file" multiple style={{ display: "none" }} onChange={e => handleImgUpload(e.target.files, setEditProduct, editProduct)} />
                        </label>
                        {editProduct.images.length > 0 && (
                          <button className="ch-btn-toggle-imgs" style={{ marginLeft: 7 }} onClick={() => setShowEditImageList(!showEditImageList)}>
                            {showEditImageList ? "🙈" : "👁"}
                          </button>
                        )}
                      </div>
                      {showEditImageList && editProduct.images.length > 0 && (
                        <div className="ch-img-preview-grid">
                          {editProduct.images.map((img, i) => (
                            <div key={i} className="ch-img-thumb-wrap">
                              <img src={img} alt="" className="ch-img-thumb" />
                              <button className="ch-img-thumb-remove" onClick={() => setEditProduct({ ...editProduct, images: editProduct.images.filter((_, j) => j !== i) })}>×</button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="ch-edit-actions">
                        <button className="ch-btn-save" onClick={() => updateProduct(product.id)}>Save</button>
                        <button className="ch-btn-cancel" onClick={() => setEditingProduct(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="ch-product-card-name">{product.name}</div>
                      <div className="ch-product-card-desc">{product.description}</div>
                      <div className="ch-product-card-price">₱{parseFloat(product.price).toFixed(2)}</div>
                      <div className="ch-card-actions">
                        {product.images.length > 0 && (
                          <button className="ch-btn-view-img" onClick={() => { setProductToShow(product); setCurrentImageIndex(0); setShowImageModal(true); }}>View Img</button>
                        )}
                        <button className="ch-btn-edit" onClick={() => startEditing(product)}>Edit</button>
                        <button className="ch-btn-delete" onClick={() => { setProductToDelete(product); setShowDeleteModal(true); }}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showDeleteModal && (
        <div className="ch-modal-backdrop" onClick={e => e.target === e.currentTarget && setShowDeleteModal(false)}>
          <div className="ch-modal-box">
            <div className="ch-modal-title">Delete Product?</div>
            <p className="ch-modal-desc">Are you sure you want to delete <strong>"{productToDelete?.name}"</strong>? This cannot be undone.</p>
            <div className="ch-modal-actions">
              <button className="ch-btn-neutral" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="ch-btn-danger" onClick={() => { deleteProduct(productToDelete.id); setShowDeleteModal(false); }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {showImageModal && productToShow && (
        <div className="ch-modal-backdrop" onClick={e => e.target === e.currentTarget && setShowImageModal(false)}>
          <div className="ch-modal-box">
            <div className="ch-modal-title">{productToShow.name}</div>
            {productToShow.images.length > 0 ? (
              <>
                <div className="ch-modal-img-counter">{currentImageIndex + 1} / {productToShow.images.length}</div>
                <div className="ch-modal-img-wrap">
                  <img src={productToShow.images[currentImageIndex]} alt={productToShow.name} className="ch-modal-img" />
                </div>
                {productToShow.images.length > 1 && (
                  <div className="ch-modal-nav">
                    <button className="ch-modal-nav-btn" onClick={() => setCurrentImageIndex((currentImageIndex - 1 + productToShow.images.length) % productToShow.images.length)}>‹</button>
                    <button className="ch-modal-nav-btn" onClick={() => setCurrentImageIndex((currentImageIndex + 1) % productToShow.images.length)}>›</button>
                  </div>
                )}
              </>
            ) : (
              <p className="ch-modal-desc">No images available</p>
            )}
            <div className="ch-modal-actions">
              <button className="ch-btn-neutral" onClick={() => setShowImageModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CrudApp;