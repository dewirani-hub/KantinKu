// =========================================================
// DAFTAR AKUN RESMI (VALIDASI LOGIN)
// Tambahkan/ubah data akun pembeli & penjual di sini
// =========================================================
const accounts = {
    // Akun Pembeli (Siswa) -> dicocokkan berdasarkan NISN & Nama
    buyers: [
        { nisn: '0051234567', name: 'Ahmad Fauzi' },
        { nisn: '0051234568', name: 'Siti Nurhaliza' },
        { nisn: '0051234569', name: 'Budi Santoso' }
    ],
    // Akun Penjual (Kantin) -> dicocokkan berdasarkan Nama Stand & Password
    sellers: [
        { name: 'Kantin Bu Ani', password: 'kantin123' },
        { name: 'Kantin Pak Joko', password: 'kantin456' }
    ]
};

// STATE MANAGEMENT & VARIASI MENU LENGKAP
const state = {
    currentUser: null,
    products: [
        // MAKANAN UTAMA
        { id: 1, name: 'Ayam Geprek Sambal Ijo', price: 12000, stock: 5, category: 'makanan', seller: 'Kantin Bu Ani', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&auto=format&fit=crop&q=80' },
        { id: 2, name: 'Mie Ayam Bakso Special', price: 13000, stock: 10, category: 'makanan', seller: 'Kantin Bu Ani', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=80' },
        { id: 3, name: 'Nasi Goreng Telur Spesial', price: 11000, stock: 8, category: 'makanan', seller: 'Kantin Bu Ani', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop&q=80' },
        { id: 4, name: 'Soto Ayam Lamongan + Nasi', price: 12000, stock: 12, category: 'makanan', seller: 'Kantin Pak Joko', image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?w=400&auto=format&fit=crop&q=80' },
        { id: 5, name: 'Nasi Uduk Komplit Ayam Suwir', price: 10000, stock: 3, category: 'makanan', seller: 'Kantin Pak Joko', image: 'https://images.unsplash.com/photo-1630409351241-e90e7f5e434d?w=400&auto=format&fit=crop&q=80' },

        // CAMILAN / SNACK
        { id: 6, name: 'Roti Bakar Cokelat Keju', price: 8000, stock: 10, category: 'camilan', seller: 'Kantin Bu Ani', image: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=400&auto=format&fit=crop&q=80' },
        { id: 7, name: 'Kentang Goreng (French Fries)', price: 7000, stock: 15, category: 'camilan', seller: 'Kantin Pak Joko', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop&q=80' },
        { id: 8, name: 'Pisang Cokelat Lumer (Piscok)', price: 5000, stock: 20, category: 'camilan', seller: 'Kantin Pak Joko', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop&q=80' },

        // MINUMAN
        { id: 9, name: 'Es Teh Manis Jumbo', price: 4000, stock: 30, category: 'minuman', seller: 'Kantin Bu Ani', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&auto=format&fit=crop&q=80' },
        { id: 10, name: 'Es Jeruk Peras Segar', price: 5000, stock: 25, category: 'minuman', seller: 'Kantin Bu Ani', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&auto=format&fit=crop&q=80' },
        { id: 11, name: 'Es Matcha Latte', price: 8000, stock: 12, category: 'minuman', seller: 'Kantin Pak Joko', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&auto=format&fit=crop&q=80' },
        { id: 12, name: 'Susu UHT Cokelat 250ml', price: 6000, stock: 18, category: 'minuman', seller: 'Kantin Pak Joko', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format&fit=crop&q=80' }
    ],
    cart: [],
    // Kosong dari awal -> pesanan baru muncul kalau memang ada transaksi asli
    orders: []
};

document.addEventListener('DOMContentLoaded', () => {
    loadStateFromStorage();
    initTimer();
    renderProducts();
    renderCart();
    renderActiveOrders();
    renderSellerDashboard();
});

// =========================================================
// PENYIMPANAN DATA (localStorage)
// Supaya data produk & pesanan tidak hilang saat refresh
// =========================================================
const STORAGE_KEY = 'kantinku_data';

// Akun pembeli yang mendaftar otomatis saat login pertama kali
// (di luar daftar resmi accounts.buyers)
let selfRegisteredBuyers = [];

function getAllBuyerAccounts() {
    return [...accounts.buyers, ...selfRegisteredBuyers];
}

function saveStateToStorage() {
    try {
        const dataToSave = {
            products: state.products,
            orders: state.orders,
            buyers: selfRegisteredBuyers
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (err) {
        console.error('Gagal menyimpan data:', err);
    }
}

function loadStateFromStorage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;

        const parsed = JSON.parse(saved);
        if (parsed.products && Array.isArray(parsed.products)) {
            state.products = parsed.products;
        }
        if (parsed.orders && Array.isArray(parsed.orders)) {
            state.orders = parsed.orders;
        }
        if (parsed.buyers && Array.isArray(parsed.buyers)) {
            selfRegisteredBuyers = parsed.buyers;
        }
    } catch (err) {
        console.error('Gagal memuat data tersimpan:', err);
    }
}

function showSection(sectionId) {
    ['login-view', 'student-view', 'seller-view'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');

    const userBar = document.getElementById('user-bar');
    if (state.currentUser) {
        userBar.classList.remove('hidden');
        document.getElementById('user-name-display').innerText = state.currentUser.name;
        document.getElementById('user-role-display').innerText = state.currentUser.role === 'buyer' ? 'Pembeli (Siswa)' : 'Penjual (Kantin)';
    } else {
        userBar.classList.add('hidden');
    }
}

function switchLoginRole(role) {
    const tabBuyer = document.getElementById('tab-buyer');
    const tabSeller = document.getElementById('tab-seller');
    const formBuyer = document.getElementById('form-buyer');
    const formSeller = document.getElementById('form-seller');

    if (role === 'buyer') {
        tabBuyer.className = 'py-2 text-sm font-semibold rounded-lg bg-white text-indigo-600 shadow-sm';
        tabSeller.className = 'py-2 text-sm font-semibold rounded-lg text-slate-600';
        formBuyer.classList.remove('hidden');
        formSeller.classList.add('hidden');
    } else {
        tabSeller.className = 'py-2 text-sm font-semibold rounded-lg bg-white text-amber-600 shadow-sm';
        tabBuyer.className = 'py-2 text-sm font-semibold rounded-lg text-slate-600';
        formSeller.classList.remove('hidden');
        formBuyer.classList.add('hidden');
    }
}

function loginBuyer(e) {
    e.preventDefault();
    const nisn = document.getElementById('nisn-input').value.trim();
    const name = document.getElementById('student-name-input').value.trim();
    if (!nisn || !name) return alert('Lengkapi data Anda.');

    // Validasi format: NISN harus angka, minimal 6 digit
    if (!/^\d{6,}$/.test(nisn)) {
        return alert('NISN tidak valid. Masukkan NISN berupa angka (minimal 6 digit).');
    }

    const matchedBuyer = getAllBuyerAccounts().find(b => b.nisn === nisn);

    if (matchedBuyer) {
        // NISN sudah pernah dipakai -> nama wajib cocok dengan yang terdaftar
        if (matchedBuyer.name.toLowerCase() !== name.toLowerCase()) {
            return alert('Nama tidak sesuai dengan NISN yang sudah terdaftar. Periksa kembali data Anda.');
        }
        state.currentUser = { name: matchedBuyer.name, nisn, role: 'buyer' };
    } else {
        // NISN baru -> daftarkan otomatis, dan kunci nama untuk NISN ini seterusnya
        selfRegisteredBuyers.push({ nisn, name });
        saveStateToStorage();
        state.currentUser = { name, nisn, role: 'buyer' };
    }

    showSection('student-view');
    renderActiveOrders();
}

function loginSeller(e) {
    e.preventDefault();
    const name = document.getElementById('seller-name-input').value.trim();
    const pass = document.getElementById('seller-pass-input').value;
    if (!name || !pass) return alert('Lengkapi data login kantin.');

    // Validasi: nama stand & password harus cocok dengan akun terdaftar
    const matchedSeller = accounts.sellers.find(
        s => s.name.toLowerCase() === name.toLowerCase() && s.password === pass
    );

    if (!matchedSeller) {
        return alert('Nama stand atau password salah. Silakan coba lagi.');
    }

    state.currentUser = { name: matchedSeller.name, role: 'seller' };
    renderSellerDashboard();
    showSection('seller-view');
}

function logout() {
    state.currentUser = null;
    state.cart = [];
    renderCart();
    showSection('login-view');
}

function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    const category = document.getElementById('category-filter')?.value || 'all';

    const filtered = state.products.filter(p => {
        return p.name.toLowerCase().includes(searchTerm) && (category === 'all' || p.category === category);
    });

    filtered.forEach(p => {
        const isLowStock = p.stock > 0 && p.stock <= 5;
        const isOutOfStock = p.stock <= 0;

        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition';
        card.innerHTML = `
            <div>
                <div class="relative h-36 bg-slate-100 overflow-hidden">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover">
                    ${isLowStock ? `<span class="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">⚠️ Stok sisa ${p.stock}</span>` : ''}
                    ${isOutOfStock ? `<span class="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">Habis</span>` : ''}
                </div>
                <div class="p-3.5">
                    <h4 class="font-bold text-slate-800 text-sm">${p.name}</h4>
                    <p class="text-[10px] text-slate-400 font-medium mt-0.5"><i class="fa-solid fa-store mr-1"></i>${p.seller || 'Kantin'}</p>
                    <p class="text-xs text-indigo-600 font-bold mt-1">Rp${p.price.toLocaleString('id-ID')}</p>
                </div>
            </div>
            <div class="px-3.5 pb-3.5">
                <button onclick="addToCart(${p.id})" ${isOutOfStock ? 'disabled' : ''} class="w-full py-2 px-3 rounded-xl font-semibold text-xs ${isOutOfStock ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition'}">
                    ${isOutOfStock ? 'Stok Habis' : 'Pesan Sekarang'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterMenu() { renderProducts(); }

function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product || product.stock <= 0) return;

    const cartItem = state.cart.find(item => item.productId === productId);
    if (cartItem) {
        if (cartItem.qty + 1 > product.stock) return alert('Stok tidak mencukupi!');
        cartItem.qty++;
    } else {
        state.cart.push({ productId, qty: 1 });
    }
    renderCart();
}

function updateCartQty(productId, delta) {
    const index = state.cart.findIndex(item => item.productId === productId);
    if (index === -1) return;

    const product = state.products.find(p => p.id === productId);
    const newQty = state.cart[index].qty + delta;

    if (newQty > product.stock) return alert('Stok tidak mencukupi!');
    if (newQty <= 0) state.cart.splice(index, 1);
    else state.cart[index].qty = newQty;

    renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const summary = document.getElementById('cart-summary');
    if (!container) return;
    container.innerHTML = '';

    if (state.cart.length === 0) {
        container.innerHTML = `<p class="text-center py-6 text-slate-400 text-xs">Keranjang masih kosong</p>`;
        summary.classList.add('hidden');
        return;
    }

    summary.classList.remove('hidden');
    let totalCount = 0;
    let totalPrice = 0;

    state.cart.forEach(item => {
        const product = state.products.find(p => p.id === item.productId);
        if (!product) return;

        const subtotal = product.price * item.qty;
        totalCount += item.qty;
        totalPrice += subtotal;

        container.innerHTML += `
            <div class="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div class="flex-grow pr-2">
                    <p class="font-semibold text-slate-800">${product.name}</p>
                    <p class="text-slate-500 text-[10px]">Rp${product.price.toLocaleString('id-ID')}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <div class="flex items-center border rounded-lg bg-white">
                        <button onclick="updateCartQty(${product.id}, -1)" class="px-2 py-0.5 font-bold">-</button>
                        <span class="px-2 font-bold">${item.qty}</span>
                        <button onclick="updateCartQty(${product.id}, 1)" class="px-2 py-0.5 font-bold">+</button>
                    </div>
                    <span class="font-bold text-indigo-600 min-w-[50px] text-right">Rp${subtotal.toLocaleString('id-ID')}</span>
                </div>
            </div>
        `;
    });

    document.getElementById('cart-total-count').innerText = totalCount;
    document.getElementById('cart-total-price').innerText = `Rp${totalPrice.toLocaleString('id-ID')}`;
}

function openCheckoutModal() {
    if (state.cart.length === 0) return;

    const selectedSession = document.querySelector('input[name="break-session"]:checked').value;
    let total = 0;
    state.cart.forEach(item => {
        const p = state.products.find(x => x.id === item.productId);
        if (p) total += p.price * item.qty;
    });

    document.getElementById('qris-target-session').innerText = selectedSession;
    document.getElementById('qris-total-amount').innerText = `Rp${total.toLocaleString('id-ID')}`;
    document.getElementById('qris-modal').classList.remove('hidden');
}

function closeQrisModal() {
    document.getElementById('qris-modal').classList.add('hidden');
}

function confirmPaymentSimulated() {
    if (!state.currentUser) return;

    const selectedSession = document.querySelector('input[name="break-session"]:checked').value;
    let total = 0;
    const items = [];

    // Mengurangi stok secara otomatis (Sistem Anti-Kehabisan)
    state.cart.forEach(cartItem => {
        const product = state.products.find(p => p.id === cartItem.productId);
        if (product) {
            product.stock -= cartItem.qty;
            total += product.price * cartItem.qty;
            items.push({ id: product.id, name: product.name, price: product.price, qty: cartItem.qty, seller: product.seller });
        }
    });

    const newOrderCode = '#A' + Math.floor(100 + Math.random() * 900);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder = {
        id: newOrderCode,
        buyerName: state.currentUser.name,
        session: selectedSession,
        items: items,
        total: total,
        status: 'Pembayaran Berhasil',
        time: timeStr
    };

    state.orders.unshift(newOrder);
    state.cart = [];

    saveStateToStorage();
    closeQrisModal();
    renderProducts();
    renderCart();
    renderActiveOrders();
    renderSellerDashboard();

    alert(`Pembayaran Berhasil!\nKode Pesanan: ${newOrderCode}\nStatus: Pembayaran Berhasil\nAmbil saat: ${selectedSession}`);
}

function renderActiveOrders() {
    const container = document.getElementById('active-orders-list');
    if (!container) return;
    container.innerHTML = '';
    if (!state.currentUser) return;

    const myOrders = state.orders.filter(o => o.buyerName === state.currentUser.name);

    if (myOrders.length === 0) {
        container.innerHTML = `<p class="text-center text-xs text-slate-400 py-4">Belum ada pesanan aktif.</p>`;
        return;
    }

    myOrders.forEach(o => {
        let statusBadgeClass = 'bg-amber-100 text-amber-700';
        if (o.status === 'Sedang Disiapkan') statusBadgeClass = 'bg-blue-100 text-blue-700';
        if (o.status === 'Siap Diambil') statusBadgeClass = 'bg-emerald-100 text-emerald-700 font-bold animate-pulse';
        if (o.status === 'Selesai') statusBadgeClass = 'bg-slate-100 text-slate-600';

        container.innerHTML += `
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                <div class="flex justify-between items-center">
                    <span class="font-black text-indigo-600 text-sm">${o.id}</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${statusBadgeClass}">${o.status}</span>
                </div>
                <p class="text-[11px] font-semibold text-amber-600"><i class="fa-solid fa-clock mr-1"></i> ${o.session}</p>
                <p class="text-slate-500 text-[11px]">${o.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</p>
                <div class="flex justify-between items-center pt-1 border-t border-slate-200">
                    <span class="font-bold text-slate-800">Rp${o.total.toLocaleString('id-ID')}</span>
                    <button onclick="showTicketModal('${o.id}')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-2.5 py-1 rounded-lg text-[10px]">
                        <i class="fa-solid fa-qrcode mr-1"></i> QR Tiket
                    </button>
                </div>
            </div>
        `;
    });
}

function showTicketModal(orderId) {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;

    document.getElementById('ticket-code').innerText = order.id;
    document.getElementById('ticket-buyer').innerText = `Pemesan: ${order.buyerName} • ${order.time} WIB`;
    document.getElementById('ticket-session').innerText = `Pengambilan: ${order.session}`;

    const itemsContainer = document.getElementById('ticket-items-list');
    itemsContainer.innerHTML = '';
    order.items.forEach(i => {
        itemsContainer.innerHTML += `
            <div class="flex justify-between">
                <span>${i.name} x${i.qty}</span>
                <span class="font-semibold">Rp${(i.price * i.qty).toLocaleString('id-ID')}</span>
            </div>
        `;
    });

    const qrContainer = document.getElementById('qrcode-display');
    qrContainer.innerHTML = '';
    new QRCode(qrContainer, {
        text: `KANTINKU_TICKET_${order.id}_${order.buyerName}`,
        width: 128,
        height: 128
    });

    document.getElementById('ticket-modal').classList.remove('hidden');
}

function closeTicketModal() { document.getElementById('ticket-modal').classList.add('hidden'); }

function renderSellerDashboard() {
    const container = document.getElementById('seller-orders-container');
    if (!container) return;
    container.innerHTML = '';

    if (!state.currentUser || state.currentUser.role !== 'seller') return;
    const sellerName = state.currentUser.name;

    // Hanya proses order yang mengandung item dari stand penjual ini
    const myOrders = state.orders
        .map(o => {
            const myItems = o.items.filter(i => i.seller === sellerName);
            if (myItems.length === 0) return null;
            const mySubtotal = myItems.reduce((sum, i) => sum + (i.price * i.qty), 0);
            return { ...o, myItems, mySubtotal };
        })
        .filter(o => o !== null);

    let revenue = 0, pendingCount = 0, completedCount = 0;

    myOrders.forEach(o => {
        if (o.status === 'Selesai') { revenue += o.mySubtotal; completedCount++; }
        else { pendingCount++; }
    });

    document.getElementById('stat-revenue').innerText = `Rp${revenue.toLocaleString('id-ID')}`;
    document.getElementById('stat-pending').innerText = pendingCount;
    document.getElementById('stat-completed').innerText = completedCount;

    if (myOrders.length === 0) {
        container.innerHTML = `<p class="text-center text-slate-400 py-8 text-sm">Belum ada pesanan masuk untuk ${sellerName}.</p>`;
        return;
    }

    myOrders.forEach(o => {
        let actionBtn = '';
        if (o.status === 'Pembayaran Berhasil') {
            actionBtn = `<button onclick="updateOrderStatus('${o.id}', 'Sedang Disiapkan')" class="bg-blue-600 text-white font-semibold text-xs px-3 py-1.5 rounded-lg">Proses Pesanan</button>`;
        } else if (o.status === 'Sedang Disiapkan') {
            actionBtn = `<button onclick="updateOrderStatus('${o.id}', 'Siap Diambil')" class="bg-emerald-600 text-white font-semibold text-xs px-3 py-1.5 rounded-lg">Tandai Siap Diambil</button>`;
        } else if (o.status === 'Siap Diambil') {
            actionBtn = `<button onclick="updateOrderStatus('${o.id}', 'Selesai')" class="bg-slate-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg">Selesaikan Pesanan</button>`;
        } else {
            actionBtn = `<span class="text-xs font-bold text-slate-400"><i class="fa-solid fa-check-double mr-1"></i> Selesai</span>`;
        }

        container.innerHTML += `
            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div class="space-y-1">
                    <div class="flex items-center space-x-2">
                        <span class="font-black text-indigo-600 text-base">${o.id}</span>
                        <span class="text-xs font-semibold bg-white border px-2 py-0.5 rounded-md text-slate-700">${o.buyerName}</span>
                        <span class="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">${o.session}</span>
                    </div>
                    <p class="text-xs text-slate-600">${o.myItems.map(i => `${i.name} (x${i.qty})`).join(', ')}</p>
                    <p class="text-xs font-bold text-slate-800">Total (stand Anda): Rp${o.mySubtotal.toLocaleString('id-ID')}</p>
                </div>
                <div class="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
                    <span class="text-xs font-bold px-2.5 py-1 rounded-full border bg-white">${o.status}</span>
                    ${actionBtn}
                </div>
            </div>
        `;
    });
}

function updateOrderStatus(orderId, newStatus) {
    const order = state.orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        saveStateToStorage();
        renderSellerDashboard();
        renderActiveOrders();
    }
}

function toggleAddProductModal() {
    document.getElementById('add-product-modal').classList.toggle('hidden');
}

function addNewProduct(e) {
    e.preventDefault();
    if (!state.currentUser || state.currentUser.role !== 'seller') return;

    const name = document.getElementById('new-prod-name').value.trim();
    const price = parseInt(document.getElementById('new-prod-price').value);
    const stock = parseInt(document.getElementById('new-prod-stock').value);
    const category = document.getElementById('new-prod-cat').value;
    let image = document.getElementById('new-prod-img').value.trim();

    if (!image) {
        if (category === 'makanan') image = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80';
        else if (category === 'camilan') image = 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop&q=80';
        else image = 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop&q=80';
    }

    state.products.push({ id: Date.now(), name, price, stock, category, seller: state.currentUser.name, image });
    saveStateToStorage();
    toggleAddProductModal();
    renderProducts();
    e.target.reset();
    alert('Menu baru berhasil disimpan!');
}

// LOGIC COUNTDOWN TIMER (ISTIRAHAT 1: 09:40 & ISTIRAHAT 2: 11:30)
function initTimer() {
    function updateTimer() {
        const now = new Date();
        
        const break1 = new Date();
        break1.setHours(9, 40, 0, 0);

        const break2 = new Date();
        break2.setHours(11, 30, 0, 0);

        let target;
        let label = '';

        if (now < break1) {
            target = break1;
            label = 'Istirahat Ke-1 (09:40)';
        } else if (now < break2) {
            target = break2;
            label = 'Istirahat Ke-2 (11:30)';
        } else {
            target = new Date();
            target.setDate(target.getDate() + 1);
            target.setHours(9, 40, 0, 0);
            label = 'Istirahat Ke-1 (Besok)';
        }

        const diff = target - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const timerElem = document.getElementById('break-timer');
        const labelElem = document.getElementById('break-label');

        if (timerElem) timerElem.innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        if (labelElem) labelElem.innerText = label;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}