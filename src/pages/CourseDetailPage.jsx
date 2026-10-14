import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer/Footer';
import AlreadyOwnedModal from '../components/common/AlreadyOwnedModal';
import { courses, formatCurrency } from '../data/mockData';
import { hasPurchasedCourse } from '../data/userPurchases';
import './FlowPages.css';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const course = courses.find((item) => item.id === Number(courseId)) || courses[0];
  const [showOwnedNotice, setShowOwnedNotice] = useState(false);
  const navigate = useNavigate();
  const isCourseOwned = hasPurchasedCourse(course.id);

  return (
    <div className="flow-page">
      <Header />
      <main className="page-shell detail-shell">
        <section className="detail-card">
          <div className="course-visual">
            <img src={course.image} alt={course.title} />
          </div>

          <div className="course-detail-header">
            <h1>{course.title}</h1>
            <div className="summary-price-line">
              <span className="price-main">{formatCurrency(course.price)}</span>
              <span className="price-old">{formatCurrency(course.oldPrice)}</span>
              <span className="discount-pill">Diskon {course.discount}%</span>
            </div>
          </div>

          <div className="meta-grid">
            <div className="meta-item">
              <span className="meta-icon">📘</span>
              <span>{course.duration}</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">🎥</span>
              <span>{course.lessons} Video</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">🗂️</span>
              <span>{course.modules.length} Modul</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">📝</span>
              <span>Serifikat</span>
            </div>
          </div>

          <div className="detail-content-block">
            <h3 className="section-title-card">Deskripsi</h3>
            <p>{course.description}</p>
          </div>

          <div className="detail-content-block">
            <h3 className="section-title-card">Apa yang akan Anda dapatkan?</h3>
            <ul className="detail-list">
              {course.learning.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="detail-content-block">
            <h3 className="section-title-card">Modul</h3>
            <ul className="detail-list">
              {course.modules.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="summary-card">
          <h3>Detail Kelas</h3>

          <div className="summary-course-box">
            <img src={course.image} alt={course.title} />
            <div>
              <p className="course-title-small">{course.title}</p>
            </div>
          </div>

          <div className="summary-price-row">
            <span>Harga</span>
            <strong>{formatCurrency(course.price)}</strong>
          </div>
          <div className="summary-price-row">
            <span>Biaya admin</span>
            <strong>{formatCurrency(7000)}</strong>
          </div>
          <div className="summary-total-row">
            <span>Total</span>
            <strong>{formatCurrency(course.price + 7000)}</strong>
          </div>

          <div className="btn-row">
            <button
              type="button"
              className="primary-button full-width"
              onClick={() => {
                if (hasPurchasedCourse(course.id)) {
                  setShowOwnedNotice(true);
                  return;
                }
                navigate(`/checkout/${course.id}`);
              }}
            >
              {isCourseOwned ? 'Kelas Sudah Tersedia' : 'Beli Sekarang'}
            </button>
          </div>
        </aside>
      </main>
      {showOwnedNotice && <AlreadyOwnedModal />}
      <Footer />
    </div>
  );
}
