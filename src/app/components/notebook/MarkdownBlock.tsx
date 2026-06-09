import React from 'react';
import ReactMarkdown from 'react-markdown';
import { BlockWrapper, AnimationType } from './BlockWrapper';

interface MarkdownBlockProps {
  content: string;
  className?: string;
  width?: string;
  animation?: AnimationType;
}

export function MarkdownBlock({ content, className, width, animation }: MarkdownBlockProps) {
  return (
    <BlockWrapper className={className} width={width} animation={animation}>
      <div className="prose max-w-none font-mono" style={{ color: '#d0d0d0' }}>
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="mb-4 pb-2 font-mono" style={{ color: '#ff6b00', borderBottom: '1px solid rgba(255,107,0,0.3)' }}>{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="mb-3 font-mono" style={{ color: '#ff9a40' }}>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="mb-2 font-mono" style={{ color: '#ffba70' }}>{children}</h3>
            ),
            p: ({ children }) => (
              <p className="mb-3 leading-relaxed" style={{ color: '#c8c8c8' }}>{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="mb-3 list-disc list-inside" style={{ color: '#c8c8c8' }}>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-3 list-decimal list-inside" style={{ color: '#c8c8c8' }}>{children}</ol>
            ),
            li: ({ children }) => <li className="mb-1">{children}</li>,
            code: ({ children }) => (
              <code
                className="px-1.5 py-0.5 rounded text-sm"
                style={{
                  background: 'rgba(255,107,0,0.1)',
                  color: '#ff9a40',
                  border: '1px solid rgba(255,107,0,0.2)',
                }}
              >
                {children}
              </code>
            ),
            blockquote: ({ children }) => (
              <blockquote className="pl-4 italic" style={{ borderLeft: '4px solid rgba(255,107,0,0.5)', color: '#888' }}>
                {children}
              </blockquote>
            ),
            strong: ({ children }) => (
              <strong style={{ color: '#ff9a40' }}>{children}</strong>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </BlockWrapper>
  );
}
