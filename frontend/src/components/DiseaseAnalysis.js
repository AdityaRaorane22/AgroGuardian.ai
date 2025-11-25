import React from 'react';

function DiseaseAnalysis({ userData, analysisData }) {
  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '0 auto'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      marginBottom: '24px'
    },
    header: {
      marginBottom: '30px'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#2d3748',
      marginBottom: '10px'
    },
    subtitle: {
      fontSize: '15px',
      color: '#718096'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px'
    },
    emptyIcon: {
      fontSize: '80px',
      marginBottom: '20px'
    },
    emptyText: {
      fontSize: '18px',
      color: '#718096',
      marginBottom: '30px'
    },
    resultHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '30px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      color: 'white',
      marginBottom: '30px'
    },
    diseaseInfo: {
      flex: 1
    },
    diseaseName: {
      fontSize: '32px',
      fontWeight: '700',
      marginBottom: '8px'
    },
    diseaseSubtext: {
      fontSize: '16px',
      opacity: '0.9'
    },
    confidenceBadge: {
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      padding: '20px 30px',
      borderRadius: '12px',
      textAlign: 'center',
      border: '2px solid rgba(255, 255, 255, 0.3)'
    },
    confidenceLabel: {
      fontSize: '14px',
      opacity: '0.9',
      marginBottom: '6px'
    },
    confidenceValue: {
      fontSize: '36px',
      fontWeight: '700'
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    detailCard: {
      padding: '24px',
      borderRadius: '16px',
      border: '2px solid #e2e8f0',
      transition: 'all 0.3s ease'
    },
    detailIcon: {
      fontSize: '32px',
      marginBottom: '12px'
    },
    detailLabel: {
      fontSize: '13px',
      color: '#718096',
      marginBottom: '6px',
      fontWeight: '500'
    },
    detailValue: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#2d3748'
    },
    section: {
      marginTop: '30px'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '16px',
      display:'flex',
alignItems: 'center',
gap: '10px'
},
symptomsList: {
listStyle: 'none',
padding: 0,
margin: 0
},
symptomItem: {
padding: '16px 20px',
background: '#f7fafc',
borderRadius: '12px',
marginBottom: '10px',
display: 'flex',
alignItems: 'center',
gap: '12px',
border: '1px solid #e2e8f0'
},
symptomIcon: {
fontSize: '20px'
},
symptomText: {
fontSize: '15px',
color: '#4a5568',
fontWeight: '500'
},
alertBox: {
padding: '20px 24px',
borderRadius: '12px',
display: 'flex',
alignItems: 'flex-start',
gap: '12px',
marginTop: '20px'
},
alertIcon: {
fontSize: '24px'
},
alertContent: {
flex: 1
},
alertTitle: {
fontSize: '16px',
fontWeight: '600',
marginBottom: '6px'
},
alertText: {
fontSize: '14px',
lineHeight: '1.5'
}
};
const getSeverityColor = (severity) => {
const colors = {
'Low': { bg: '#c6f6d5', border: '#68d391', color: '#22543d' },
'Moderate': { bg: '#fed7d7', border: '#fc8181', color: '#742a2a' },
'High': { bg: '#feb2b2', border: '#f56565', color: '#742a2a' },
'Severe': { bg: '#fc8181', border: '#e53e3e', color: '#742a2a' }
};
return colors[severity] || colors['Moderate'];
};
const getRiskColor = (risk) => {
const colors = {
'Low': { bg: '#c6f6d5', text: '#22543d' },
'Medium': { bg: '#fef3c7', text: '#92400e' },
'High': { bg: '#fecaca', text: '#7f1d1d' }
};
return colors[risk] || colors['Medium'];
};
if (!analysisData) {
return (
<div style={styles.container}>
<div style={styles.card}>
<div style={styles.header}>
<h2 style={styles.title}>🔬 Disease Analysis Results</h2>
<p style={styles.subtitle}>
Advanced AI-powered disease detection and analysis
</p>
</div>
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>🔍</div>
        <div style={styles.emptyText}>
          No analysis data available yet. Please upload a crop image first.
        </div>
      </div>
    </div>
  </div>
);
}
const severityStyle = getSeverityColor(analysisData.severity);
const riskStyle = getRiskColor(analysisData.riskLevel);
return (
<div style={styles.container}>
<div style={styles.card}>
<div style={styles.resultHeader}>
<div style={styles.diseaseInfo}>
<div style={styles.diseaseName}>
{analysisData.diseaseDetected ? '⚠️ ' + analysisData.diseaseName : '✅ No Disease Detected'}
</div>
<div style={styles.diseaseSubtext}>
Analysis completed on {new Date(analysisData.timestamp).toLocaleString()}
</div>
</div>
<div style={styles.confidenceBadge}>
<div style={styles.confidenceLabel}>AI Confidence</div>
<div style={styles.confidenceValue}>{analysisData.confidence}%</div>
</div>
</div>
    <div style={styles.detailsGrid}>
      <div 
        style={{
          ...styles.detailCard,
          background: severityStyle.bg,
          borderColor: severityStyle.border
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={styles.detailIcon}>📊</div>
        <div style={styles.detailLabel}>Severity Level</div>
        <div style={{...styles.detailValue, color: severityStyle.color}}>
          {analysisData.severity}
        </div>
      </div>

      <div 
        style={styles.detailCard}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={styles.detailIcon}>🎯</div>
        <div style={styles.detailLabel}>Affected Area</div>
        <div style={styles.detailValue}>{analysisData.affectedArea}</div>
      </div>

      <div 
        style={styles.detailCard}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={styles.detailIcon}>🌾</div>
        <div style={styles.detailLabel}>Crop Type</div>
        <div style={styles.detailValue}>{analysisData.cropType}</div>
      </div>

      <div 
        style={{
          ...styles.detailCard,
          background: riskStyle.bg
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={styles.detailIcon}>⚠️</div>
        <div style={styles.detailLabel}>Risk Level</div>
        <div style={{...styles.detailValue, color: riskStyle.text}}>
          {analysisData.riskLevel}
        </div>
      </div>
    </div>

    {analysisData.detectedSymptoms && (
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <span>🔍</span>
          <span>Detected Symptoms</span>
        </div>
        <ul style={styles.symptomsList}>
          {analysisData.detectedSymptoms.map((symptom, index) => (
            <li key={index} style={styles.symptomItem}>
              <span style={styles.symptomIcon}>•</span>
              <span style={styles.symptomText}>{symptom}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    <div 
      style={{
        ...styles.alertBox,
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        border: '2px solid rgba(102, 126, 234, 0.3)'
      }}
    >
      <div style={styles.alertIcon}>💡</div>
      <div style={styles.alertContent}>
        <div style={{...styles.alertTitle, color: '#667eea'}}>
          Next Steps Recommended
        </div>
        <div style={{...styles.alertText, color: '#4a5568'}}>
          Check the Treatment Guide tab for detailed treatment recommendations and preventive measures. 
          Early action can save up to 30% of your crop yield!
        </div>
      </div>
    </div>
  </div>
</div>
);
}
export default DiseaseAnalysis;
