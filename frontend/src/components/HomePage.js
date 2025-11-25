import React, { useState } from 'react';

function HomePage({ onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    cropType: ''
  });

  const styles = {
    homeContainer: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    contentWrapper: {
      maxWidth: '1200px',
      width: '100%',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '60px',
      alignItems: 'center'
    },
    heroSection: {
      color: '#ffffff',
      animation: 'fadeInLeft 1s ease-out'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '30px'
    },
    logoIcon: {
      width: '60px',
      height: '60px',
      background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      boxShadow: '0 8px 32px rgba(132, 250, 176, 0.4)'
    },
    logoText: {
      fontSize: '36px',
      fontWeight: '700',
      letterSpacing: '-1px'
    },
    headline: {
      fontSize: '48px',
      fontWeight: '700',
      lineHeight: '1.2',
      marginBottom: '20px',
      textShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
    },
    subheadline: {
      fontSize: '18px',
      lineHeight: '1.6',
      opacity: '0.95',
      marginBottom: '30px',
      fontWeight: '300'
    },
    featureList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '15px',
      fontSize: '16px',
      opacity: '0.9'
    },
    checkIcon: {
      width: '24px',
      height: '24px',
      background: '#84fab0',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#667eea'
    },
    formCard: {
      background: 'rgba(255, 255, 255, 0.98)',
      borderRadius: '24px',
      padding: '50px 40px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)',
      animation: 'fadeInRight 1s ease-out'
    },
    formTitle: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '10px',
      textAlign: 'center'
    },
    formSubtitle: {
      fontSize: '14px',
      color: '#718096',
      marginBottom: '35px',
      textAlign: 'center'
    },
    formGroup: {
      marginBottom: '25px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#4a5568',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '14px 18px',
      fontSize: '15px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: "'Poppins', sans-serif",
      boxSizing: 'border-box'
    },
    inputFocus: {
      border: '2px solid #667eea',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)'
    },
    select: {
      width: '100%',
      padding: '14px 18px',
      fontSize: '15px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: "'Poppins', sans-serif",
      cursor: 'pointer',
      background: 'white',
      boxSizing: 'border-box'
    },
    submitButton: {
      width: '100%',
      padding: '16px',
      fontSize: '16px',
      fontWeight: '600',
      color: 'white',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '10px',
      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)'
    },
    submitButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 28px rgba(102, 126, 234, 0.5)'
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.location && formData.cropType) {
      onLogin(formData);
    } else {
      alert('Please fill all fields!');
    }
  };

  return (
    <div style={styles.homeContainer}>
      <style>
        {`
          @keyframes fadeInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes fadeInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @media (max-width: 968px) {
            .contentWrapper {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }
          }
        `}
      </style>
      
      <div style={styles.contentWrapper} className="contentWrapper">
        {/* Hero Section */}
        <div style={styles.heroSection}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>🌾</div>
            <div style={styles.logoText}>AgroGuardian AI</div>
          </div>
          
          <h1 style={styles.headline}>
            Protect Your Crops Before Disease Strikes
          </h1>
          
          <p style={styles.subheadline}>
            Revolutionary AI-powered platform that predicts crop diseases before symptoms appear. 
            Get instant insights, treatment recommendations, and save your harvest.
          </p>
          
          <ul style={styles.featureList}>
            <li style={styles.featureItem}>
              <div style={styles.checkIcon}>✓</div>
              <span>Early disease detection using AI image analysis</span>
            </li>
            <li style={styles.featureItem}>
              <div style={styles.checkIcon}>✓</div>
              <span>Real-time weather & environmental monitoring</span>
            </li>
            <li style={styles.featureItem}>
              <div style={styles.checkIcon}>✓</div>
              <span>7-day disease outbreak predictions</span>
            </li>
            <li style={styles.featureItem}>
              <div style={styles.checkIcon}>✓</div>
              <span>Digital Crop Twin technology</span>
            </li>
            <li style={styles.featureItem}>
              <div style={styles.checkIcon}>✓</div>
              <span>Voice-based diagnosis in local languages</span>
            </li>
          </ul>
        </div>

        {/* Registration Form */}
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Start Protecting Your Crops</h2>
          <p style={styles.formSubtitle}>Enter your details to access the dashboard</p>
          
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Farmer Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                style={styles.input}
                onFocus={(e) => e.target.style.cssText = `${e.target.style.cssText}; border: 2px solid #667eea; box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);`}
                onBlur={(e) => e.target.style.cssText = `${e.target.style.cssText}; border: 2px solid #e2e8f0; box-shadow: none;`}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Location / Village</label>
              <input
                type="text"
                name="location"
                placeholder="Enter your location"
                value={formData.location}
                onChange={handleInputChange}
                style={styles.input}
                onFocus={(e) => e.target.style.cssText = `${e.target.style.cssText}; border: 2px solid #667eea; box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);`}
                onBlur={(e) => e.target.style.cssText = `${e.target.style.cssText}; border: 2px solid #e2e8f0; box-shadow: none;`}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Primary Crop Type</label>
              <select
                name="cropType"
                value={formData.cropType}
                onChange={handleInputChange}
                style={styles.select}
                onFocus={(e) => e.target.style.cssText = `${e.target.style.cssText}; border: 2px solid #667eea; box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);`}
                onBlur={(e) => e.target.style.cssText = `${e.target.style.cssText}; border: 2px solid #e2e8f0; box-shadow: none;`}
              >
                <option value="">Select crop type</option>
                <option value="wheat">Wheat 🌾</option>
                <option value="rice">Rice 🌾</option>
                <option value="corn">Corn 🌽</option>
                <option value="tomato">Tomato 🍅</option>
                <option value="potato">Potato 🥔</option>
                <option value="cotton">Cotton</option>
                <option value="sugarcane">Sugarcane 🎋</option>
                <option value="soybean">Soybean</option>
              </select>
            </div>

            <button 
              type="submit" 
              style={styles.submitButton}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 28px rgba(102, 126, 234, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
              }}
            >
              Access Dashboard →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default HomePage;