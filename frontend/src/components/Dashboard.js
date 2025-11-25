import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import DiseaseAnalysis from './DiseaseAnalysis';
import RiskPredictor from './RiskPredictor';
import CropTwin from './CropTwin';
import DiseaseHeatmap from './DiseaseHeatmap';
import VoiceDiagnosis from './VoiceDiagnosis';
import TreatmentRecommendation from './TreatmentRecommendation';

function Dashboard({ userData, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [analysisResult, setAnalysisResult] = useState(null);

  const styles = {
    dashboardContainer: {
      minHeight: '100vh',
      padding: '0',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    header: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    logoIcon: {
      width: '50px',
      height: '50px',
      background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px'
    },
    logoText: {
      fontSize: '24px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    userInfo: {
      textAlign: 'right'
    },
    userName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '2px'
    },
    userDetails: {
      fontSize: '13px',
      color: '#718096'
    },
    logoutButton: {
      padding: '10px 24px',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(245, 87, 108, 0.3)'
    },
    mainContent: {
      display: 'flex',
      height: 'calc(100vh - 90px)'
    },
    sidebar: {
      width: '280px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      padding: '30px 20px',
      boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
      overflowY: 'auto'
    },
    sidebarTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#718096',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '20px',
      paddingLeft: '10px'
    },
    navList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    navItem: {
      marginBottom: '8px'
    },
    navButton: {
      width: '100%',
      padding: '14px 16px',
      background: 'transparent',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '500',
      color: '#4a5568',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'all 0.3s ease',
      textAlign: 'left'
    },
    navButtonActive: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
      transform: 'translateX(4px)'
    },
    navIcon: {
      fontSize: '20px',
      width: '24px',
      textAlign: 'center'
    },
    contentArea: {
      flex: 1,
      padding: '40px',
      overflowY: 'auto',
      background: 'transparent'
    },
    overviewGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      marginBottom: '30px'
    },
    statCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    statCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
    },
    statIcon: {
      width: '60px',
      height: '60px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
      marginBottom: '20px'
    },
    statTitle: {
      fontSize: '14px',
      color: '#718096',
      fontWeight: '500',
      marginBottom: '8px'
    },
    statValue: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#2d3748',
      marginBottom: '8px'
    },
    statSubtext: {
      fontSize: '13px',
      color: '#a0aec0'
    },
    welcomeCard: {
      background: 'linear-gradient(135deg, rgba(132, 250, 176, 0.2) 0%, rgba(143, 211, 244, 0.2) 100%)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '20px',
      padding: '40px',
      marginBottom: '30px',
      color: 'white'
    },
    welcomeTitle: {
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '12px'
    },
    welcomeText: {
      fontSize: '16px',
      opacity: '0.95',
      lineHeight: '1.6'
    }
  };

  const navItems = [
    { id: 'overview', icon: '📊', label: 'Dashboard Overview' },
    { id: 'upload', icon: '📸', label: 'Upload Crop Image' },
    { id: 'analysis', icon: '🔬', label: 'Disease Analysis' },
    { id: 'risk', icon: '⚠️', label: 'Risk Predictor' },
    { id: 'twin', icon: '🌱', label: 'Digital Crop Twin' },
    { id: 'heatmap', icon: '🗺️', label: 'Disease Heatmap' },
    { id: 'voice', icon: '🎤', label: 'Voice Diagnosis' },
    { id: 'treatment', icon: '💊', label: 'Treatment Guide' }
  ];

  const statCards = [
    {
      icon: '🌾',
      title: 'Crop Health Score',
      value: '87%',
      subtext: 'Healthy status',
      gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)'
    },
    {
      icon: '⚠️',
      title: 'Disease Risk',
      value: 'Low',
      subtext: 'Next 7 days forecast',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    {
      icon: '🌡️',
      title: 'Weather Alert',
      value: '28°C',
      subtext: 'Optimal conditions',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    },
    {
      icon: '📈',
      title: 'Yield Forecast',
      value: '+15%',
      subtext: 'vs last season',
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <>
            <div style={styles.welcomeCard}>
              <h2 style={styles.welcomeTitle}>Welcome back, {userData.name}! 👋</h2>
              <p style={styles.welcomeText}>
                Your {userData.cropType} crop is being monitored 24/7. 
                Current location: {userData.location}. All systems are operational and your crops are safe.
              </p>
            </div>

            <div style={styles.overviewGrid}>
              {statCards.map((card, index) => (
                <div 
                  key={index}
                  style={styles.statCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={{...styles.statIcon, background: card.gradient}}>
                    {card.icon}
                  </div>
                  <div style={styles.statTitle}>{card.title}</div>
                  <div style={styles.statValue}>{card.value}</div>
                  <div style={styles.statSubtext}>{card.subtext}</div>
                </div>
              ))}
            </div>
          </>
        );
      case 'upload':
        return <ImageUpload userData={userData} onAnalysisComplete={setAnalysisResult} />;
      case 'analysis':
        return <DiseaseAnalysis userData={userData} analysisData={analysisResult} />;
      case 'risk':
        return <RiskPredictor userData={userData} />;
      case 'twin':
        return <CropTwin userData={userData} />;
      case 'heatmap':
        return <DiseaseHeatmap userData={userData} />;
      case 'voice':
        return <VoiceDiagnosis userData={userData} />;
      case 'treatment':
        return <TreatmentRecommendation userData={userData} diseaseData={analysisResult} />;
      default:
        return null;
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>🌾</div>
          <div style={styles.logoText}>AgriShield AI</div>
        </div>
        
        <div style={styles.userSection}>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{userData.name}</div>
            <div style={styles.userDetails}>
              {userData.cropType} • {userData.location}
            </div>
          </div>
          <button 
            style={styles.logoutButton}
            onClick={onLogout}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(245, 87, 108, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(245, 87, 108, 0.3)';
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Sidebar Navigation */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarTitle}>Navigation</div>
          <ul style={styles.navList}>
            {navItems.map((item) => (
              <li key={item.id} style={styles.navItem}>
                <button
                  style={{
                    ...styles.navButton,
                    ...(activeTab === item.id ? styles.navButtonActive : {})
                  }}
                  onClick={() => setActiveTab(item.id)}
                  onMouseEnter={(e) => {
                    if (activeTab !== item.id) {
                      e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                      e.target.style.transform = 'translateX(4px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== item.id) {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateX(0)';
                    }
                  }}
                >
                  <span style={styles.navIcon}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content Area */}
        <main style={styles.contentArea}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;