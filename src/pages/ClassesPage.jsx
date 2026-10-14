import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer/Footer';
import { defaultClasses } from '../data/mockData';
import { getUserOrders } from '../data/userPurchases';
import './FlowPages.css';

const statusClass = {
  Selesai: 'status-success',
  'Sedang Berjalan': 'status-warning'
};

const sideMenu = [
  { label: 'Profil Saya', to: '/profile' },
  { label: 'Kelas Saya', to: '/classes' },
  { label: 'Pesanan Saya', to: '/orders' }
];

export default function ClassesPage() {
  const purchasedOrders = getUserOrders().filter((order) => order.status === 'Berhasil');
  const purchasedCourseIds = new Set(purchasedOrders.map((order) => order.courseId));
  const purchasedClasses = [...new Map(
    purchasedOrders.map((order) => [
      order.courseId,
      {
        id: `purchase-${order.courseId}`,
        title: order.title,
        teacher: order.teacher || 'Instruktur Videobelajar',
        status: 'Sedang Berjalan',
        progress: 0,
        duration: order.duration || 'Kelas online',
        lessons: order.lessons || 0,
        image: order.image
      }
    ])
  ).values()];
  const classes = [
    ...defaultClasses.filter((item) => !purchasedCourseIds.has(item.id)),
    ...purchasedClasses
  ];
  const [activeTab, setActiveTab] = useState('Semua Kelas');
  const filteredClasses = classes.filter((item) =>
    activeTab === 'Semua Kelas' || item.status === activeTab
  );

  return (
    <div className="flow-page">
      <Header />
      <main className="page-shell classes-shell">
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

        <section className="content-panel">
          <div className="filter-bar">
            <div className="tab-set">
              {['Semua Kelas', 'Sedang Berjalan', 'Selesai'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`tab-button${activeTab === tab ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="class-list">
            {filteredClasses.length ? filteredClasses.map((item) => (
              <div className="class-card" key={item.id}>
                <img src={item.image} alt={item.title} />
                <div>
                  <h4>{item.title}</h4>
                  <div className="meta">{item.teacher}</div>
                  <div className="meta">{item.duration} • {item.lessons} Video</div>
                  <div className="progress-wrap">
                    <div className="progress-label">
                      <span>Progress Kelas: {item.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <span style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`order-status ${statusClass[item.status] || 'status-info'}`}>{item.status}</span>
                  <div style={{ marginTop: 16 }}>
                    <Link to="/" className="primary-button">{item.status === 'Selesai' ? 'Lihat Sertifikat' : 'Lanjutkan Pembelajaran'}</Link>
                  </div>
                </div>
              </div>
            )) : <p className="empty-state">Belum ada kelas pada kategori ini.</p>}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
