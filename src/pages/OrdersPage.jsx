import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer/Footer';
import { defaultOrders, formatCurrency } from '../data/mockData';
import { getUserOrders, saveUserOrder } from '../data/userPurchases';
import './FlowPages.css';

const orderCategories = ['Berhasil', 'Menunggu', 'Dibatalkan'];

const sideMenu = [
  { label: 'Profil Saya', to: '/profile' },
  { label: 'Kelas Saya', to: '/classes' },
  { label: 'Pesanan Saya', to: '/orders' }
];

function getOrderCategory(status) {
  if (status === 'Berhasil') return 'Berhasil';
  if (status === 'Dibatalkan' || status === 'Gagal') return 'Dibatalkan';
  return 'Menunggu';
}

function getDisplayedStatus(status) {
  if (status === 'Belum Bayar') return 'Belum Bayar';
  return getOrderCategory(status);
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(() => {
    const userOrders = getUserOrders();
    return [
      ...userOrders,
      ...defaultOrders.filter((order) => !userOrders.some((userOrder) => userOrder.id === order.id))
    ];
  });
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase('id');
    return orders.filter((order) => {
      const matchesCategory = !activeCategory || getOrderCategory(order.status) === activeCategory;
      const matchesSearch = !normalizedSearch
        || order.title.toLocaleLowerCase('id').includes(normalizedSearch)
        || order.id.toLocaleLowerCase('id').includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, orders, searchTerm]);

  const cancelOrder = (order) => {
    const cancelledOrder = { ...order, status: 'Dibatalkan' };
    saveUserOrder(cancelledOrder);
    setOrders((currentOrders) =>
      currentOrders.map((item) => item.id === order.id ? cancelledOrder : item)
    );
  };

  return (
    <div className="flow-page">
      <Header />
      <main className="page-shell orders-shell">
        <aside className="sidebar-panel">
          <div className="side-menu">
            {sideMenu.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `side-item${isActive ? ' active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </aside>

        <section className="content-panel orders-content-panel">
          <div className="filter-bar">
            <div className="tab-set orders-filter-tabs" aria-label="Filter pesanan">
              {orderCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`tab-button${activeCategory === category ? ' active' : ''}`}
                  aria-pressed={activeCategory === category}
                  onClick={() => setActiveCategory((current) => current === category ? null : category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <input
              className="search-box orders-search"
              type="search"
              placeholder="Cari kelas atau invoice"
              aria-label="Cari kelas atau nomor invoice"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="order-list">
            {filteredOrders.length ? filteredOrders.map((order) => {
              const category = getOrderCategory(order.status);
              const canCancel = category === 'Menunggu';

              return (
                <div className="order-card" key={order.id}>
                  <div className="order-card-header">
                    <span className="meta">No. Invoice: {order.id}</span>
                    <span className={`order-status ${
                      category === 'Berhasil'
                        ? 'status-success'
                        : category === 'Menunggu'
                          ? 'status-warning'
                          : 'status-danger'
                    }`}>
                      {getDisplayedStatus(order.status)}
                    </span>
                  </div>

                  <div className="order-course-row">
                    <div className="order-course-image-wrap">
                      <img
                        src={order.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80'}
                        alt={order.title}
                      />
                    </div>

                    <div className="order-course-text">
                      <h4>{order.title}</h4>
                      <div className="meta">Waktu Pemesanan: {order.date}</div>
                      {order.method && <div className="meta">Metode: {order.method}</div>}
                    </div>

                    <div className="order-price-box">
                      <span className="price-label">Harga</span>
                      <strong>{formatCurrency(order.total)}</strong>
                    </div>
                  </div>

                  <div className="order-total-row">
                    <span>Total Pembayaran</span>
                    <strong>{formatCurrency(order.total)}</strong>
                  </div>
                  {canCancel && (
                    <div className="order-actions">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => cancelOrder(order)}
                      >
                        Batalkan Pembelian
                      </button>
                    </div>
                  )}
                </div>
              );
            }) : (
              <p className="empty-state">Tidak ada pesanan pada kategori ini.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
