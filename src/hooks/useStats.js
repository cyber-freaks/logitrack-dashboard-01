import { useQuery } from '@tanstack/react-query';

// Mock data for demonstration
const mockStats = {
  totalShipments: 1247,
  inTransit: 89,
  delivered: 1102,
  processing: 56,
  monthlyGrowth: 12.5,
  avgDeliveryTime: '2.3 days',
};

const fetchStats = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In production, replace with actual API call:
  // const response = await statsAPI.getDashboardStats();
  // return response.data;
  
  return mockStats;
};

export function useStats() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchStats,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}

export default useStats;
