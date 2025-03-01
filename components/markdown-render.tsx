import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import emoji from 'remark-emoji';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';

const MarkdownRenderer = ({ content, className }) => {
  return (
    <ReactMarkdown
      className={cn(
        'prose prose-slate dark:prose-invert max-w-none',
        // Improved heading sizes and spacing
        'prose-h1:text-4xl prose-h1:font-bold prose-h1:mt-8 prose-h1:mb-6',
        'prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4',
        'prose-h3:text-2xl prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-3',
        'prose-h4:text-xl prose-h4:font-semibold prose-h4:mt-5 prose-h4:mb-2',
        'prose-h5:text-lg prose-h5:font-medium prose-h5:mt-4 prose-h5:mb-2',
        'prose-h6:text-base prose-h6:font-medium prose-h6:mt-4 prose-h6:mb-2',
        // Improved paragraph spacing
        'prose-p:text-base font-normal prose-p:leading-7 prose-p:my-4',
        // Improved spacing between different elements
        '[&>h1+p]:mt-3 [&>h2+p]:mt-2 [&>h3+p]:mt-2 [&>p+h1]:mt-10 [&>p+h2]:mt-8 [&>p+h3]:mt-6',
        // Blockquote styling
        'prose-blockquote:border-l-4 prose-blockquote:border-slate-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-800 dark:prose-blockquote:border-slate-600 prose-blockquote:py-1 prose-blockquote:my-5 prose-blockquote:rounded-sm',
        // Code styling
        'prose-code:font-mono prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm',
        // Image styling
        'prose-img:rounded-md prose-img:shadow-md prose-img:my-6',
        // Link styling
        'prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-medium prose-a:underline-offset-2 hover:prose-a:text-blue-500 dark:hover:prose-a:text-blue-300',
        // List styling with improved spacing
        'prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4 prose-ol:pl-6 prose-ol:my-4',
        'prose-li:my-1.5 prose-li:leading-6',
        // Text styling
        'prose-strong:font-bold prose-em:italic',
        // Horizontal rule
        'prose-hr:my-8 prose-hr:border-slate-200 dark:prose-hr:border-slate-700',
        className
      )}
      remarkPlugins={[remarkGfm, emoji]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              language={match[1]}
              style={vscDarkPlus}
              className="rounded-md border text-lg !bg-slate-950 my-5 overflow-hidden"
              showLineNumbers
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code
              className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-sm font-mono"
              {...props}
            >
              {children}
            </code>
          );
        },
        // Improved table styling with distinct borders
        table({ node, className, children, ...props }) {
          return (
            <div className="my-6 overflow-x-auto">
              <table className="w-full border-collapse rounded-md" {...props}>
                {children}
              </table>
            </div>
          );
        },
        thead({ node, children, ...props }) {
          return (
            <thead className="bg-slate-100 dark:bg-slate-800" {...props}>
              {children}
            </thead>
          );
        },
        tbody({ node, children, ...props }) {
          return (
            <tbody
              className="divide-y divide-slate-200 dark:divide-slate-700"
              {...props}
            >
              {children}
            </tbody>
          );
        },
        tr({ node, children, ...props }) {
          return (
            <tr
              className="divide-x divide-slate-200 dark:divide-slate-700"
              {...props}
            >
              {children}
            </tr>
          );
        },
        th({ node, children, ...props }) {
          return (
            <th
              className="p-3 text-left font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              {...props}
            >
              {children}
            </th>
          );
        },
        td({ node, children, ...props }) {
          return (
            <td
              className="p-3 border border-slate-200 dark:border-slate-700"
              {...props}
            >
              {children}
            </td>
          );
        },
        a({ node, className, children, ...props }) {
          return (
            <a
              className="text-blue-600 dark:text-blue-400 font-medium underline underline-offset-2 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          );
        },
        blockquote({ node, className, children, ...props }) {
          return (
            <blockquote
              className="border-l-4 border-border pl-4 italic bg-slate-50 dark:bg-slate-800 py-2 my-5 rounded-sm"
              {...props}
            >
              {children}
            </blockquote>
          );
        },
        ul({ node, className, children, ...props }) {
          return (
            <ul className="list-disc pl-6 my-4 space-y-1" {...props}>
              {children}
            </ul>
          );
        },
        ol({ node, className, children, ...props }) {
          return (
            <ol className="list-decimal pl-6 my-4 space-y-1" {...props}>
              {children}
            </ol>
          );
        },
        li({ node, className, children, ...props }) {
          return (
            <li className="my-1.5 leading-6" {...props}>
              {children}
            </li>
          );
        },
        img({ node, className, alt, ...props }) {
          return (
            <img
              className="rounded-md shadow-md my-6 max-w-full h-auto"
              alt={alt || ''}
              loading="lazy"
              {...props}
            />
          );
        },
        hr({ node, className, ...props }) {
          return <hr className="my-8 border-border" {...props} />;
        },
        p({ node, className, children, ...props }) {
          return (
            <p className="text-base leading-7 my-4" {...props}>
              {children}
            </p>
          );
        },
        // Add special styling for task lists
        input({ node, checked, ...props }) {
          return (
            <input
              type="checkbox"
              checked={checked}
              disabled
              className="mr-1.5 h-4 w-4 rounded border-border text-blue-600 focus:ring-blue-600"
              {...props}
            />
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
