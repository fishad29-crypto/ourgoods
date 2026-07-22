import React, { useState } from 'react';
import { Truck, MapPin, Package, CheckCircle2, Search, Filter, MoreVertical, Map, Clock, AlertTriangle } from 'lucide-react';
import '../admin.css';

const MOCK_SHIPMENTS = [
  { id: 'SHP-1001', orderId: '#ORD-1045', customer: 'Faisal Mahmud', courier: 'Steadfast', trackingId: 'SF-92837492', destination: 'Dhaka', status: 'In Transit', date: '2026-07-14' },
  { id: 'SHP-1002', orderId: '#ORD-1046', customer: 'Sadia Islam', courier: 'Pathao', trackingId: 'PT-38475920', destination: 'Chittagong', status: 'Out for Delivery', date: '2026-07-13' },
  { id: 'SHP-1003', orderId: '#ORD-1020', customer: 'Tanvir Ahmed', courier: 'RedX', trackingId: 'RX-10293847', destination: 'Sylhet', status: 'Delivered', date: '2026-07-11' },
  { id: 'SHP-1004', orderId: '#ORD-1011', customer: 'Rahim Uddin', courier: 'eCourier', trackingId: 'EC-58473629', destination: 'Rajshahi', status: 'Pending Pickup', date: '2026-07-14' },
  { id: 'SHP-1005', orderId: '#ORD-1055', customer: 'Karim Hasan', courier: 'Steadfast', trackingId: 'SF-19283746', destination: 'Khulna', status: 'Exception', date: '2026-07-10' },
];

const ShippingCourier = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredShipments = MOCK_SHIPMENTS.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">Shipping & Courier</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Track order shipments, manage courier partners, and delivery status.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--brand-pink)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#fff', fontSize: '14px', fontWeight: 500 }}>
            <Map size={16} /> Manage Zones
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Total Active Shipments</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>124</div>
          </div>
        </div>
        
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>In Transit</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>45</div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Delivered (This Month)</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>892</div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="search-bar" style={{ width: '350px', margin: 0 }}>
            <Search size={18} className="search-icon" style={{ left: '12px' }} />
            <input 
              type="text" 
              placeholder="Search tracking ID, order, customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
              <Filter size={16} /> Filter by Courier
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Shipment & Order</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Courier Partner</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Destination</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{shipment.id}</div>
                    <div style={{ fontSize: '13px', color: '#3b82f6', marginTop: '4px', fontWeight: 500 }}>{shipment.orderId}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{shipment.courier}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{shipment.trackingId}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} color="#64748b" /> {shipment.destination}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', marginLeft: '20px' }}>{shipment.customer}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#64748b' }}>
                    {shipment.date}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {shipment.status === 'Pending Pickup' && <Clock size={16} color="#64748b" />}
                      {shipment.status === 'In Transit' && <Truck size={16} color="#3b82f6" />}
                      {shipment.status === 'Out for Delivery' && <Truck size={16} color="#f59e0b" />}
                      {shipment.status === 'Delivered' && <CheckCircle2 size={16} color="#10b981" />}
                      {shipment.status === 'Exception' && <AlertTriangle size={16} color="#ef4444" />}
                      <span style={{ 
                        fontSize: '13px', fontWeight: 600, 
                        color: shipment.status === 'Pending Pickup' ? '#64748b' : 
                               shipment.status === 'In Transit' ? '#3b82f6' : 
                               shipment.status === 'Out for Delivery' ? '#f59e0b' : 
                               shipment.status === 'Delivered' ? '#10b981' : '#ef4444' 
                      }}>
                        {shipment.status}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button style={{ padding: '6px 12px', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Track</button>
                  </td>
                </tr>
              ))}
              
              {filteredShipments.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                    No shipments found matching "{searchTerm}"
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

export default ShippingCourier;