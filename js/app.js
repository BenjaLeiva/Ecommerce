let cart = [];
let currentOrderSummary = {
    stockTotal: 0,
    depositTotal: 0,
    shippingCost: 2990,
    shippingLabel: "Blue Express (Recomendado)",
    payNow: 0,
    hasReserva: false
};

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(productsData);
    updateCartUI();
    setupEventListeners();
});

function getFilteredProducts() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const selectedOrigins = Array.from(document.querySelectorAll('.filter-origin:checked')).map(el => el.value);
    const selectedTypes = Array.from(document.querySelectorAll('.filter-type:checked')).map(el => el.value);
    const selectedEditorial = document.getElementById('editorialSelect').value;

    return productsData.filter(product => {
        const matchesSearch =
            !searchTerm ||
            product.title.toLowerCase().includes(searchTerm) ||
            product.editorial.toLowerCase().includes(searchTerm) ||
            product.country.toLowerCase().includes(searchTerm);

        const matchesOrigin =
            selectedOrigins.length === 0 || selectedOrigins.includes(product.country);

        const matchesType =
            selectedTypes.length === 0 || selectedTypes.includes(product.type);

        const matchesEditorial =
            !selectedEditorial || product.editorial === selectedEditorial;

        return matchesSearch && matchesOrigin && matchesType && matchesEditorial;
    });
}

function applyFilters() {
    const filtered = getFilteredProducts();
    renderProducts(filtered);
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.querySelectorAll('.filter-origin, .filter-type').forEach(cb => {
        cb.checked = false;
    });
    document.getElementById('editorialSelect').value = '';
    renderProducts(productsData);
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    const countSpan = document.getElementById('productResultsCount');
    grid.innerHTML = '';

    countSpan.textContent = `${products.length} ${products.length === 1 ? 'producto encontrado' : 'productos encontrados'}`;

    if (products.length === 0) {
        grid.innerHTML = `<p>No se encontraron productos con los filtros seleccionados.</p>`;
        return;
    }

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';

        const isReserva = p.type === 'reserva';
        const statusBadge = isReserva
            ? `<span class="badge-status badge-reserva">Importación (50% Abono)</span>`
            : `<span class="badge-status badge-stock">En Stock</span>`;

        const priceDisplay = isReserva
            ? `<p class="product-price">$${p.price.toLocaleString('es-CL')}</p>
               <p class="product-deposit-note">Abono inicial: $${(p.price * 0.5).toLocaleString('es-CL')}</p>`
            : `<p class="product-price">$${p.price.toLocaleString('es-CL')}</p>`;

        card.innerHTML = `
            ${statusBadge}
            <img src="${p.image}" alt="${p.title}" class="product-img">
            <div class="product-info">
                <span class="product-editorial">${p.editorial} (${p.country})</span>
                <h4 class="product-title">${p.title}</h4>
                ${priceDisplay}
                <button type="button" class="btn-add-cart" onclick="addToCart(${p.id})">
                    ${isReserva ? 'Reservar (50% Abono)' : 'Agregar al Carrito'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const container = document.getElementById('cartItemsContainer');

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = totalItems;

    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = `<p>Tu carrito está vacío.</p>`;
    }

    let stockTotal = 0;
    let depositTotal = 0;
    let hasReserva = false;

    cart.forEach(item => {
        const isReserva = item.type === 'reserva';
        if (isReserva) hasReserva = true;

        const itemSubtotal = item.price * item.quantity;
        const chargeNow = isReserva ? itemSubtotal * 0.5 : itemSubtotal;

        if (isReserva) {
            depositTotal += chargeNow;
        } else {
            stockTotal += chargeNow;
        }

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <strong>${item.title}</strong> x ${item.quantity}
                <br><small>${isReserva ? 'Modalidad: Reserva (50% Abono)' : 'Modalidad: En Stock'}</small>
            </div>
            <div>
                <span>$${chargeNow.toLocaleString('es-CL')}</span>
            </div>
        `;
        container.appendChild(div);
    });

    const shippingRadio = document.querySelector('input[name="shipping"]:checked');
    let shippingCost = 2990;
    let shippingLabel = "Blue Express (Recomendado)";

    if (shippingRadio) {
        if (shippingRadio.value === 'retiro') {
            shippingCost = 0;
            shippingLabel = "Retiro en Tienda Física (Quilpué)";
        } else if (shippingRadio.value === 'chilexpress') {
            shippingCost = 0;
            shippingLabel = "Chilexpress (Por Pagar en destino)";
        }
    }

    const payNow = cart.length === 0 ? 0 : (stockTotal + depositTotal + shippingCost);

    currentOrderSummary = {
        stockTotal,
        depositTotal,
        shippingCost,
        shippingLabel,
        payNow,
        hasReserva,
        items: cart.map(item => ({
            title: item.title,
            quantity: item.quantity,
            type: item.type,
            unitPrice: item.price,
            chargedNow: item.type === 'reserva' ? item.price * item.quantity * 0.5 : item.price * item.quantity
        }))
    };

    document.getElementById('summaryStockTotal').textContent = `$${stockTotal.toLocaleString('es-CL')}`;
    document.getElementById('summaryDepositTotal').textContent = `$${depositTotal.toLocaleString('es-CL')}`;
    document.getElementById('summaryShippingCost').textContent = shippingCost === 0 ? 'Gratis / Por Pagar' : `$${shippingCost.toLocaleString('es-CL')}`;
    document.getElementById('summaryPayNow').textContent = `$${payNow.toLocaleString('es-CL')}`;
    document.getElementById('pendingBalanceNote').style.display = hasReserva ? 'block' : 'none';
}

function setupEventListeners() {
    const legalModal = document.getElementById('legalModal');
    document.getElementById('openLegalBtn').addEventListener('click', () => {
        legalModal.style.display = 'flex';
    });
    document.getElementById('closeLegalBtn').addEventListener('click', () => {
        legalModal.style.display = 'none';
    });
    document.getElementById('acceptLegalBtn').addEventListener('click', () => {
        legalModal.style.display = 'none';
    });

    const cartModal = document.getElementById('cartModal');
    document.getElementById('openCartBtn').addEventListener('click', () => {
        cartModal.style.display = 'flex';
    });
    document.getElementById('closeCartBtn').addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    [legalModal, cartModal].forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
            }
        });
    });

    document.querySelectorAll('input[name="shipping"]').forEach(radio => {
        radio.addEventListener('change', updateCartUI);
    });

    document.getElementById('applyFiltersBtn').addEventListener('click', applyFilters);
    document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);
    document.getElementById('searchBtn').addEventListener('click', applyFilters);
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('editorialSelect').addEventListener('change', applyFilters);
    document.querySelectorAll('.filter-origin, .filter-type').forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });

    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('El carrito está vacío.');
            return;
        }

        const orderPayload = {
            orderNumber: Math.floor(100000 + Math.random() * 900000),
            createdAt: new Date().toLocaleString('es-CL'),
            ...currentOrderSummary
        };

        try {
            localStorage.setItem('chileMangasLastOrder', JSON.stringify(orderPayload));
            sessionStorage.setItem('chileMangasLastOrder', JSON.stringify(orderPayload));
        } catch (err) {
            console.warn('No se pudo guardar en almacenamiento local:', err);
        }

        cart = [];
        updateCartUI();
        cartModal.style.display = 'none';

        window.location.href = 'checkout.html';
    });
}