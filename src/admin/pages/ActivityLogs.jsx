import React, { useState } from 'react';
import { Activity, User, MonitorSmartphone, Clock, Search, Filter, ShieldAlert } from 'lucide-react';
import '../admin.css';

const MOCK_LOGS = [
  { id: 'LOG-592', user: 'Admin User', action: 'Approved Return Request #RET-1002', type: 'Write', ip: '192.168.1.45', time: '10 mins ago' },
  { id: 'LOG-591', user: 'Fishad Mohammad', action: 'Changed settings for Payment Gateway', type: 'Config', ip: '114.12.33.19', time: '1 hour ago' },
  { id: 'LOG-590', user: 'Sarah Ahmed', action: 'Replied to Ticket #TKT-1041', type: 'Write', ip: '10.0.0.12', time: '2 hours ago' },
  { id: 'LOG-589', user: 'Admin User', action: 'Logged in successfully', type: 'Auth', ip: '192.168.1.45', time: '5 hours ago' },
  { id: 'LOG-588', user: 'Unknown IP', action: 'Failed login attempt (Incorrect password)', type: 'Security', ip: '45.22.19.102', time: '1 day ago' },
];

const ActivityLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredLogs = MOCK_LOGS.filter(l => 
    l.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">Activity Logs</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Monitor admin actions, security events, and system changes.</p>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="search-bar" style={{ width: '350px', margin: 0 }}>
            <Search size={18} className="search-icon" style={{ left: '12px' }} />
            <input 
              type="text" 
              placeholder="Search user, action, or IP..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
              <Filter size={16} /> Filter by Event Type
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>User & IP</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Event Type</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Action Description</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={14} color="#64748b" /> {log.user}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MonitorSmartphone size={12} /> {log.ip}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
                      background: log.type === 'Security' ? '#fee2e2' : log.type === 'Auth' ? '#dcfce7' : log.type === 'Config' ? '#fef3c7' : '#f1f5f9',
                      color: log.type === 'Security' ? '#ef4444' : log.type === 'Auth' ? '#16a34a' : log.type === 'Config' ? '#d97706' : '#64748b'
                    }}>
                      {log.type}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '14px', color: '#334155' }}>{log.action}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} /> {log.time}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                    No activity logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;