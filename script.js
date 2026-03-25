document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEYS = {
    products: "enzo_products",
    cart: "enzo_cart",
    favorites: "enzo_favorites",
    orders: "enzo_orders",
  };

  const ADMIN_SESSION_KEY = "enzo_admin_session";

  const ADMIN = {
    phone: "07700000000",
    password: "admin123",
  };

  const pageType = document.body.dataset.page || "home";

  const DEFAULT_PRODUCTS = [
    {
      id: 1,
      name: "منتج 1",
      price: 35000,
      description: "هذا مثال للمنتج حتى تشوف شكل العرض والطلب قبل ما تضيف منتجاتك الحقيقية.",
      details: { category: "قسم 1", sku: "ENZ-001", availability: "متوفر" },
      mainImage: "",
      galleryImages: [],
      gallery: ["منتج 1 - صورة 1", "منتج 1 - صورة 2", "منتج 1 - صورة 3", "منتج 1 - صورة 4"],
    },
    {
      id: 2,
      name: "منتج 2",
      price: 40000,
      description: "وصف مؤقت للمنتج حتى تعدله لاحقاً من الحساب.",
      details: { category: "قسم 2", sku: "ENZ-002", availability: "متوفر" },
      mainImage: "",
      galleryImages: [],
      gallery: ["منتج 2 - صورة 1", "منتج 2 - صورة 2", "منتج 2 - صورة 3", "منتج 2 - صورة 4"],
    },
    {
      id: 3,
      name: "منتج 3",
      price: 45000,
      description: "وصف مؤقت للمنتج حتى تعدله لاحقاً من الحساب.",
      details: { category: "قسم 3", sku: "ENZ-003", availability: "متوفر" },
      mainImage: "",
      galleryImages: [],
      gallery: ["منتج 3 - صورة 1", "منتج 3 - صورة 2", "منتج 3 - صورة 3", "منتج 3 - صورة 4"],
    },
    {
      id: 4,
      name: "منتج 4",
      price: 50000,
      description: "وصف مؤقت للمنتج حتى تعدله لاحقاً من الحساب.",
      details: { category: "قسم 4", sku: "ENZ-004", availability: "متوفر" },
      mainImage: "",
      galleryImages: [],
      gallery: ["منتج 4 - صورة 1", "منتج 4 - صورة 2", "منتج 4 - صورة 3", "منتج 4 - صورة 4"],
    },
    {
      id: 5,
      name: "منتج 5",
      price: 55000,
      description: "وصف مؤقت للمنتج حتى تعدله لاحقاً من الحساب.",
      details: { category: "قسم 5", sku: "ENZ-005", availability: "متوفر" },
      mainImage: "",
      galleryImages: [],
      gallery: ["منتج 5 - صورة 1", "منتج 5 - صورة 2", "منتج 5 - صورة 3", "منتج 5 - صورة 4"],
    },
  ];

  initStorage();

  let products = readStorage(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
  let cart = readStorage(STORAGE_KEYS.cart, []);
  let favorites = readStorage(STORAGE_KEYS.favorites, []);
  let orders = readStorage(STORAGE_KEYS.orders, []);
  let pendingDeleteProductId = null;

  const el = {
    introScreen: byId("introScreen"),

    productsGrid: byId("productsGrid"),
    searchInput: byId("searchInput"),
    clearSearchBtn: byId("clearSearchBtn"),
    cartBtn: byId("cartBtn"),
    closeCartBtn: byId("closeCartBtn"),
    cartDrawer: byId("cartDrawer"),
    drawerOverlay: byId("drawerOverlay"),
    cartItems: byId("cartItems"),
    cartCount: byId("cartCount"),
    favoritesBtn: byId("favoritesBtn"),
    favoritesCount: byId("favoritesCount"),
    cartTotal: byId("cartTotal"),
    checkoutBtn: byId("checkoutBtn"),
    invoiceModal: byId("invoiceModal"),
    invoiceBody: byId("invoiceBody"),
    closeInvoiceBtn: byId("closeInvoiceBtn"),
    closeInvoiceActionBtn: byId("closeInvoiceActionBtn"),
    whatsappOrderBtn: byId("whatsappOrderBtn"),
    customerName: byId("customerName"),
    customerPhone: byId("customerPhone"),
    customerLocation: byId("customerLocation"),
    customerMapLink: byId("customerMapLink"),
    customerNotes: byId("customerNotes"),
    getLocationBtn: byId("getLocationBtn"),
    brandHomeBtn: byId("brandHomeBtn"),
    heroShopBtn: byId("heroShopBtn"),
    productDetailsContainer: byId("productDetailsContainer"),

    accountBox: byId("accountBox"),
    adminPanel: byId("adminPanel"),
    adminPhone: byId("adminPhone"),
    adminPassword: byId("adminPassword"),
    adminLoginBtn: byId("adminLoginBtn"),
    adminLoginMessage: byId("adminLoginMessage"),
    adminLogoutBtn: byId("adminLogoutBtn"),
    adminProductsList: byId("adminProductsList"),
    adminOrdersList: byId("adminOrdersList"),
    adminNavWrap: byId("adminNavWrap"),

    adminProductPageTitle: byId("adminProductPageTitle"),
    adminProductId: byId("adminProductId"),
    adminProductName: byId("adminProductName"),
    adminProductPrice: byId("adminProductPrice"),
    adminProductDescription: byId("adminProductDescription"),
    adminProductCategory: byId("adminProductCategory"),
    adminProductSku: byId("adminProductSku"),
    adminProductStatus: byId("adminProductStatus"),
    adminMainImage: byId("adminMainImage"),
    adminGalleryImages: byId("adminGalleryImages"),
    adminMainImagePreview: byId("adminMainImagePreview"),
    adminGalleryPreview: byId("adminGalleryPreview"),
    saveProductBtn: byId("saveProductBtn"),
    resetProductBtn: byId("resetProductBtn"),
    adminProductMessage: byId("adminProductMessage"),

    deleteConfirmModal: byId("deleteConfirmModal"),
    closeDeleteConfirmBtn: byId("closeDeleteConfirmBtn"),
    cancelDeleteBtn: byId("cancelDeleteBtn"),
    confirmDeleteBtn: byId("confirmDeleteBtn"),
    deleteConfirmText: byId("deleteConfirmText"),
  };

  initShared();
  initHomePage();
  initProductPage();
  initAdminPage();
  initAdminProductPage();

  function byId(id) {
    return document.getElementById(id);
  }

  function bindIf(element, eventName, handler) {
    if (element) element.addEventListener(eventName, handler);
  }

  function showToast(message, type = "info", duration = 2500) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("hide");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  }

  function initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.products)) {
      localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(DEFAULT_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.cart)) {
      localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.favorites)) {
      localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.orders)) {
      localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify([]));
    }
  }

  function readStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function isAdminLoggedIn() {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
  }

  function formatPrice(price) {
    return `${Number(price).toLocaleString("en-US")} د.ع`;
  }

  function getProductById(id) {
    return products.find((product) => Number(product.id) === Number(id));
  }

  function initShared() {
    if (el.introScreen) {
      setTimeout(() => {
        el.introScreen.classList.add("hide");
      }, 2200);
    }

    bindIf(el.cartBtn, "click", openCart);
    bindIf(el.closeCartBtn, "click", closeCart);
    bindIf(el.drawerOverlay, "click", closeCart);
    bindIf(el.checkoutBtn, "click", openInvoice);
    bindIf(el.closeInvoiceBtn, "click", closeInvoice);
    bindIf(el.closeInvoiceActionBtn, "click", closeInvoice);
    bindIf(el.whatsappOrderBtn, "click", sendOrderToWhatsApp);
    bindIf(el.favoritesBtn, "click", renderFavoritesView);
    bindIf(el.getLocationBtn, "click", getCustomerLocation);

    if (el.brandHomeBtn) {
      el.brandHomeBtn.addEventListener("click", () => {
        window.location.href = "index.html";
      });
    }

    renderCart();

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeCart();
        closeInvoice();
        closeDeleteConfirm();
      }
    });
  }

  function initHomePage() {
    if (pageType !== "home") return;

    renderProducts();

    bindIf(el.searchInput, "input", renderProducts);
    bindIf(el.clearSearchBtn, "click", () => {
      if (!el.searchInput) return;
      el.searchInput.value = "";
      renderProducts();
      el.searchInput.focus();
    });

    bindIf(el.heroShopBtn, "click", renderProducts);
  }

  function initProductPage() {
    if (pageType !== "product") return;
    renderProductDetailsPage();
  }

  function initAdminPage() {
    if (pageType !== "admin") return;

    updateAdminUI();
    bindIf(el.adminLoginBtn, "click", adminLogin);
    bindIf(el.adminLogoutBtn, "click", adminLogout);

    bindIf(el.closeDeleteConfirmBtn, "click", closeDeleteConfirm);
    bindIf(el.cancelDeleteBtn, "click", closeDeleteConfirm);
    bindIf(el.confirmDeleteBtn, "click", confirmDeleteProduct);

    bindIf(el.deleteConfirmModal, "click", (event) => {
      if (event.target === el.deleteConfirmModal) {
        closeDeleteConfirm();
      }
    });
  }

  function initAdminProductPage() {
    if (pageType !== "admin-product") return;

    if (!isAdminLoggedIn()) {
      window.location.href = "admin.html";
      return;
    }

    bindIf(el.adminLogoutBtn, "click", adminLogout);
    bindIf(el.saveProductBtn, "click", saveProductFromAdminPage);
    bindIf(el.resetProductBtn, "click", clearAdminProductForm);
    bindIf(el.adminMainImage, "change", handleMainImagePreview);
    bindIf(el.adminGalleryImages, "change", handleGalleryPreview);

    loadProductIntoAdminFormIfEditing();
  }

  function updateCounts() {
    if (el.cartCount) {
      el.cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    if (el.favoritesCount) {
      el.favoritesCount.textContent = favorites.length;
    }
  }

  function renderProducts(sourceList = null) {
    if (!el.productsGrid) return;

    const list = sourceList || products;
    const keyword = (el.searchInput?.value || "").trim().toLowerCase();

    const filtered = list.filter((product) => {
      return (
        product.name.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword)
      );
    });

    if (!filtered.length) {
      el.productsGrid.innerHTML = `<div class="empty-products">ماكو منتجات مطابقة للبحث.</div>`;
      updateCounts();
      return;
    }

    el.productsGrid.innerHTML = filtered.map((product) => {
      const isFavorite = favorites.includes(product.id);

      return `
        <div class="product-card">
          <button class="favorite-toggle ${isFavorite ? "active" : ""}" data-id="${product.id}" title="مفضلة">❤</button>

          <a href="product.html?id=${product.id}" class="product-card-link">
            <div class="product-image ${product.mainImage ? "has-image" : ""}">
              ${
                product.mainImage
                  ? `<img src="${product.mainImage}" alt="${product.name}">`
                  : `<div class="product-placeholder-text">${product.name}</div>`
              }
            </div>
          </a>

          <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>

            <div class="product-bottom">
              <span class="price">${formatPrice(product.price)}</span>
              <div class="product-card-actions">
                <a href="product.html?id=${product.id}" class="product-detail-btn product-card-view-btn">عرض المنتج</a>
                <button class="add-cart-btn product-card-view-btn quick-add-btn" type="button" data-id="${product.id}">
                  أضف للسلة
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    document.querySelectorAll(".favorite-toggle").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(Number(button.dataset.id));
      });
    });

    document.querySelectorAll(".quick-add-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        addToCart(Number(button.dataset.id), true);
      });
    });

    updateCounts();
  }

  function renderFavoritesView() {
    if (pageType !== "home") {
      window.location.href = "index.html";
      return;
    }

    const favoriteProducts = products.filter((product) => favorites.includes(product.id));

    if (!favoriteProducts.length) {
      showToast("ما عندك منتجات بالمفضلة حالياً", "warning");
      return;
    }

    renderProducts(favoriteProducts);
    window.location.href = "#products";
  }

  function toggleFavorite(id) {
    if (favorites.includes(id)) {
      favorites = favorites.filter((favId) => favId !== id);
      showToast("تمت إزالة المنتج من المفضلة", "info");
    } else {
      favorites.push(id);
      showToast("تمت إضافة المنتج إلى المفضلة", "success");
    }

    writeStorage(STORAGE_KEYS.favorites, favorites);

    if (pageType === "product") {
      renderProductDetailsPage();
    } else {
      renderProducts();
    }

    updateCounts();
  }

  function addToCart(id, showMessage = false) {
    const found = cart.find((item) => Number(item.id) === Number(id));
    if (found) {
      found.quantity += 1;
    } else {
      cart.push({ id: Number(id), quantity: 1 });
    }

    writeStorage(STORAGE_KEYS.cart, cart);
    renderCart();

    if (showMessage) {
      showToast("تمت إضافة المنتج إلى السلة", "success");
    }
  }

  function removeFromCart(id) {
    cart = cart.filter((item) => Number(item.id) !== Number(id));
    writeStorage(STORAGE_KEYS.cart, cart);
    renderCart();
    showToast("تم حذف المنتج من السلة", "error");
  }

  function changeQty(id, amount) {
    const item = cart.find((entry) => Number(entry.id) === Number(id));
    if (!item) return;

    item.quantity += amount;
    if (item.quantity <= 0) {
      removeFromCart(id);
      return;
    }

    writeStorage(STORAGE_KEYS.cart, cart);
    renderCart();
  }

  function renderCart() {
    if (!el.cartItems || !el.cartTotal) return;

    if (!cart.length) {
      el.cartItems.innerHTML = `<div class="empty-state">السلة فارغة حالياً.</div>`;
      el.cartTotal.textContent = "0 د.ع";
      updateCounts();
      return;
    }

    const detailed = cart.map((item) => {
      const product = getProductById(item.id);
      return product
        ? { ...product, quantity: item.quantity, total: Number(product.price) * Number(item.quantity) }
        : null;
    }).filter(Boolean);

    el.cartItems.innerHTML = detailed.map((item) => `
      <div class="cart-item">
        <div class="cart-item-thumb">${item.name}</div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="item-price">${formatPrice(item.price)} × ${item.quantity}</div>
          <div class="cart-actions">
            <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
            <span class="qty-count">${item.quantity}</span>
            <button class="qty-btn" data-action="dec" data-id="${item.id}">-</button>
          </div>
          <button class="remove-btn" data-action="remove" data-id="${item.id}">حذف</button>
        </div>
      </div>
    `).join("");

    const total = detailed.reduce((sum, item) => sum + item.total, 0);
    el.cartTotal.textContent = formatPrice(total);

    el.cartItems.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = Number(button.dataset.id);
        const action = button.dataset.action;
        if (action === "inc") changeQty(id, 1);
        if (action === "dec") changeQty(id, -1);
        if (action === "remove") removeFromCart(id);
      });
    });

    updateCounts();
  }

  function openCart() {
    if (!el.cartDrawer || !el.drawerOverlay) return;
    el.cartDrawer.classList.add("open");
    el.drawerOverlay.classList.add("show");
  }

  function closeCart() {
    if (!el.cartDrawer || !el.drawerOverlay) return;
    el.cartDrawer.classList.remove("open");
    el.drawerOverlay.classList.remove("show");
  }

  function openInvoice() {
    if (!cart.length || !el.invoiceModal || !el.invoiceBody) {
      if (!cart.length) showToast("السلة فارغة", "warning");
      return;
    }

    const detailed = cart.map((item) => {
      const product = getProductById(item.id);
      return product
        ? { ...product, quantity: item.quantity, total: Number(product.price) * Number(item.quantity) }
        : null;
    }).filter(Boolean);

    const total = detailed.reduce((sum, item) => sum + item.total, 0);

    el.invoiceBody.innerHTML = `
      ${detailed.map((item) => `
        <div class="invoice-item">
          <div>
            <div class="invoice-item-title">${item.name}</div>
            <div class="invoice-item-sub">الكمية: ${item.quantity} × ${formatPrice(item.price)}</div>
          </div>
          <strong>${formatPrice(item.total)}</strong>
        </div>
      `).join("")}
      <div class="invoice-summary">
        <div class="invoice-summary-row">
          <span>عدد القطع</span>
          <span>${detailed.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </div>
        <div class="invoice-summary-row">
          <strong>المجموع الكلي</strong>
          <strong>${formatPrice(total)}</strong>
        </div>
      </div>
    `;

    el.invoiceModal.classList.add("show");
  }

  function closeInvoice() {
    if (el.invoiceModal) el.invoiceModal.classList.remove("show");
  }

  function openDeleteConfirm(productId, productName = "هذا المنتج") {
    pendingDeleteProductId = Number(productId);

    if (el.deleteConfirmText) {
      el.deleteConfirmText.textContent = `هل تريد حذف المنتج: ${productName} ؟`;
    }

    if (el.deleteConfirmModal) {
      el.deleteConfirmModal.classList.add("show");
    }
  }

  function closeDeleteConfirm() {
    pendingDeleteProductId = null;

    if (el.deleteConfirmModal) {
      el.deleteConfirmModal.classList.remove("show");
    }
  }

  function confirmDeleteProduct() {
    if (pendingDeleteProductId === null) return;

    const id = Number(pendingDeleteProductId);

    products = products.filter((product) => Number(product.id) !== id);
    cart = cart.filter((item) => Number(item.id) !== id);
    favorites = favorites.filter((favId) => Number(favId) !== id);

    writeStorage(STORAGE_KEYS.products, products);
    writeStorage(STORAGE_KEYS.cart, cart);
    writeStorage(STORAGE_KEYS.favorites, favorites);

    renderAdminProducts();
    renderAdminOrders();
    closeDeleteConfirm();
    showToast("تم حذف المنتج", "error");
  }

  function getCustomerLocation() {
    if (!navigator.geolocation) {
      showToast("المتصفح لا يدعم تحديد الموقع", "error");
      return;
    }

    if (el.getLocationBtn) {
      el.getLocationBtn.textContent = "جاري تحديد الموقع...";
      el.getLocationBtn.disabled = true;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

        if (el.customerMapLink) {
          el.customerMapLink.value = mapLink;
        }

        if (el.getLocationBtn) {
          el.getLocationBtn.textContent = "تم تحديد الموقع";
          el.getLocationBtn.disabled = false;
        }

        showToast("تم تحديد الموقع بنجاح", "success");
      },
      () => {
        if (el.getLocationBtn) {
          el.getLocationBtn.textContent = "تحديد موقعي";
          el.getLocationBtn.disabled = false;
        }
        showToast("تعذر تحديد الموقع، تأكد من تفعيل الموقع", "error");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }

  function sendOrderToWhatsApp() {
    const customerName = el.customerName?.value.trim() || "";
    const customerPhone = el.customerPhone?.value.trim() || "";
    const customerLocation = el.customerLocation?.value.trim() || "";
    const customerMapLink = el.customerMapLink?.value.trim() || "";
    const customerNotes = el.customerNotes?.value.trim() || "";

    if (!customerName || !customerPhone || (!customerLocation && !customerMapLink)) {
      showToast("يرجى إدخال الاسم ورقم الهاتف وتحديد الموقع", "warning");
      return;
    }

    const detailed = cart.map((item) => {
      const product = getProductById(item.id);
      return product
        ? { ...product, quantity: item.quantity, total: Number(product.price) * Number(item.quantity) }
        : null;
    }).filter(Boolean);

    const total = detailed.reduce((sum, item) => sum + item.total, 0);

    const message = `السلام عليكم
أرغب بطلب المنتجات التالية:

${detailed.map((item) => `- ${item.name} | الكمية: ${item.quantity} | ${formatPrice(item.total)}`).join("\n")}

المجموع الكلي: ${formatPrice(total)}

معلومات الزبون:
الاسم الثلاثي: ${customerName}
رقم الهاتف: ${customerPhone}
الموقع كتابة: ${customerLocation || "ما مضاف"}
رابط الموقع: ${customerMapLink || "ما مضاف"}
ملاحظات الطلب: ${customerNotes || "ماكو"}`;

    orders.unshift({
      id: Date.now(),
      createdAt: new Date().toLocaleString("ar-IQ"),
      customerName,
      customerPhone,
      customerLocation,
      customerMapLink,
      customerNotes,
      items: detailed,
      total,
    });

    writeStorage(STORAGE_KEYS.orders, orders);

    showToast("تم تجهيز الطلب وفتح واتساب", "success");

    setTimeout(() => {
      window.open(`https://wa.me/9640000000000?text=${encodeURIComponent(message)}`, "_blank");
    }, 400);
  }

  function renderProductDetailsPage() {
    if (!el.productDetailsContainer) return;

    const id = new URLSearchParams(window.location.search).get("id");
    const product = getProductById(id);

    if (!product) {
      el.productDetailsContainer.innerHTML = `
        <div class="product-empty-box">
          <h2>المنتج غير موجود</h2>
          <p style="margin: 16px 0; color:#c7cde8;">المنتج المطلوب غير متوفر حالياً.</p>
          <a href="index.html#products" class="hero-btn">الرجوع للمنتجات</a>
        </div>
      `;
      updateCounts();
      return;
    }

    const isFavorite = favorites.includes(product.id);
    const hasGalleryImages = product.galleryImages && product.galleryImages.length > 0;
    const firstImage = hasGalleryImages ? product.galleryImages[0] : null;
    const firstLabel = product.gallery?.[0] || `${product.name} - صورة 1`;

    el.productDetailsContainer.innerHTML = `
      <div class="product-page-card">
        <div class="product-gallery">
          <div class="product-main-image ${firstImage ? "has-image" : ""}">
            ${
              firstImage
                ? `<img src="${firstImage}" alt="${product.name}" id="productMainImageElement">`
                : `<div class="product-main-placeholder" id="productMainPlaceholder">${firstLabel}</div>`
            }
          </div>

          <div class="product-thumbs">
            ${
              hasGalleryImages
                ? product.galleryImages.map((img, index) => `
                    <button class="product-thumb has-image ${index === 0 ? "active" : ""}" type="button" data-image="${img}">
                      <img src="${img}" alt="${product.name}">
                    </button>
                  `).join("")
                : product.gallery.map((label, index) => `
                    <button class="product-thumb ${index === 0 ? "active" : ""}" type="button" data-label="${label}">
                      ${label}
                    </button>
                  `).join("")
            }
          </div>
        </div>

        <div class="product-details-box">
          <h2>${product.name}</h2>
          <div class="product-detail-price">${formatPrice(product.price)}</div>
          <p class="product-detail-desc">${product.description}</p>

          <div class="product-meta-list">
            <div class="product-meta-item"><strong>القسم:</strong> ${product.details.category}</div>
            <div class="product-meta-item"><strong>رمز المنتج:</strong> ${product.details.sku}</div>
            <div class="product-meta-item"><strong>الحالة:</strong> ${product.details.availability}</div>
          </div>

          <div class="product-detail-actions">
            <button class="product-detail-btn" id="detailAddToCartBtn" type="button">أضف للسلة</button>
            <button class="product-detail-btn" id="detailFavoriteBtn" type="button">
              ${isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
            </button>
            <button class="product-back-btn" type="button" onclick="window.location.href='index.html#products'">
              رجوع للمنتجات
            </button>
          </div>
        </div>
      </div>
    `;

    const mainImageElement = document.getElementById("productMainImageElement");
    const mainPlaceholder = document.getElementById("productMainPlaceholder");
    const thumbs = document.querySelectorAll(".product-thumb");
    const addBtn = document.getElementById("detailAddToCartBtn");
    const favoriteBtn = document.getElementById("detailFavoriteBtn");

    thumbs.forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.image && mainImageElement) mainImageElement.src = button.dataset.image;
        if (button.dataset.label && mainPlaceholder) mainPlaceholder.textContent = button.dataset.label;
        thumbs.forEach((thumb) => thumb.classList.remove("active"));
        button.classList.add("active");
      });
    });

    if (addBtn) {
      addBtn.addEventListener("click", () => {
        addToCart(product.id, true);
        addBtn.textContent = "تمت الإضافة";
        setTimeout(() => {
          addBtn.textContent = "أضف للسلة";
        }, 1000);
      });
    }

    if (favoriteBtn) {
      favoriteBtn.addEventListener("click", () => {
        toggleFavorite(product.id);
      });
    }

    updateCounts();
  }

  function updateAdminUI() {
    const logged = isAdminLoggedIn();

    if (el.accountBox) el.accountBox.classList.toggle("hidden", logged);
    if (el.adminPanel) el.adminPanel.classList.toggle("hidden", !logged);
    if (el.adminLogoutBtn) el.adminLogoutBtn.classList.toggle("hidden", !logged);
    if (el.adminNavWrap) el.adminNavWrap.classList.toggle("hidden", !logged);

    if (logged) {
      renderAdminProducts();
      renderAdminOrders();
      showToast("تم تسجيل الدخول إلى وضع الإدارة", "success");
    }
  }

  function adminLogin() {
    const phone = el.adminPhone?.value.trim() || "";
    const password = el.adminPassword?.value.trim() || "";

    if (phone === ADMIN.phone && password === ADMIN.password) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      if (el.adminLoginMessage) el.adminLoginMessage.textContent = "";
      updateAdminUI();
    } else if (el.adminLoginMessage) {
      el.adminLoginMessage.textContent = "هذا الحساب ما عنده صلاحيات الإدارة.";
      showToast("فشل تسجيل الدخول", "error");
    }
  }

  function adminLogout() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    showToast("تم تسجيل الخروج", "info");
    setTimeout(() => {
      window.location.href = "admin.html";
    }, 300);
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function filesToBase64(files) {
    const output = [];
    for (const file of files) {
      output.push(await fileToBase64(file));
    }
    return output;
  }

  function handleMainImagePreview() {
    if (!el.adminMainImage || !el.adminMainImagePreview) return;
    const file = el.adminMainImage.files[0];
    if (!file) {
      el.adminMainImagePreview.innerHTML = "ماكو صورة";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      el.adminMainImagePreview.innerHTML = `<img src="${reader.result}" alt="main preview">`;
    };
    reader.readAsDataURL(file);
  }

  function handleGalleryPreview() {
    if (!el.adminGalleryImages || !el.adminGalleryPreview) return;
    const files = Array.from(el.adminGalleryImages.files || []);
    el.adminGalleryPreview.innerHTML = "";
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const item = document.createElement("div");
        item.className = "gallery-preview-item";
        item.innerHTML = `<img src="${reader.result}" alt="gallery preview">`;
        el.adminGalleryPreview.appendChild(item);
      };
      reader.readAsDataURL(file);
    });
  }

  function clearAdminProductForm() {
    if (el.adminProductId) el.adminProductId.value = "";
    if (el.adminProductName) el.adminProductName.value = "";
    if (el.adminProductPrice) el.adminProductPrice.value = "";
    if (el.adminProductDescription) el.adminProductDescription.value = "";
    if (el.adminProductCategory) el.adminProductCategory.value = "";
    if (el.adminProductSku) el.adminProductSku.value = "";
    if (el.adminProductStatus) el.adminProductStatus.value = "";
    if (el.adminMainImage) el.adminMainImage.value = "";
    if (el.adminGalleryImages) el.adminGalleryImages.value = "";
    if (el.adminMainImagePreview) el.adminMainImagePreview.innerHTML = "ماكو صورة";
    if (el.adminGalleryPreview) el.adminGalleryPreview.innerHTML = "";
    if (el.adminProductMessage) el.adminProductMessage.textContent = "";
    showToast("تم تصفير الحقول", "info");
  }

  function loadProductIntoAdminFormIfEditing() {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
      if (el.adminProductPageTitle) el.adminProductPageTitle.textContent = "إضافة منتج جديد";
      return;
    }

    const product = getProductById(id);
    if (!product) return;

    if (el.adminProductPageTitle) el.adminProductPageTitle.textContent = "تعديل المنتج";
    if (el.adminProductId) el.adminProductId.value = product.id;
    if (el.adminProductName) el.adminProductName.value = product.name;
    if (el.adminProductPrice) el.adminProductPrice.value = product.price;
    if (el.adminProductDescription) el.adminProductDescription.value = product.description;
    if (el.adminProductCategory) el.adminProductCategory.value = product.details.category;
    if (el.adminProductSku) el.adminProductSku.value = product.details.sku;
    if (el.adminProductStatus) el.adminProductStatus.value = product.details.availability;

    if (el.adminMainImagePreview) {
      el.adminMainImagePreview.innerHTML = product.mainImage
        ? `<img src="${product.mainImage}" alt="main image">`
        : "ماكو صورة";
    }

    if (el.adminGalleryPreview) {
      el.adminGalleryPreview.innerHTML = "";
      (product.galleryImages || []).forEach((img) => {
        const item = document.createElement("div");
        item.className = "gallery-preview-item";
        item.innerHTML = `<img src="${img}" alt="gallery image">`;
        el.adminGalleryPreview.appendChild(item);
      });
    }
  }

  async function saveProductFromAdminPage() {
    const id = Number(el.adminProductId?.value || 0);
    const name = el.adminProductName?.value.trim() || "";
    const price = Number(el.adminProductPrice?.value || 0);
    const description = el.adminProductDescription?.value.trim() || "";
    const category = el.adminProductCategory?.value.trim() || "";
    const sku = el.adminProductSku?.value.trim() || "";
    const status = el.adminProductStatus?.value.trim() || "";

    if (!name || !price || !description || !category || !sku || !status) {
      if (el.adminProductMessage) el.adminProductMessage.textContent = "يرجى ملء جميع الحقول.";
      showToast("يرجى ملء جميع الحقول", "warning");
      return;
    }

    const mainImageFile = el.adminMainImage?.files?.[0] || null;
    const galleryFiles = Array.from(el.adminGalleryImages?.files || []);

    let mainImageBase64 = "";
    let galleryImagesBase64 = [];

    if (mainImageFile) {
      mainImageBase64 = await fileToBase64(mainImageFile);
    }

    if (galleryFiles.length) {
      if (galleryFiles.length < 4 || galleryFiles.length > 5) {
        if (el.adminProductMessage) el.adminProductMessage.textContent = "صور صفحة المنتج لازم تكون 4 أو 5 صور.";
        showToast("صور صفحة المنتج لازم تكون 4 أو 5 صور", "warning");
        return;
      }
      galleryImagesBase64 = await filesToBase64(galleryFiles);
    }

    if (id) {
      products = products.map((product) => {
        if (Number(product.id) !== id) return product;
        return {
          ...product,
          name,
          price,
          description,
          details: { category, sku, availability: status },
          mainImage: mainImageBase64 || product.mainImage || "",
          galleryImages: galleryImagesBase64.length ? galleryImagesBase64 : (product.galleryImages || []),
          gallery: galleryImagesBase64.length
            ? galleryImagesBase64.map((_, index) => `${name} - صورة ${index + 1}`)
            : (product.gallery || []),
        };
      });
    } else {
      const newId = products.length ? Math.max(...products.map((p) => Number(p.id))) + 1 : 1;

      products.push({
        id: newId,
        name,
        price,
        description,
        details: { category, sku, availability: status },
        mainImage: mainImageBase64 || "",
        galleryImages: galleryImagesBase64,
        gallery: galleryImagesBase64.length
          ? galleryImagesBase64.map((_, index) => `${name} - صورة ${index + 1}`)
          : [`${name} - صورة 1`, `${name} - صورة 2`, `${name} - صورة 3`, `${name} - صورة 4`],
      });
    }

    writeStorage(STORAGE_KEYS.products, products);

    if (el.adminProductMessage) {
      el.adminProductMessage.textContent = "تم حفظ المنتج بنجاح.";
    }

    showToast("تم حفظ المنتج بنجاح", "success");

    setTimeout(() => {
      window.location.href = "admin.html#adminProducts";
    }, 700);
  }

  function renderAdminProducts() {
    if (!el.adminProductsList) return;

    if (!products.length) {
      el.adminProductsList.innerHTML = `<div class="empty-products">ماكو منتجات حالياً.</div>`;
      return;
    }

    el.adminProductsList.innerHTML = products.map((product) => `
      <div class="admin-list-item">
        <h5>${product.name}</h5>
        <p>السعر: ${formatPrice(product.price)}</p>
        <p>القسم: ${product.details.category}</p>
        <p>رمز المنتج: ${product.details.sku}</p>
        <p>الحالة: ${product.details.availability}</p>

        <div class="admin-item-actions">
          <button type="button" data-edit-id="${product.id}">تعديل</button>
          <button type="button" data-delete-id="${product.id}">حذف</button>
        </div>
      </div>
    `).join("");

    el.adminProductsList.querySelectorAll("[data-edit-id]").forEach((button) => {
      button.addEventListener("click", () => {
        window.location.href = `admin-product.html?id=${button.dataset.editId}`;
      });
    });

    el.adminProductsList.querySelectorAll("[data-delete-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = Number(button.dataset.deleteId);
        const product = getProductById(id);
        openDeleteConfirm(id, product?.name || "هذا المنتج");
      });
    });
  }

  function renderAdminOrders() {
    if (!el.adminOrdersList) return;

    if (!orders.length) {
      el.adminOrdersList.innerHTML = `<div class="empty-products">ماكو طلبات حالياً.</div>`;
      return;
    }

    el.adminOrdersList.innerHTML = orders.map((order) => `
      <div class="admin-list-item">
        <h5>طلب رقم: ${order.id}</h5>
        <p>الوقت: ${order.createdAt || "بدون وقت"}</p>
        <p>الاسم: ${order.customerName}</p>
        <p>الرقم: ${order.customerPhone}</p>
        <p>الموقع: ${order.customerLocation || "ما مضاف"}</p>
        <p>رابط الخرائط: ${order.customerMapLink || "ما مضاف"}</p>
        <p>الملاحظات: ${order.customerNotes || "ماكو"}</p>
        <p>المجموع: ${formatPrice(order.total)}</p>
        <p>المنتجات: ${(order.items || []).map((item) => `${item.name} (${item.quantity})`).join(" - ")}</p>
      </div>
    `).join("");
  }
});
