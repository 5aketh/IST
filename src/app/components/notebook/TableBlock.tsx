import React from 'react';
import { BlockWrapper, AnimationType } from './BlockWrapper';

interface TableBlockProps {
  columns: string[];
  data: Record<string, any>[];
  className?: string;
  title?: string;
  width?: string;
  animation?: AnimationType;
}

export function TableBlock({ columns, data, className, title, width, animation }: TableBlockProps) {
  return (
    <BlockWrapper className={className} width={width} animation={animation}>
      {title && (
        <h3 className="font-mono mb-4 pb-2" style={{ color: '#ff9a40', borderBottom: '1px solid rgba(255,107,0,0.2)' }}>
          {title}
        </h3>
      )}
      <div className="overflow-x-auto">
        <table className="w-full font-mono text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,107,0,0.35)' }}>
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className="text-left py-3 px-4 uppercase text-xs tracking-wider"
                  style={{ color: '#ff9a40' }}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="transition-colors duration-150"
                style={{ borderBottom: '1px solid rgba(255,107,0,0.1)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,107,0,0.06)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
              >
                {columns.map((column, colIdx) => (
                  <td key={colIdx} className="py-3 px-4" style={{ color: '#d0d0d0' }}>
                    {row[column] ?? '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BlockWrapper>
  );
}
