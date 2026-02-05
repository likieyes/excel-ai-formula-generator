'use client'

interface CopyButtonProps {
  text: string
  className?: string
  children: React.ReactNode
}

export default function CopyButton({ text, className = '', children }: CopyButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={className}
    >
      {children}
    </button>
  )
}