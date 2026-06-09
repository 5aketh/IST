import React, { useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BlockWrapper, AnimationType } from './BlockWrapper';

interface GraphBlockProps {
  type: 'bar' | 'grouped-bar';
  data: any[];
  xKey: string;
  yKeys: string[];
  className?: string;
  title?: string;
  colors?: string[];
  width?: string;
  animation?: AnimationType;
}

interface HoveredBar {
  key: string;
  index: number;
}

const DEFAULT_COLORS = ['#ff6b00', '#ff9a40', '#ffba70', '#cc5500', '#a0a0a0'];

export function GraphBlock({
  type,
  data,
  xKey,
  yKeys,
  className,
  title,
  colors = DEFAULT_COLORS,
  width,
  animation,
}: GraphBlockProps) {
  const [hoveredBar, setHoveredBar] = useState<HoveredBar | null>(null);
  return (
    <BlockWrapper className={className} width={width} animation={animation}>
      {title && (
        <h3 className="font-mono mb-4 pb-2" style={{ color: '#ff9a40', borderBottom: '1px solid rgba(255,107,0,0.2)' }}>
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,107,0,0.1)" />
          <XAxis
            dataKey={xKey}
            stroke="#666"
            tick={{ fill: '#888', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}
          />
          <YAxis
            stroke="#666"
            tick={{ fill: '#888', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(14, 12, 10, 0.95)',
              border: '1px solid rgba(255,107,0,0.4)',
              borderRadius: '0.375rem',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              boxShadow: '0 0 20px rgba(255,107,0,0.2)',
            }}
            cursor={{ fill: 'transparent' }}
            labelStyle={{ color: '#ff9a40' }}
            itemStyle={{ color: '#d0d0d0' }}
          />
          <Legend
            wrapperStyle={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              color: '#888',
            }}
          />
          {yKeys.map((key, idx) => (
            <Bar
              key={key}
              dataKey={key}
              radius={[3, 3, 0, 0]}
              fill={colors[idx % colors.length]}
            >
              {data.map((entry, entryIndex) => {
                const isActive = hoveredBar?.key === key && hoveredBar.index === entryIndex;
                return (
                  <Cell
                    key={`${key}-${entryIndex}`}
                    fill={colors[idx % colors.length]}
                    fillOpacity={isActive ? 0.95 : 0.85}
                    stroke={isActive ? 'rgba(255,255,255,0.6)' : 'transparent'}
                    strokeWidth={isActive ? 1 : 0}
                    style={isActive ? { filter: 'drop-shadow(0 0 8px rgba(255,107,0,0.35))' } : undefined}
                    onMouseEnter={() => setHoveredBar({ key, index: entryIndex })}
                    onMouseLeave={() => setHoveredBar(null)}
                  />
                );
              })}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </BlockWrapper>
  );
}
