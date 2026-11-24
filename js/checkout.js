document.addEventListener('DOMContentLoaded', () => {
    const rawOrder = localStorage.getItem('chileMangasLastOrder');
    if (rawOrder) {
        const order = JSON.parse(rawOrder);
        document.getElementById('checkoutPayAmount').textContent = `$${order.payNow.toLocaleString('es-CL')}`;
    }
});

function readSavedOrder() {
    try {
        const fromLocal = localStorage.getItem('chileMangasLastOrder');
        if (fromLocal) return JSON.parse(fromLocal);
    } catch (e) {}

    try {
        const fromSession = sessionStorage.getItem('chileMangasLastOrder');
        if (fromSession) return JSON.parse(fromSession);
    } catch (e) {}

    return null;
}

function saveOrder(order) {
    const serialized = JSON.stringify(order);
    try {
        localStorage.setItem('chileMangasLastOrder', serialized);
    } catch (e) {}
    try {
        sessionStorage.setItem('chileMangasLastOrder', serialized);
    } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => {
    const order = readSavedOrder();
    const amountEl = document.getElementById('checkoutPayAmount');
    const amount = order && typeof order.payNow === 'number' ? order.payNow : 0;
    if (amountEl) {
        amountEl.textContent = `$${amount.toLocaleString('es-CL')}`;
    }

    const form = document.getElementById('checkoutForm');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            proceedToFinalPayment();
        });
    }
});

function proceedToFinalPayment() {
    const addressInput = document.getElementById('address');
    const comunaSelect = document.getElementById('comuna');
    const regionSelect = document.getElementById('region');
    const deptInput = document.getElementById('dept');

    const address = (addressInput && addressInput.value.trim()) || 'Dirección de Prueba 123';
    const comuna = (comunaSelect && comunaSelect.value) || 'Quilpué';
    const region = (regionSelect && regionSelect.value) || 'Valparaíso';
    const dept = deptInput ? deptInput.value.trim() : '';

    const fullAddress = `${address}${dept ? ', ' + dept : ''}, ${comuna}, ${region}`;
    const existingOrder = readSavedOrder() || {
        orderNumber: Math.floor(100000 + Math.random() * 900000),
        createdAt: new Date().toLocaleString('es-CL'),
        shippingLabel: 'Blue Express (Recomendado)',
        items: [],
        payNow: 0,
        hasReserva: false
    };

    existingOrder.shippingAddress = fullAddress;
    saveOrder(existingOrder);

    window.location.href = 'pago.html';
}