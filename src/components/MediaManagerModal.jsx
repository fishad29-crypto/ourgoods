import React, { useState, useRef } from 'react';
import { X, Search, Folder, Image as ImageIcon, Filter, Grid, List, Plus, HardDrive, LayoutTemplate, Trash2, Trash, Camera, User, DownloadCloud, Sparkles, Loader2, PlayCircle, ArrowLeft } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import './MediaManagerModal.css';
import { getAllProducts } from '../utils/MockData';
import { saveMedia, getAllMedia, deleteMultipleMedia } from '../utils/MediaStore';

const mockFolders = [
  { id: 'f1', name: 'Mobile Uploads', type: 'folder' },
  { id: 'f2', name: 'Bags', type: 'folder' },
  { id: 'f3', name: 'Jewelry', type: 'folder' }
];

const MediaManagerModal = ({ show, onClose, onSelect, initialSelected = [] }) => {
  const [activeTab, setActiveTab] = useState('Site Files');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [trashedIds, setTrashedIds] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all'); // 'all', 'image', 'video'
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [draggedItemIds, setDraggedItemIds] = useState([]);
  const [dragOverFolderId, setDragOverFolderId] = useState(null);
  const [dragOverBreadcrumb, setDragOverBreadcrumb] = useState(false);
  const fileInputRef = useRef(null);

  // Dynamically load site files
  const initialSiteFiles = React.useMemo(() => {
    const allUrls = getAllProducts()
      .flatMap(p => p.images || [p.image])
      .filter(Boolean);
      
    // Deduplicate URLs
    const uniqueImages = [...new Set(allUrls)];
    
    return uniqueImages.map((imgItem, i) => {
        const actualUrl = typeof imgItem === 'string' ? imgItem : imgItem.url;
        const isVideo = (typeof imgItem === 'object' && imgItem.type && imgItem.type.startsWith('video/')) || 
                        (typeof actualUrl === 'string' && actualUrl.match(/\.(mp4|webm|ogg)$/i));
        return {
          id: `file_${i}`,
          name: typeof imgItem === 'object' && imgItem.name ? imgItem.name : `product_img_${i + 1}.jpg`,
          url: actualUrl,
          type: isVideo ? 'video' : 'image',
          size: Math.floor(Math.random() * 800 + 100) * 1024
        };
      });
  }, [show]);

  // Load from IndexedDB and sync selections on mount
  React.useEffect(() => {
    if (show) {
      getAllMedia().then(items => {
        const loadedMedia = items || [];
        setUploadedFiles(loadedMedia);
        
        // Find pre-selected items
        const allAvailable = [...mockFolders, ...loadedMedia, ...initialSiteFiles];
        if (initialSelected && initialSelected.length > 0) {
          const preSelected = allAvailable.filter(item => 
            initialSelected.includes(item.id) || initialSelected.includes(item.url)
          );
          setSelectedFiles(preSelected);
        } else {
          setSelectedFiles([]);
        }
      }).catch(err => console.error("Error loading media DB", err));
    }
  }, [show]);

  const allData = [...mockFolders, ...uploadedFiles, ...initialSiteFiles];
  let displayData = activeTab === 'Trash' 
    ? allData.filter(item => trashedIds.includes(item.id))
    : allData.filter(item => !trashedIds.includes(item.id));

  const totalStorageBytes = allData.reduce((total, item) => total + (item.size || 0), 0);
  
  const formatStorageSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const usedStorageFormatted = formatStorageSize(totalStorageBytes);

  // Filter by current folder
  if (activeTab !== 'Trash') {
    displayData = displayData.filter(item => {
      // Folders only show in the root
      if (item.type === 'folder') return currentFolderId === null;
      // Files show in their respective folder
      return (item.folderId || null) === currentFolderId;
    });
  }

  if (mediaTypeFilter !== 'all') {
    displayData = displayData.filter(item => item.type === 'folder' || item.type === mediaTypeFilter);
  }

  // Sort: folders first, then files by upload time (newest first)
  displayData.sort((a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    if (a.type === 'folder' && b.type === 'folder') return 0;
    
    const getTimestamp = (item) => {
      if (item.uploadedAt) return item.uploadedAt;
      if (item.id && item.id.startsWith('up_')) {
        const parts = item.id.split('_');
        if (parts.length >= 2) {
          const ts = parseInt(parts[1], 10);
          if (!isNaN(ts)) return ts;
        }
      }
      // For initial site files (e.g. file_0), we can extract the index and reverse it so they stay somewhat ordered
      if (item.id && item.id.startsWith('file_')) {
        const parts = item.id.split('_');
        if (parts.length >= 2) {
          return -parseInt(parts[1], 10); // Negative to push them behind real uploads
        }
      }
      return 0; 
    };

    const timeA = getTimestamp(a);
    const timeB = getTimestamp(b);
    
    return timeB - timeA;
  });

  const handleFolderClick = (folderId, e) => {
    e.stopPropagation();
    setCurrentFolderId(folderId);
    setSelectedFiles([]); // clear selection when navigating
  };

  const handleSelect = (item) => {
    // We allow folder selection now if we want to move it to trash, but previously it was disabled. Let's enable it so folders can be trashed too.
    
    // Toggle selection
    if (selectedFiles.find(f => f.id === item.id)) {
      setSelectedFiles(selectedFiles.filter(f => f.id !== item.id));
    } else {
      setSelectedFiles([...selectedFiles, item]);
    }
  };

  const handleDragStart = (e, item) => {
    // If dragging an unselected item, drag only that item
    // If dragging a selected item, drag all selected items
    const isSelected = selectedFiles.some(f => f.id === item.id);
    const itemsToDrag = isSelected ? selectedFiles.map(f => f.id) : [item.id];
    setDraggedItemIds(itemsToDrag);
    e.dataTransfer.effectAllowed = 'move';
    // Small timeout to allow the drag image to generate before we do any re-renders
    setTimeout(() => {}, 0);
  };

  const handleDragOver = (e, folderId) => {
    e.preventDefault();
    if (folderId && !draggedItemIds.includes(folderId)) {
      setDragOverFolderId(folderId);
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = (e) => {
    setDragOverFolderId(null);
  };

  const handleDrop = async (e, targetFolderId) => {
    e.preventDefault();
    setDragOverFolderId(null);
    setDragOverBreadcrumb(false);
    
    if (targetFolderId === undefined) return;

    try {
      // Update IndexedDB
      await import('../utils/MediaStore').then(m => m.updateMediaFolder(draggedItemIds, targetFolderId));
      
      // Update local state (uploadedFiles)
      setUploadedFiles(prev => prev.map(f => {
        if (draggedItemIds.includes(f.id)) {
          return { ...f, folderId: targetFolderId };
        }
        return f;
      }));
      
      // Clear selection so they don't stay selected in the root view when they are gone
      setSelectedFiles(prev => prev.filter(f => !draggedItemIds.includes(f.id)));
    } catch (err) {
      console.error("Failed to move items to folder", err);
    }
    setDraggedItemIds([]);
  };

  const handleDragEnd = () => {
    setDraggedItemIds([]);
    setDragOverFolderId(null);
    setDragOverBreadcrumb(false);
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

  const handlePermanentDelete = async () => {
    if (selectedFiles.length === 0) return;
    const ids = selectedFiles.map(f => f.id);
    
    // Delete from IndexedDB
    try {
      await deleteMultipleMedia(ids);
    } catch (e) {
      console.error("Failed to delete media", e);
    }
    
    // Update local state
    setUploadedFiles(prev => prev.filter(f => !ids.includes(f.id)));
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
    
    const finalUploads = [...uploadedFiles];
    for (const newUpload of newUploads) {
      try {
        await saveMedia(newUpload);
        finalUploads.push(newUpload);
      } catch (err) {
        console.error("Failed to save media to IndexedDB", err);
      }
    }
    
    setUploadedFiles(finalUploads);
    setIsCompressing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddToPage = () => {
    const filesToAdd = selectedFiles.map(f => {
      if (f.rawFile) {
        // Pass pre-compressed image data back
        return {
          id: f.id,
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
        id: f.id,
        url: f.url,
        name: f.name,
        type: f.type === 'video' ? 'video/mp4' : 'image/jpeg',
        isExisting: true
      };
    });
    onSelect(filesToAdd);
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
                  <>
                    <div 
                      className="mm-nav-item" 
                      onClick={selectedFiles.length > 0 ? handleRestore : undefined} 
                      style={{ cursor: selectedFiles.length > 0 ? 'pointer' : 'default' }}
                    >
                      <DownloadCloud size={18} /> Restore {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
                    </div>
                    <div 
                      className="mm-nav-item" 
                      onClick={selectedFiles.length > 0 ? handlePermanentDelete : undefined} 
                      style={{ cursor: selectedFiles.length > 0 ? 'pointer' : 'default', color: selectedFiles.length > 0 ? '#ef4444' : 'inherit' }}
                    >
                      <X size={18} /> Delete Forever
                    </div>
                  </>
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
              <div style={{ marginBottom: '8px' }}>{usedStorageFormatted} used out of 50.0 GB</div>
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
                <button className="icon-btn"><Folder size={18} /></button>
                <div style={{ position: 'relative' }}>
                  <button 
                    className="icon-btn" 
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    style={{ background: mediaTypeFilter !== 'all' ? '#fff0f6' : 'transparent', color: mediaTypeFilter !== 'all' ? 'var(--brand-pink)' : '#64748b' }}
                  >
                    <Filter size={18} />
                  </button>
                  {showFilterDropdown && (
                    <div style={{ position: 'absolute', top: '100%', right: '0', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 100, width: '120px', overflow: 'hidden', marginTop: '8px' }}>
                      <div style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '13px', backgroundColor: mediaTypeFilter === 'all' ? '#f8fafc' : 'white', fontWeight: mediaTypeFilter === 'all' ? 600 : 400 }} onClick={() => { setMediaTypeFilter('all'); setShowFilterDropdown(false); }}>All Media</div>
                      <div style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '13px', backgroundColor: mediaTypeFilter === 'image' ? '#f8fafc' : 'white', fontWeight: mediaTypeFilter === 'image' ? 600 : 400 }} onClick={() => { setMediaTypeFilter('image'); setShowFilterDropdown(false); }}>Pictures</div>
                      <div style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '13px', backgroundColor: mediaTypeFilter === 'video' ? '#f8fafc' : 'white', fontWeight: mediaTypeFilter === 'video' ? 600 : 400 }} onClick={() => { setMediaTypeFilter('video'); setShowFilterDropdown(false); }}>Videos</div>
                    </div>
                  )}
                </div>
                <button className="icon-btn"><Grid size={18} /></button>
                <button className="icon-btn"><List size={18} /></button>
              </div>
            </div>

            <div className="mm-grid-container">
              <div className="mm-grid-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {currentFolderId && (
                  <button 
                    onClick={() => setCurrentFolderId(null)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b', padding: 0 }}
                    title="Back to root"
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}
                <span 
                  style={{ 
                    cursor: currentFolderId ? 'pointer' : 'default', 
                    color: currentFolderId ? '#64748b' : 'inherit',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: dragOverBreadcrumb ? '#fdf2f8' : 'transparent',
                    outline: dragOverBreadcrumb ? '1px dashed var(--brand-pink)' : 'none'
                  }} 
                  onClick={() => setCurrentFolderId(null)}
                  onDragOver={(e) => {
                    if (currentFolderId && draggedItemIds.length > 0) {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                      setDragOverBreadcrumb(true);
                    }
                  }}
                  onDragLeave={() => setDragOverBreadcrumb(false)}
                  onDrop={(e) => {
                    if (currentFolderId && draggedItemIds.length > 0) {
                      handleDrop(e, null);
                    }
                  }}
                >
                  {activeTab}
                </span>
                {currentFolderId && (
                  <>
                    <span style={{ color: '#94a3b8' }}>/</span>
                    <span style={{ color: 'var(--brand-pink)', fontWeight: 600 }}>
                      {mockFolders.find(f => f.id === currentFolderId)?.name || 'Folder'}
                    </span>
                  </>
                )}
              </div>
              <div className="mm-grid">
                {displayData.map((item) => {
                  const isSelected = selectedFiles.find(f => f.id === item.id);
                  const isDragged = draggedItemIds.includes(item.id);
                  const isDragTarget = dragOverFolderId === item.id;
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`mm-grid-item ${isSelected ? 'selected' : ''}`}
                      style={{ 
                        opacity: isDragged ? 0.5 : 1,
                        outline: isDragTarget ? '2px dashed var(--brand-pink)' : 'none',
                        transform: isDragTarget ? 'scale(1.05)' : 'none',
                        transition: 'all 0.2s'
                      }}
                      onClick={() => handleSelect(item)}
                      onDoubleClick={(e) => item.type === 'folder' && handleFolderClick(item.id, e)}
                      draggable={item.type !== 'folder'} // Only files can be dragged
                      onDragStart={(e) => item.type !== 'folder' && handleDragStart(e, item)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => item.type === 'folder' ? handleDragOver(e, item.id) : null}
                      onDragLeave={(e) => item.type === 'folder' ? handleDragLeave(e) : null}
                      onDrop={(e) => item.type === 'folder' ? handleDrop(e, item.id) : null}
                    >
                      <div className="mm-grid-item-preview">
                        {item.type === 'folder' ? (
                          <Folder className="mm-folder-icon" fill="#fdf2f8" />
                        ) : item.type === 'video' ? (
                          <>
                            <video src={item.url} muted loop />
                            <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <PlayCircle size={16} color="#fff" />
                            </div>
                          </>
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
            onClick={handleAddToPage}
          >
            Update Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaManagerModal;
