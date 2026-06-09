import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { BlockWrapper, AnimationType } from './BlockWrapper';

// Dark-orange Python-first theme
const darkOrangeTheme: Record<string, React.CSSProperties> = {
  'code[class*="language-"]': {
    color: '#e0d0c0',
    background: 'transparent',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.85rem',
    lineHeight: '1.6',
  },
  'pre[class*="language-"]': {
    color: '#e0d0c0',
    background: 'rgba(12, 10, 8, 0.85)',
    padding: '1rem',
    borderRadius: '0.375rem',
    overflow: 'auto',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.85rem',
    lineHeight: '1.6',
  },
  comment: { color: '#6a5a4a', fontStyle: 'italic' },
  prolog: { color: '#6a5a4a' },
  doctype: { color: '#6a5a4a' },
  cdata: { color: '#6a5a4a' },
  punctuation: { color: '#a08060' },
  namespace: { opacity: '0.7' } as any,
  property: { color: '#ff9a40' },
  tag: { color: '#ff6b00' },
  boolean: { color: '#ff6b00' },
  number: { color: '#ffba70' },
  constant: { color: '#ff9a40' },
  symbol: { color: '#ff9a40' },
  deleted: { color: '#cc3300' },
  selector: { color: '#ff8c33' },
  'attr-name': { color: '#ff9a40' },
  string: { color: '#d4a060' },
  char: { color: '#d4a060' },
  builtin: { color: '#ff8c33' },
  inserted: { color: '#b87030' },
  operator: { color: '#cc8040' },
  entity: { color: '#ff9a40', cursor: 'help' },
  url: { color: '#d4a060' },
  variable: { color: '#e8c090' },
  atrule: { color: '#ff6b00' },
  'attr-value': { color: '#d4a060' },
  keyword: { color: '#ff6b00' },
  function: { color: '#ff9a40' },
  'class-name': { color: '#ffba70' },
  regex: { color: '#d4a060' },
  important: { color: '#ff6b00', fontWeight: 'bold' },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
};

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  title?: string;
  width?: string;
  animation?: AnimationType;
}

export function CodeBlock({
  code,
  language = 'python',
  className,
  title,
  width,
  animation,
}: CodeBlockProps) {
  return (
    <BlockWrapper className={className} width={width} animation={animation}>
      {title && (
        <div className="flex items-center justify-between mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,107,0,0.2)' }}>
          <span className="font-mono text-sm" style={{ color: '#ff9a40' }}>{title}</span>
          <span className="font-mono text-xs uppercase" style={{ color: '#888' }}>{language}</span>
        </div>
      )}
      <div className="rounded overflow-hidden" style={{ border: '1px solid rgba(255,107,0,0.15)' }}>
        <SyntaxHighlighter
          language={language}
          style={darkOrangeTheme}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'rgba(10, 8, 6, 0.8)',
            fontSize: '0.85rem',
          }}
          codeTagProps={{ style: { fontFamily: "'JetBrains Mono', monospace" } }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </BlockWrapper>
  );
}
