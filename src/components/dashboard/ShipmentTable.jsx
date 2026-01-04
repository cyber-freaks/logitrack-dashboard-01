import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useDocuments } from '../../hooks/useDocuments';
import { formatDate, getStatusColor, truncateText, debounce } from '../../utils/utils';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'transit', label: 'In Transit' },
  { value: 'processing', label: 'Processing' },
];

export default function ShipmentTable() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('all');

  const debouncedSetSearch = useCallback(
    debounce((value) => setDebouncedSearch(value), 300),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSetSearch(value);
  };

  const { data: documents, isLoading, error } = useDocuments({ 
    search: debouncedSearch, 
    status 
  });

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by tracking #, sender, receiver..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <FiFilter className="w-5 h-5 text-muted-foreground" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tracking #</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sender</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Receiver</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Route</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-border/50">
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="py-4 px-4">
                      <div className="h-4 bg-muted animate-pulse rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-destructive">
                  Failed to load shipments
                </td>
              </tr>
            ) : documents?.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-foreground">
                  No shipments found
                </td>
              </tr>
            ) : (
              documents?.map((doc) => (
                <tr key={doc.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm text-primary">{doc.trackingNumber}</span>
                  </td>
                  <td className="py-4 px-4 text-sm text-foreground">{truncateText(doc.sender, 20)}</td>
                  <td className="py-4 px-4 text-sm text-foreground">{truncateText(doc.receiver, 20)}</td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {truncateText(doc.origin, 15)} → {truncateText(doc.destination, 15)}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">{formatDate(doc.createdAt)}</td>
                  <td className="py-4 px-4 text-right">
                    <Link
                      to={`/documents/${doc.id}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-primary hover:bg-primary/10 transition-colors"
                    >
                      <FiEye className="w-4 h-4" />
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {documents && documents.length > 0 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Showing {documents.length} shipments
          </span>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50" disabled>
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">1</span>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50" disabled>
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
