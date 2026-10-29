"use client"

import React, { useMemo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

interface MathSnippetProps {
  content?: string | null
  className?: string
}

/**
 * MathSnippet renders concise Markdown text with inline/display KaTeX math equations,
 * specially tuned for preview cards with line-clamp or truncate.
 *
 * Features:
 * - Parses $x$, $Y$, \frac, \cdot etc. via KaTeX
 * - Escapes Brazilian currency 'R$' so remark-math doesn't misinterpret it as a math delimiter
 * - Keeps paragraphs and block elements inline so CSS -webkit-line-clamp works properly
 * - Suppresses large embedded images and bulky tables to prevent layout breaking
 */
export function MathSnippet({ content, className = "" }: MathSnippetProps) {
  const sanitizedContent = useMemo(() => {
    if (!content) return ""
    // Protect Brazilian currency R$ (e.g. R$ 50,00 or R$50) from opening math mode
    return content
      .replace(/R\$\s*(\d)/g, "R\\$ $1")
      .replace(/R\$/g, "R\\$")
  }, [content])

  if (!sanitizedContent) return null

  return (
    <div
      className={`leading-snug [&_.katex]:text-[1.05em] [&_.katex]:leading-none [&_.katex-display]:inline-block [&_.katex-display]:my-0 [&_.katex-display]:mx-1 ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Render paragraphs as inline spans to preserve line clamping
          p: ({ node, ...props }) => <span className="inline mr-1" {...props} />,
          h1: ({ node, ...props }) => <span className="font-bold inline mr-1" {...props} />,
          h2: ({ node, ...props }) => <span className="font-bold inline mr-1" {...props} />,
          h3: ({ node, ...props }) => <span className="font-semibold inline mr-1" {...props} />,
          h4: ({ node, ...props }) => <span className="font-semibold inline mr-1" {...props} />,
          h5: ({ node, ...props }) => <span className="font-semibold inline mr-1" {...props} />,
          h6: ({ node, ...props }) => <span className="font-semibold inline mr-1" {...props} />,
          // Suppress large block images in small card previews
          img: () => null,
          // Collapse tables into an unobtrusive inline tag
          table: () => <span className="inline text-slate-400 italic text-[10px] mx-1">[tabela]</span>,
          tbody: ({ node, ...props }) => <span className="inline" {...props} />,
          tr: ({ node, ...props }) => <span className="inline mr-1" {...props} />,
          td: ({ node, ...props }) => <span className="inline mr-1" {...props} />,
          th: ({ node, ...props }) => <span className="inline mr-1" {...props} />,
          ul: ({ node, ...props }) => <span className="inline mr-1" {...props} />,
          ol: ({ node, ...props }) => <span className="inline mr-1" {...props} />,
          li: ({ node, ...props }) => <span className="inline mr-1" {...props} />,
          blockquote: ({ node, ...props }) => <span className="italic inline mr-1" {...props} />,
          br: () => <span className="inline-block w-1" />,
        }}
      >
        {sanitizedContent}
      </ReactMarkdown>
    </div>
  )
}
