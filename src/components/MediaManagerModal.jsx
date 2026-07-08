import React, { useState, useRef } from 'react';
import { X, Search, Folder, Image as ImageIcon, Filter, Grid, List, Plus, HardDrive, LayoutTemplate, Trash2, Trash, Camera, User, DownloadCloud, Sparkles, Loader2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import './MediaManagerModal.css';
import realProducts from '../utils/realProducts.json';

const mockFolders = [
  { id: 'f1', name: 'Mobile Uploads', type: 'folder' },
  { id: 'f2', name: 'Bags', type: 'folder' },
  { id: 'f3', name: 'Jewelry', type: 'folder' }
];

// Extract all images from realProducts
const initialSiteFiles = realProducts
  .flatMap(p => p.images || [p.image])
  .filter(Boolean)
  .map((url, i) => ({
    id: `file_${i}`,
    name: `product_img_${i + 1}.jpg`,
    url,
    type: 'image',
    size: Math.floor(Math.random() * 800 + 100) * 1024 // random size 100KB-900KB
  }));

const MediaManagerModal = ({ show, onClose, onSelect }) => {
  const [activeTab, setActiveTab] = useState('Site Files');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [trashedIds, setTrashedIds] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);

  const allData = [...mockFolders, ...uploadedFiles, ...initialSiteFiles];
  const displayData = activeTab === 'Trash' 
    ? allData.filter(item => trashedIds.includes(item.id))
    : allData.filter(item => !trashedIds.includes(item.id));

  const handleSelect = (item) => {
    // We allow folder selection now if we want to move it to trash, but previously it was disabled. Let's enable it so folders can be trashed too.
    
    // Toggle selection
    if (selectedFiles.find(f => f.id === item.id)) {
      setSelectedFiles(selectedFiles.filter(f => f.id !== item.id));
    } else {
      setSelectedFiles([...selectedFiles, item]);
    }
  };

  const handleMoveToTrash = () => {
    if (selectedFiles.length === 0) return;
    const ids = selectedFiles.map(f => f.id);
    setTrashedIds(prev => [...prev, ...ids]);
    setSelectedFiles([]);
  };

  const handleRestore = () => {
    if (selectedFiles.length === 0) return;
    const ids = selectedFiles.map(f => f.id);
    setTrashedIds(prev => prev.filter(id => !ids.includes(id)));
    setSelectedFiles([]);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsCompressing(true);
    
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      initialQuality: 0.8
    };

    const newUploads = [];
    for (const file of files) {
      if (file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        newUploads.push({
          id: `up_${Date.now()}_${file.name}`,
          name: file.name,
          url,
          type: 'video',
          size: file.size,
          rawFile: file
        });
      } else if (file.type.startsWith('image/')) {
        try {
          const compressedFile = await imageCompression(file, options);
          const url = URL.createObjectURL(compressedFile);
          newUploads.push({
            id: `up_${Date.now()}_${file.name}`,
            name: file.name,
            url,
            type: 'image',
            size: compressedFile.size,
            originalSize: file.size,
            rawFile: compressedFile
          });
        } catch (error) {
          console.error("Compression error:", error);
        }
      }
    }

    setUploadedFiles(prev => [...newUploads, ...prev]);
    setIsCompressing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddToPage = () => {
    if (selectedFiles.length > 0) {
      const filesToAdd = selectedFiles.map(f => {
        if (f.rawFile) {
          // Pass pre-compressed image data back
          return {
            name: f.name,
            originalSize: f.originalSize || f.size,
            compressedSize: f.size,
            url: f.url,
            type: f.type === 'video' ? 'video/mp4' : 'image/jpeg',
            isExisting: false
          };
        }
        // Mock site files
        return {
          url: f.url,
          name: f.name,
          type: f.type === 'video' ? 'video/mp4' : 'image/jpeg',
          isExisting: true
        };
      });
      onSelect(filesToAdd);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const selectedItem = selectedFiles.length === 1 ? selectedFiles[0] : null;

  return (
    <div className="media-manager-overlay" onClick={onClose} style={{ display: show ? 'flex' : 'none' }}>
      <div className="media-manager-modal" onClick={e => e.stopPropagation()}>
        
        <div className="mm-header">
          <h2>Choose Images</h2>
          <button className="mm-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="mm-body">
          
          <div className="mm-sidebar">
            <div className="mm-upload-btn-container">
              <button className="mm-upload-btn" onClick={handleUploadClick} disabled={isCompressing} style={{ opacity: isCompressing ? 0.7 : 1 }}>
                {isCompressing ? <Loader2 size={16} className="spin" /> : <Plus size={16} />} 
                {isCompressing ? 'Compressing...' : 'Upload Media'}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                multiple 
                accept="image/*,video/*" 
                onChange={handleFileChange} 
              />
            </div>

            <div className="mm-sidebar-content">
              <div className="mm-nav-section">
                <div className="mm-nav-title">Manage</div>
                <div className={`mm-nav-item ${activeTab === 'Site Files' ? 'active' : ''}`} onClick={() => setActiveTab('Site Files')}>
                  <Folder size={18} /> Site Files
                </div>
                <div className={`mm-nav-item ${activeTab === 'My Boards' ? 'active' : ''}`} onClick={() => setActiveTab('My Boards')}>
                  <LayoutTemplate size={18} /> My Boards
                </div>
                {activeTab !== 'Trash' && (
                  <div 
                    className="mm-nav-item" 
                    onClick={selectedFiles.length > 0 ? handleMoveToTrash : undefined} 
                    style={{ 
                      cursor: selectedFiles.length > 0 ? 'pointer' : 'default'
                    }}
                  >
                    <Trash size={18} /> Delete {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
                  </div>
                )}
                {activeTab === 'Trash' && (
                  <div 
                    className="mm-nav-item" 
                    onClick={selectedFiles.length > 0 ? handleRestore : undefined} 
                    style={{ 
                      cursor: selectedFiles.length > 0 ? 'pointer' : 'default'
                    }}
                  >
                    <DownloadCloud size={18} /> Restore {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
                  </div>
                )}
                <div className={`mm-nav-item ${activeTab === 'Trash' ? 'active' : ''}`} onClick={() => setActiveTab('Trash')}>
                  <Trash2 size={18} /> Trash
                </div>
              </div>

              <div className="mm-nav-section">
                <div className="mm-nav-title">Explore</div>
                <div className={`mm-nav-item ${activeTab === 'Media from Wix' ? 'active' : ''}`} onClick={() => setActiveTab('Media from Wix')}>
                  <ImageIcon size={18} /> Media from Wix
                </div>
                <div className={`mm-nav-item ${activeTab === 'Shutterstock' ? 'active' : ''}`} onClick={() => setActiveTab('Shutterstock')}>
                  <Camera size={18} /> Shutterstock
                </div>
                <div className={`mm-nav-item ${activeTab === 'Unsplash' ? 'active' : ''}`} onClick={() => setActiveTab('Unsplash')}>
                  <User size={18} /> Unsplash
                </div>
                <div className={`mm-nav-item ${activeTab === 'AI Image Creator' ? 'active' : ''}`} onClick={() => setActiveTab('AI Image Creator')} style={{ color: activeTab === 'AI Image Creator' ? 'var(--brand-pink)' : '#8b5cf6' }}>
                  <Sparkles size={18} /> AI Image Creator
                </div>
              </div>
            </div>

            <div className="mm-sidebar-footer">
              <div style={{ marginBottom: '8px' }}>492 MB used out of 50.0 GB</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <a href="#" style={{ color: 'var(--brand-pink)', textDecoration: 'none' }}>Manage Storage</a>
                <a href="#" style={{ color: '#8b5cf6', textDecoration: 'none' }}>Upgrade</a>
              </div>
            </div>
          </div>

          <div className="mm-main">
            <div className="mm-main-header">
              <div className="mm-search-bar">
                <Search size={16} color="#888" />
                <input type="text" placeholder="Search for business, fashion, fitness & more..." />
              </div>
              <div className="mm-actions">
                <button><Folder size={18} /></button>
                <button><Filter size={18} /></button>
                <button><Grid size={18} /></button>
                <button><List size={18} /></button>
              </div>
            </div>

            <div className="mm-grid-container">
              <div className="mm-grid-title">{activeTab}</div>
              <div className="mm-grid">
                {displayData.map((item) => {
                  const isSelected = selectedFiles.find(f => f.id === item.id);
                  return (
                    <div 
                      key={item.id} 
                      className={`mm-grid-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelect(item)}
                    >
                      <div className="mm-grid-item-preview">
                        {item.type === 'folder' ? (
                          <Folder className="mm-folder-icon" fill="#fdf2f8" />
                        ) : item.type === 'video' ? (
                          <video src={item.url} muted loop />
                        ) : (
                          <img src={item.url} alt={item.name} loading="lazy" />
                        )}
                      </div>
                      <div className="mm-grid-item-info">
                        <span className="mm-grid-item-size">
                          {item.type === 'folder' ? '[Folder]' : `[${formatSize(item.size)}]`}
                        </span>
                        <span className="mm-grid-item-name" title={item.name}>{item.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mm-details">
            {selectedItem ? (
              <>
                <div className="mm-details-preview">
                  <img src={selectedItem.url} alt={selectedItem.name} />
                </div>
                <div className="mm-details-title">{selectedItem.name}</div>
                <div className="mm-details-meta">
                  {formatSize(selectedItem.size)} • JPG
                </div>

                <div className="mm-details-actions">
                  <button className="mm-details-action-btn"><DownloadCloud size={16} /> Download</button>
                </div>
              </>
            ) : selectedFiles.length > 1 ? (
              <div className="mm-details-empty">
                <ImageIcon size={48} color="#ccc" style={{ marginBottom: '16px' }} />
                <div style={{ fontWeight: 600, color: '#333' }}>{selectedFiles.length} files selected</div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
                  <img src="https://img.icons8.com/color/96/000000/folder-invoices--v1.png" alt="folder" style={{ width: '80px', marginBottom: '10px' }} />
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#555' }}>Site Files</div>
                </div>

                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '12px', color: '#333' }}>Actions</div>
                <button className="mm-details-action-btn" style={{ marginBottom: '24px' }}>
                  <Folder size={16} /> Create New Folder
                </button>

                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px', color: '#333' }}>Information</div>
                <div className="mm-info-box">
                  Organize site files and folders added by you and other site <a href="#">collaborators</a>.
                </div>
              </>
            )}
          </div>

        </div>

        <div className="mm-footer">
          <button className="mm-btn-cancel" onClick={onClose}>Cancel</button>
          <button 
            className="mm-btn-primary" 
            disabled={selectedFiles.length === 0}
            onClick={handleAddToPage}
          >
            Add to Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaManagerModal;
