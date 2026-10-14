import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import AlreadyOwnedModal from '../components/common/AlreadyOwnedModal';
import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer/Footer';
import { courses, formatCurrency, paymentMethods } from '../data/mockData';
import { getUserOrders, hasPurchasedCourse, saveUserOrder } from '../data/userPurchases';
import './FlowPages.css';

const paymentDetails = {
  bank: {
    title: 'Bayar melalui Virtual Account BCA',
    brand: 'BCA',
    account: '11739 081234567890',
    instructions: [
      'Masukkan kartu ATM BCA dan pilih menu Transaksi Lainnya.',
      'Pilih Transfer, lalu pilih ke Rekening BCA Virtual Account.',
      'Masukkan nomor Virtual Account Videobelajar.',
      'Pastikan nama dan nominal pembayaran sudah sesuai, lalu konfirmasi.'
    ]
  },
  ewallet: {
    title: 'Bayar melalui Virtual Account DANA',
    brand: 'DANA',
    account: '8808 081234567890',
    instructions: [
      'Buka aplikasi DANA dan pilih menu Kirim.',
      'Pilih Kirim ke Bank, lalu pilih DANA Virtual Account.',
      'Masukkan nomor Virtual Account DANA di atas.',
      'Periksa detail pembayaran dan selesaikan transaksi di aplikasi DANA.'
    ]
  },
  card: {
    title: 'Bayar dengan Kartu Kredit',
    brand: 'VISA',
    instructions: [
      'Pastikan kartu kredit Anda aktif dan dapat digunakan untuk transaksi online.',
      'Pilih Bayar Sekarang untuk melanjutkan simulasi pembayaran yang aman.',
      'Pembayaran kartu kredit akan diproses secara instan.'
    ]
  }
};

export default function PaymentPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const course = courses.find((item) => item.id === Number(courseId)) || courses[0];
  const requestedMethod = searchParams.get('method');
  const selectedMethod = paymentMethods.some((method) => method.id === requestedMethod)
    ? requestedMethod
    : 'bank';
  const payment = paymentDetails[selectedMethod];
  const subtotal = course.price;
  const adminFee = 7000;
  const total = subtotal + adminFee;

  if (hasPurchasedCourse(course.id)) {
    return <AlreadyOwnedModal />;
  }

  const handlePay = () => {
    const existingPendingOrder = getUserOrders().find(
      (order) => Number(order.courseId) === course.id && order.status === 'Belum Bayar'
    );
    const orderId = existingPendingOrder?.id
      || `VB-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const createdAt = new Date();

    saveUserOrder({
      id: orderId,
      courseId: course.id,
      title: course.title,
      image: course.image,
      teacher: course.instructor,
      duration: course.duration,
      lessons: course.lessons,
      total,
      status: 'Belum Bayar',
      date: new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
        timeStyle: 'short'
      }).format(createdAt),
      method: paymentMethods.find((method) => method.id === selectedMethod)?.name
    });
    navigate(`/payment-result/${course.id}/pending?method=${selectedMethod}&order=${orderId}`);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(payment.account);
    } catch (error) {
      console.error('Failed to copy payment account:', error);
    }
  };

  return (
    <div className="flow-page">
      <Header />
      <main className="page-shell payment-shell">
        <section className="payment-box">
          <div className={`payment-brand payment-brand--${selectedMethod}`}>{payment.brand}</div>
          <div className="subtext">{payment.title}</div>

          {payment.account && (
            <div className="account-row">
              <span>{payment.account}</span>
              <button type="button" className="copy-button" onClick={handleCopy}>Salin</button>
            </div>
          )}

          <div className="accordion">
            <div className="accordion-item">
              <h2 className="accordion-title">{paymentMethods.find((method) => method.id === selectedMethod)?.name}</h2>
              <div className="accordion-content">
                {payment.instructions.map((text, index) => (
                  <div className="payment-instruction" key={text}>
                    <span>{index + 1}</span>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </div>
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
            <span>Video Learning</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <div className="summary-price-row">
            <span>Biaya admin</span>
            <strong>{formatCurrency(adminFee)}</strong>
          </div>
          <div className="summary-total-row">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>

          <div className="btn-row">
            <Link className="secondary-button" to={`/checkout/${course.id}`}>
              Ganti Metode Pembayaran
            </Link>
            <button type="button" className="primary-button" onClick={handlePay}>
              Bayar Sekarang
            </button>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}
