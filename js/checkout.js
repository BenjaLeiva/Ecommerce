document.addEventListener('DOMContentLoaded', () => {
    const rawOrder = localStorage.getItem('chileMangasLastOrder');
    if (rawOrder) {
        const order = JSON.parse(rawOrder);
        document.getElementById('checkoutPayAmount').textContent = `$${order.payNow.toLocaleString('es-CL')}`;
    }
});

function proceedToFinalPayment() {
    const address = document.getElementById('address').value.trim() || 'Dirección de Prueba 123';
    const comuna = document.getElementById('comuna').value || 'Quilpué';
    const region = document.getElementById('region').value || 'Valparaíso';
    const dept = document.getElementById('dept').value.trim();

    const rawOrder = localStorage.getItem('chileMangasLastOrder');
    if (rawOrder) {
        const order = JSON.parse(rawOrder);
        order.shippingAddress = `${address}${dept ? ', ' + dept : ''}, ${comuna}, ${region}`;
        localStorage.setItem('chileMangasLastOrder', JSON.stringify(order));
    }

    // Redireccionar a la pantalla de confirmación exitosa
    window.location.href = 'pago.html';
}