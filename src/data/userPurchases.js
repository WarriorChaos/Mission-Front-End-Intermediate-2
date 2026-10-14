const ordersStorageKey = 'videobelajar_orders';

export function getUserOrders() {
  const storedOrders = localStorage.getItem(ordersStorageKey);
  if (!storedOrders) {
    return [];
  }

  try {
    const orders = JSON.parse(storedOrders);
    if (Array.isArray(orders)) {
      return orders;
    }

    throw new Error('Stored orders must be an array.');
  } catch (error) {
    console.error('Error reading stored orders:', error);
    localStorage.removeItem(ordersStorageKey);
    return [];
  }
}

export function saveUserOrder(order) {
  const orders = getUserOrders();
  const existingOrderIndex = orders.findIndex((storedOrder) => storedOrder.id === order.id);
  const updatedOrders = existingOrderIndex === -1
    ? [order, ...orders]
    : orders.map((storedOrder, index) => index === existingOrderIndex ? order : storedOrder);

  localStorage.setItem(ordersStorageKey, JSON.stringify(updatedOrders));
}

export function hasPurchasedCourse(courseId) {
  return getUserOrders().some(
    (order) => Number(order.courseId) === Number(courseId) && order.status === 'Berhasil'
  );
}
