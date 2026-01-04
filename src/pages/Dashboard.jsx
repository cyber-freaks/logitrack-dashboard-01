import { useState } from 'react';
import { FiPackage, FiUpload } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import StatsCards from '../components/dashboard/StatsCards';
import ShipmentTable from '../components/dashboard/ShipmentTable';
import QuickUpload from '../components/dashboard/QuickUpload';

const tabs = [
  { id: 'shipments', label: 'Shipment List', icon: FiPackage },
  { id: 'upload', label: 'Quick Upload', icon: FiUpload },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('shipments');

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Track and manage your shipments</p>
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Tabs Section */}
        <div className="glass rounded-xl overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all border-b-2 -mb-[2px] ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'shipments' && <ShipmentTable />}
            {activeTab === 'upload' && <QuickUpload />}
          </div>
        </div>
      </div>
    </Layout>
  );
}
