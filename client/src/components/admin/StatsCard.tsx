import { ReactNode } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  description?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  change,
  trend,
  description = 'from last month'
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-gray-100 text-gray-800 mr-4">
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-bold">{value}</p>
            <p className={`text-xs flex items-center ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {trend === 'up' && <ArrowUpIcon className="mr-1" size={12} />}
              {trend === 'down' && <ArrowDownIcon className="mr-1" size={12} />}
              {change > 0 && '+'}{change.toFixed(1)}% {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
