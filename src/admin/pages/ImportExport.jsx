import React from 'react';
import { UploadCloud, DownloadCloud, FileSpreadsheet, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import '../admin.css';

const ImportExport = () => {
  return (
    <div className="admin-content">
      <div className="page-header">
        <h2 className="page-title">Import & Export</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Bulk manage products, customers, and orders via CSV/Excel files.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Import Section */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UploadCloud size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Import Data</h3>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>Select Data Type</label>
            <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', color: '#0f172a' }}>
              <option>Products Catalog</option>
              <option>Customers List</option>
              <option>Inventory Update</option>
            </select>
          </div>

          <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '32px 20px', textAlign: 'center', background: '#f8fafc', marginBottom: '20px', cursor: 'pointer' }}>
            <FileSpreadsheet size={32} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Click to upload or drag and drop</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>CSV or Excel files only (max. 10MB)</div>
          </div>

          <button style={{ width: '100%', padding: '12px', background: 'var(--brand-pink)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Start Import
          </button>
        </div>

        {/* Export Section */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DownloadCloud size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Export Data</h3>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>Select Data Type</label>
            <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', color: '#0f172a' }}>
              <option>All Orders</option>
              <option>Products Catalog</option>
              <option>Customers List</option>
              <option>Financial Report</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>Date Range (Optional)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input type="date" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
              <input type="date" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: 'var(--brand-pink)' }} />
              Include archived/deleted records
            </label>
          </div>

          <button style={{ width: '100%', padding: '12px', background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <DownloadCloud size={16} /> Generate Export File
          </button>
        </div>

      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 600 }}>Recent Import/Export History</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Job Type</th>
              <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Data Category</th>
              <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Records</th>
              <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DownloadCloud size={16} color="#16a34a" /> Export
              </td>
              <td style={{ padding: '16px', fontSize: '14px', color: '#334155' }}>All Orders (July)</td>
              <td style={{ padding: '16px' }}><span style={{ color: '#16a34a', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} /> Completed</span></td>
              <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>1,245 rows</td>
              <td style={{ padding: '16px', fontSize: '13px', color: '#64748b' }}>Today, 10:45 AM</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UploadCloud size={16} color="#4f46e5" /> Import
              </td>
              <td style={{ padding: '16px', fontSize: '14px', color: '#334155' }}>Products Catalog Update</td>
              <td style={{ padding: '16px' }}><span style={{ color: '#ef4444', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={14} /> Failed</span></td>
              <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>-</td>
              <td style={{ padding: '16px', fontSize: '13px', color: '#64748b' }}>Yesterday, 04:20 PM</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ImportExport;