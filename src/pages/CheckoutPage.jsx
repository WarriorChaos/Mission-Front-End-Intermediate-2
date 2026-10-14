import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AlreadyOwnedModal from '../components/common/AlreadyOwnedModal';
import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer/Footer';
import { courses, formatCurrency, paymentMethods } from '../data/mockData';
import { hasPurchasedCourse } from '../data/userPurchases';
import './FlowPages.css';

export default function CheckoutPage() {
  const { courseId } = useParams();
  const course = courses.find((item) => item.id === Number(courseId)) || courses[0];
  const [selectedMethod, setSelectedMethod] = useState('bank');

  const total = course.price + 7000;

  if (hasPurchasedCourse(course.id)) {
    return <AlreadyOwnedModal />;
  }

  return (
    <div className="flow-page">
      <Header />
      <main className="page-shell checkout-shell">
        <section className="method-panel">
          <div className="method-header">
            <h3>Metode Pembayaran</h3>
          </div>

          <div className="method-options">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                className={`method-option ${selectedMethod === method.id ? 'active' : ''}`}
                aria-pressed={selectedMethod === method.id}
                onClick={() => setSelectedMethod(method.id)}
              >
                <span className="method-option-left">
                  <span className="method-radio" aria-hidden="true" />
                  <span>{method.name}</span>
                </span>
                <span>{method.logo}</span>
              </button>
            ))}
          </div>
        </section>

        <aside className="summary-card">
          <h3>Ringkasan Pesanan</h3>

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
            <strong>{formatCurrency(total)}</strong>
          </div>

          <div className="btn-row">
            <Link className="primary-button" to={`/payment/${course.id}?method=${selectedMethod}`}>
              Lanjut ke Pembayaran
            </Link>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}
