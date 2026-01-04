import { FiPackage, FiTruck, FiCheckCircle, FiLoader, FiTrendingUp } from 'react-icons/fi';
import { useStats } from '../../hooks/useStats';

const statCards = [
  { 
    key: 'totalShipments', 
    label: 'Total Shipments', 
    icon: FiPackage, 
    color: 'primary',
    format: (v) => v?.toLocaleString() 
  },
  { 
    key: 'inTransit', 
    label: 'In Transit', 
    icon: FiTruck, 
    color: 'warning',
    format: (v) => v?.toLocaleString() 
  },
  { 
    key: 'delivered', 
    label: 'Delivered', 
    icon: FiCheckCircle, 
    color: 'success',
    format: (v) => v?.toLocaleString() 
  },
  { 
    key: 'processing', 
    label: 'Processing', 
    icon: FiLoader, 
    color: 'info',
    format: (v) => v?.toLocaleString() 
  },
];

const colorClasses = {
  primary: {
    bg: 'bg-primary/10',
    icon: 'text-primary',
    glow: 'group-hover:shadow-[0_0_20px_hsl(24_95%_53%/0.3)]',
  },
  warning: {
    bg: 'bg-warning/10',
    icon: 'text-warning',
    glow: 'group-hover:shadow-[0_0_20px_hsl(38_92%_50%/0.3)]',
  },
  success: {
    bg: 'bg-success/10',
    icon: 'text-success',
    glow: 'group-hover:shadow-[0_0_20px_hsl(160_84%_39%/0.3)]',
  },
  info: {
    bg: 'bg-info/10',
    icon: 'text-info',
    glow: 'group-hover:shadow-[0_0_20px_hsl(199_89%_48%/0.3)]',
  },
};

export default function StatsCards() {
  const { data: stats, isLoading, error } = useStats();

  if (error) {
    return (
      <div className="glass rounded-xl p-6 text-destructive">
        Failed to load statistics
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, idx) => {
        const colors = colorClasses[stat.color];
        const Icon = stat.icon;
        
        return (
          <div 
            key={stat.key}
            className={`glass glass-hover rounded-xl p-6 group cursor-pointer transition-all duration-300 ${colors.glow}`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                {isLoading ? (
                  <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                ) : (
                  <p className="text-3xl font-bold text-foreground">
                    {stat.format(stats?.[stat.key])}
                  </p>
                )}
              </div>
              <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${colors.icon}`} />
              </div>
            </div>
            
            {/* Growth indicator */}
            {stat.key === 'totalShipments' && stats?.monthlyGrowth && (
              <div className="mt-4 flex items-center gap-1 text-success text-sm">
                <FiTrendingUp className="w-4 h-4" />
                <span>+{stats.monthlyGrowth}% this month</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
