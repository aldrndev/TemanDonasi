import { useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { useCertificateStore } from '../stores/store';
import { useParams } from 'react-router-dom';

const Certificate = () => {
  const certificateRef = useRef();

  const { code } = useParams();

  const { loading, error, fetchCertificateId, certificateById } =
    useCertificateStore((state) => state);

  console.log(certificateById);

  const handleDownload = () => {
    const downloadButton = document.getElementById('downloadLink');
    downloadButton.style.display = 'none';
    const opt = {
      margin: 0,
      filename: 'sertifikat.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' },
    };

    html2pdf()
      .from(certificateRef.current)
      .set(opt)
      .save()
      .then(() => {
        downloadButton.style.display = 'block';
      })
      .catch((error) => {
        console.error('Error saat pembuatan PDF: ', error);
        downloadButton.style.display = 'block';
      });
  };

  const formatDate = (date) => {
    const days = [
      'Minggu',
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
    ];

    const dateObj = new Date(date);

    const day = days[dateObj.getDay()];
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const yyyy = dateObj.getFullYear();
    return `${day}, ${dd}-${mm}-${yyyy}`;
  };

  useEffect(() => {
    fetchCertificateId(code);
  }, [code]);

  const logoUrl =
    'https://cdn.discordapp.com/attachments/1157240510902186075/1164866945892487229/logothing2a.png';

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div ref={certificateRef} style={styles.certificateContainer}>
      <div style={styles.certificate}>
        <div style={styles.border}>
          <h1 style={styles.header}>Sertifikat Penghargaan</h1>
          <p style={styles.subtitle}>{certificateById.certificateCode}</p>

          <p style={styles.subtitle}>Dengan ini kami mengakui bahwa</p>

          <p style={styles.name}>
            <strong>{certificateById.User?.Profile.fullName}</strong>
          </p>
          <p style={styles.subtitle}>telah berdonasi</p>
          <p style={styles.itemName}>
            <strong>{certificateById.UserDonation?.Post.title}</strong>
          </p>
          <p style={styles.subtitle}>kepada program kami</p>
          <p style={styles.date}>
            pada <strong>{formatDate(certificateById.createdAt)}</strong>
          </p>
          <div style={styles.logoContainer}>
            <img src={logoUrl} alt="Logo" style={styles.logo} />
          </div>
          <div style={styles.signature}>
            <div style={styles.signatureLine}></div>
            <p style={styles.signatureText}>Tanda Tangan & Cap</p>
          </div>
        </div>

        <div style={styles.downloadButton}>
          <a
            href="#"
            id="downloadLink"
            onClick={handleDownload}
            style={styles.downloadLink}
          >
            Unduh Sertifikat
          </a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  certificateContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    width: '100%',
    height: '100%',
    // backgroundColor: '#f5f5f5',
  },
  certificate: {
    position: 'relative',
    backgroundColor: '#ffffff',
    width: '1000px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    fontFamily: '"Times New Roman", Times, serif',
    padding: '50px',
    boxSizing: 'border-box',
    borderRadius: '10px',
  },
  border: {
    border: '2px solid #000',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    position: 'relative',
    textAlign: 'center',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    borderRadius: '10px',
    padding: '30px',
  },
  header: {
    fontSize: '40px',
    margin: '20px 0',
    color: '#555',
  },
  subtitle: {
    fontSize: '22px',
    margin: '5px 0',
  },
  name: {
    fontSize: '30px',
    fontWeight: 'bold',
    margin: '10px 0',
    textDecoration: 'underline',
  },
  itemName: {
    fontSize: '24px',
    margin: '10px 0',
  },
  date: {
    fontSize: '18px',
    margin: '10px 0',
  },
  signatureLine: {
    borderTop: '1px solid #000',
    width: '200px',
  },
  signatureText: {
    fontSize: '18px',
    marginTop: '5px',
  },
  downloadButton: {
    bottom: '20px', // Positioned at the very bottom
    transform: 'translateX(-50%)',
    marginTop: 30,
    marginLeft: 150,
  },
  downloadLink: {
    padding: '12px 25px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '18px',
    textDecoration: 'none',
    outline: 'none',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  logo: {
    width: '120px', // or the size that fits your design
    marginBottom: '20px', // Space between the logo and the text below it
    marginTop: '200px',
    marginLeft: '600px',
  },
  signature: {
    position: 'absolute',
    bottom: '120px', // Adjusted space to move it higher, making room for the download button
    right: '50px',
  },
  downloadButtonCentered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: '20px',
  },
};

export default Certificate;
