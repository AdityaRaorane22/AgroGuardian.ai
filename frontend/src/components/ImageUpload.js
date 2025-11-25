import React, { useState, useRef } from 'react';

function ImageUpload({ userData, onAnalysisComplete }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
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
      color: '#718096',
      lineHeight: '1.6'
    },
    uploadArea: {
      border: '3px dashed #cbd5e0',
      borderRadius: '16px',
      padding: '60px 40px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: '#f7fafc',
      marginBottom: '30px'
    },
    uploadAreaActive: {
      borderColor: '#667eea',
      background: 'rgba(102, 126, 234, 0.05)',
      transform: 'scale(1.02)'
    },
    uploadIcon: {
      fontSize: '64px',
      marginBottom: '20px'
    },
    uploadText: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '8px'
    },
    uploadSubtext: {
      fontSize: '14px',
      color: '#718096'
    },
    previewContainer: {
      marginTop: '30px',
      textAlign: 'center'
    },
    previewImage: {
      maxWidth: '100%',
      maxHeight: '400px',
      borderRadius: '16px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
      marginBottom: '20px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      marginTop: '20px'
    },
    button: {
      padding: '14px 32px',
      fontSize: '15px',
      fontWeight: '600',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
    },
    secondaryButton: {
      background: '#e2e8f0',
      color: '#4a5568'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      background: '#e2e8f0',
      borderRadius: '4px',
      overflow: 'hidden',
      marginTop: '20px'
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
      transition: 'width 0.3s ease',
      borderRadius: '4px'
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '20px',
      height: '20px',
      border: '3px solid rgba(255, 255, 255, 0.3)',
      borderTop: '3px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginTop: '30px'
    },
    infoBox: {
      background: 'linear-gradient(135deg, rgba(132, 250, 176, 0.1) 0%, rgba(143, 211, 244, 0.1) 100%)',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid rgba(132, 250, 176, 0.3)'
    },
    infoLabel: {
      fontSize: '13px',
      color: '#718096',
      marginBottom: '6px',
      fontWeight: '500'
    },
    infoValue: {
      fontSize: '16px',
      color: '#2d3748',
      fontWeight: '600'
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file!');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate API call - Replace with actual API
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Mock analysis result
      const mockResult = {
        diseaseDetected: true,
        diseaseName: 'Late Blight',
        confidence: 87.5,
        severity: 'Moderate',
        affectedArea: '15-20%',
        cropType: userData.cropType,
        riskLevel: 'Medium',
        detectedSymptoms: ['Dark spots on leaves', 'Water-soaked lesions', 'White fungal growth'],
        timestamp: new Date().toISOString()
      };

      setTimeout(() => {
        onAnalysisComplete(mockResult);
        setIsAnalyzing(false);
        alert('✅ Analysis complete! Check Disease Analysis tab for results.');
      }, 500);
    }, 3000);
  };

  const handleClear = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>📸 Upload Crop Image</h2>
          <p style={styles.subtitle}>
            Take a clear photo of your crop leaves showing any visible symptoms or abnormalities. 
            Our AI will analyze the image and detect potential diseases instantly.
          </p>
        </div>

        {!previewUrl ? (
          <div
            style={styles.uploadArea}
            onClick={() => fileInputRef.current?.click()}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.background = 'rgba(102, 126, 234, 0.05)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e0';
              e.currentTarget.style.background = '#f7fafc';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={styles.uploadIcon}>📤</div>
            <div style={styles.uploadText}>Click to upload crop image</div>
            <div style={styles.uploadSubtext}>
              Supports: JPG, PNG, JPEG (Max 5MB)
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <div style={styles.previewContainer}>
            <img src={previewUrl} alt="Crop preview" style={styles.previewImage} />
            
            <div style={styles.buttonGroup}>
              <button
                style={{ ...styles.button, ...styles.primaryButton }}
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                onMouseEnter={(e) => {
                  if (!isAnalyzing) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                }}
              >
                {isAnalyzing ? (
                  <>
                    <div style={styles.loadingSpinner}></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    🔬 Analyze Disease
                  </>
                )}
              </button>
              
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={handleClear}
                disabled={isAnalyzing}
                onMouseEnter={(e) => {
                  if (!isAnalyzing) {
                    e.target.style.background = '#cbd5e0';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#e2e8f0';
                }}
              >
                🗑️ Clear
              </button>
            </div>

            {isAnalyzing && (
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${uploadProgress}%`
                  }}
                ></div>
              </div>
            )}
          </div>
        )}

        <div style={styles.infoGrid}>
          <div style={styles.infoBox}>
            <div style={styles.infoLabel}>Farmer</div>
            <div style={styles.infoValue}>{userData.name}</div>
          </div>
          <div style={styles.infoBox}>
            <div style={styles.infoLabel}>Crop Type</div>
            <div style={styles.infoValue}>{userData.cropType}</div>
          </div>
          <div style={styles.infoBox}>
            <div style={styles.infoLabel}>Location</div>
            <div style={styles.infoValue}>{userData.location}</div>
          </div>
          <div style={styles.infoBox}>
            <div style={styles.infoLabel}>Analysis Time</div>
            <div style={styles.infoValue}>~3-5 sec</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;