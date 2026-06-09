import React from 'react';
import { MarkdownBlock } from './MarkdownBlock';
import { CodeBlock } from './CodeBlock';
import { TableBlock } from './TableBlock';
import { GraphBlock } from './GraphBlock';
import type { AnimationType } from './BlockWrapper';

export type BlockType = 'markdown' | 'code' | 'table' | 'graph';

export interface MarkdownBlockConfig {
  type: 'markdown';
  content: string;
  width?: string;
  animation?: AnimationType;
}

export interface CodeBlockConfig {
  type: 'code';
  code: string;
  language?: string;
  title?: string;
  width?: string;
  animation?: AnimationType;
}

export interface TableBlockConfig {
  type: 'table';
  columns: string[];
  data: Record<string, any>[];
  title?: string;
  width?: string;
  animation?: AnimationType;
}

export interface GraphBlockConfig {
  type: 'graph';
  graphType: 'bar' | 'grouped-bar';
  data: any[];
  xKey: string;
  yKeys: string[];
  title?: string;
  colors?: string[];
  width?: string;
  animation?: AnimationType;
}

export type Block =
  | MarkdownBlockConfig
  | CodeBlockConfig
  | TableBlockConfig
  | GraphBlockConfig;

interface DashboardNotebookProps {
  blocks: Block[];
  className?: string;
}

export function DashboardNotebook({ blocks, className = '' }: DashboardNotebookProps) {
  const renderBlock = (block: Block, index: number) => {
    const key = `block-${index}`;
    const sharedProps = {
      width: block.width,
      animation: block.animation,
    };

    switch (block.type) {
      case 'markdown':
        return <MarkdownBlock key={key} content={block.content} {...sharedProps} />;
      case 'code':
        return (
          <CodeBlock
            key={key}
            code={block.code}
            language={block.language}
            title={block.title}
            {...sharedProps}
          />
        );
      case 'table':
        return (
          <TableBlock
            key={key}
            columns={block.columns}
            data={block.data}
            title={block.title}
            {...sharedProps}
          />
        );
      case 'graph':
        return (
          <GraphBlock
            key={key}
            type={block.graphType}
            data={block.data}
            xKey={block.xKey}
            yKeys={block.yKeys}
            title={block.title}
            colors={block.colors}
            {...sharedProps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex flex-wrap gap-6 ${className}`}
      style={{ alignItems: 'flex-start' }}
    >
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
