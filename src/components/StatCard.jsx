import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  bgColor = 'bg-blue-50',
  iconColor = 'text-blue-600',
  borderColor = 'border-blue-200',
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={16} className="text-green-600" />;
    if (trend === 'down') return <TrendingDown size={16} className="text-red-600" />;
    return <Minus size={16} className="text-gray-600" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`${bgColor} rounded-lg border ${borderColor} p-6 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
        <div className={`${iconColor} p-3 rounded-lg bg-white`}>
          {Icon && <Icon size={24} />}
        </div>
      </div>
      {trendValue && (
        <div className="mt-4 flex items-center gap-1">
          {getTrendIcon()}
          <span className={`text-sm font-semibold ${getTrendColor()}`}>{trendValue}</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
