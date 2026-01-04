import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { generateId } from '../utils/utils';

// Mock documents data
const mockDocuments = [
  {
    id: 'LT-ABC123',
    trackingNumber: 'TRK-2024-001',
    sender: 'Acme Corp',
    receiver: 'TechStart Inc',
    weight: '12.5 kg',
    status: 'delivered',
    origin: 'New York, NY',
    destination: 'Los Angeles, CA',
    createdAt: '2024-01-15T10:30:00Z',
    rawResponse: '{"items": [{"name": "Electronics", "qty": 5}], "notes": "Handle with care"}',
  },
  {
    id: 'LT-DEF456',
    trackingNumber: 'TRK-2024-002',
    sender: 'Global Supplies',
    receiver: 'Local Store',
    weight: '8.2 kg',
    status: 'transit',
    origin: 'Chicago, IL',
    destination: 'Miami, FL',
    createdAt: '2024-01-16T14:45:00Z',
    rawResponse: '{"items": [{"name": "Office Supplies", "qty": 20}]}',
  },
  {
    id: 'LT-GHI789',
    trackingNumber: 'TRK-2024-003',
    sender: 'Fashion House',
    receiver: 'Retail Outlet',
    weight: '3.1 kg',
    status: 'processing',
    origin: 'Dallas, TX',
    destination: 'Seattle, WA',
    createdAt: '2024-01-17T09:15:00Z',
    rawResponse: '{"items": [{"name": "Apparel", "qty": 15}], "priority": "express"}',
  },
  {
    id: 'LT-JKL012',
    trackingNumber: 'TRK-2024-004',
    sender: 'Auto Parts Co',
    receiver: 'Mechanic Shop',
    weight: '25.0 kg',
    status: 'delivered',
    origin: 'Detroit, MI',
    destination: 'Phoenix, AZ',
    createdAt: '2024-01-14T16:20:00Z',
    rawResponse: '{"items": [{"name": "Car Parts", "qty": 8}]}',
  },
  {
    id: 'LT-MNO345',
    trackingNumber: 'TRK-2024-005',
    sender: 'Health Supplies',
    receiver: 'City Hospital',
    weight: '5.7 kg',
    status: 'transit',
    origin: 'Boston, MA',
    destination: 'Denver, CO',
    createdAt: '2024-01-17T11:00:00Z',
    rawResponse: '{"items": [{"name": "Medical Equipment", "qty": 3}], "fragile": true}',
  },
];

const fetchDocuments = async ({ search = '', status = '' }) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  let filtered = [...mockDocuments];
  
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(doc => 
      doc.trackingNumber.toLowerCase().includes(searchLower) ||
      doc.sender.toLowerCase().includes(searchLower) ||
      doc.receiver.toLowerCase().includes(searchLower)
    );
  }
  
  if (status && status !== 'all') {
    filtered = filtered.filter(doc => doc.status === status);
  }
  
  return filtered;
};

const fetchDocumentById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const doc = mockDocuments.find(d => d.id === id);
  if (!doc) throw new Error('Document not found');
  return doc;
};

export function useDocuments(filters = {}) {
  return useQuery({
    queryKey: ['documents', filters],
    queryFn: () => fetchDocuments(filters),
    staleTime: 10000,
  });
}

export function useDocument(id) {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => fetchDocumentById(id),
    enabled: !!id,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (file) => {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock document from uploaded file
      const newDoc = {
        id: generateId(),
        trackingNumber: `TRK-${Date.now()}`,
        sender: 'Uploaded Document',
        receiver: 'Processing...',
        weight: 'TBD',
        status: 'processing',
        origin: 'Upload',
        destination: 'Processing',
        createdAt: new Date().toISOString(),
        fileName: file.name,
        rawResponse: '{"status": "Processing OCR..."}',
      };
      
      // In production, upload to actual API:
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await documentsAPI.upload(formData);
      // return response.data;
      
      return newDoc;
    },
    onSuccess: () => {
      // Invalidate documents query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export default useDocuments;
