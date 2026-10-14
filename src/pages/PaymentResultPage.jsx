import { useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer/Footer';
import { courses, paymentMethods } from '../data/mockData';
import { getUserOrders, saveUserOrder } from '../data/userPurchases';
import './FlowPages.css';

export default function PaymentResultPage() {
  const { courseId, status } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const course = courses.find((item) => item.id === Number(courseId)) || courses[0];
  const requestedMethod = searchParams.get('method');
  const method = paymentMethods.find((item) => item.id === requestedMethod) || paymentMethods[0];
  const orderId = searchParams.get('order');
  const order = getUserOrders().find((item) => item.id === orderId);
  const isPending = status === 'pending' && order?.status === 'Belum Bayar';
  const isCancelled = order?.status === 'Dibatalkan';
  const isSuccess = status === 'success'
    && Number(order?.courseId) === course.id
    && ['Belum Bayar', 'Berhasil'].includes(order?.status);

  useEffect(() => {
    if (!isSuccess || order?.status !== 'Belum Bayar') {
      return;
    }

    const paidAt = new Date();
    saveUserOrder({
      ...order,
      courseId: course.id,
      title: course.title,
      image: course.image,
      teacher: course.instructor,
      duration: course.duration,
      lessons: course.lessons,
      total: course.price + 7000,
      status: 'Berhasil',
      date: new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
        timeStyle: 'short'
      }).format(paidAt),
      method: method.name
    });
  }, [course, isSuccess, method.name, order]);

  const refreshPaymentStatus = () => {
    navigate(`/payment-result/${course.id}/success?method=${method.id}&order=${orderId}`);
  };

  const title = isSuccess
    ? 'Pembayaran Berhasil!'
    : isCancelled
      ? 'Pembelian Dibatalkan'
      : 'Pembayaran Tertunda';

  return (
    <div className="flow-page">
      <Header />
      <main className="page-shell">
        <div className="result-card">
          <div className={`result-check${isSuccess ? '' : ' result-check--pending'}`} aria-hidden="true">
            {isSuccess ? '✓' : isCancelled ? '×' : '!'}
          </div>
          <h2>{title}</h2>
          <p>
            {isSuccess
              ? `Kelas ${course.title} sudah ditambahkan ke Kelas Saya. Detail transaksi tersimpan di Pesanan Saya.`
              : isCancelled
                ? 'Pesanan ini sudah dibatalkan dan tidak dapat dilanjutkan.'
                : isPending
                  ? 'Pembayaran Anda masih diproses. Tekan refresh untuk memeriksa kembali status pembayaran.'
                  : 'Transaksi tidak ditemukan. Silakan periksa Pesanan Saya.'}
          </p>
          <div className="result-actions">
            <Link to="/orders" className="primary-button">Lihat Pesanan Saya</Link>
            {isSuccess && <Link to="/classes" className="secondary-button">Buka Kelas Saya</Link>}
            {isPending && (
              <button type="button" className="secondary-button" onClick={refreshPaymentStatus}>
                Refresh Status Pembayaran
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
