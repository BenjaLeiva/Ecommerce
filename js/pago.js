document.addEventListener('DOMContentLoaded', () => {
    const rawOrder = localStorage.getItem('chileMangasLastOrder');
    const orderCodeEl = document.getElementById('orderCode');
    const detailsBox = document.getElementById('orderDetailsBox');

    if (!rawOrder) {
        orderCodeEl.textContent = 'SIN-DATOS';
        detailsBox.innerHTML = `<p>No se encontró una orden reciente para mostrar.</p>`;
        return;
    }

    const order = JSON.parse(rawOrder);
    orderCodeEl.textContent = order.orderNumber;

    const itemsHtml = order.items.map(item => `
        <li>
            <span>${item.title} (${item.type === 'reserva' ? 'Abono 50%' : 'Stock'}) x${item.quantity}</span>
            <strong>$${item.chargedNow.toLocaleString('es-CL')}</strong>
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
        <p><strong>Total pagado en simulación:</strong> $${order.payNow.toLocaleString('es-CL')}</p>
        ${order.hasReserva ? '<p><small>* El saldo restante de importaciones se paga al llegar el pedido a tienda.</small></p>' : ''}
    `;
});