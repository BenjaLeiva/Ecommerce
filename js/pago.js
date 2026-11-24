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

document.addEventListener('DOMContentLoaded', () => {
    const order = readSavedOrder();
    const orderCodeEl = document.getElementById('orderCode');
    const detailsBox = document.getElementById('orderDetailsBox');

    if (!order) {
        orderCodeEl.textContent = 'SIN-DATOS';
        detailsBox.innerHTML = `<p>No se encontró una orden reciente para mostrar.</p>`;
        return;
    }

    orderCodeEl.textContent = order.orderNumber;

    const items = Array.isArray(order.items) ? order.items : [];
    const itemsHtml = items.map(item => `
        <li>
            <span>${item.title} (${item.type === 'reserva' ? 'Abono 50%' : 'Stock'}) x${item.quantity}</span>
            <strong>$${Number(item.chargedNow || 0).toLocaleString('es-CL')}</strong>
        </li>
    `).join('');

    const addressInfo = order.shippingAddress
        ? `<p><strong>Dirección de entrega:</strong> ${order.shippingAddress}</p>`
        : '';

    detailsBox.innerHTML = `
        <p><strong>Fecha y hora:</strong> ${order.createdAt}</p>
        <p><strong>Entrega seleccionada:</strong> ${order.shippingLabel}</p>
        ${addressInfo}
        <ul>${itemsHtml}</ul>
        <p><strong>Total pagado en simulación:</strong> $${Number(order.payNow || 0).toLocaleString('es-CL')}</p>
        ${order.hasReserva ? '<p><small>* El saldo restante de importaciones se paga al llegar el pedido a tienda.</small></p>' : ''}
    `;
});