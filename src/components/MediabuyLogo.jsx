import React from 'react'

export default function MediabuyLogo({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'h-11 w-11',
    md: 'h-14 w-14',
    lg: 'h-20 w-20',
    hero: 'h-28 w-28'
  }

  const containerSize = sizeClasses[size] || sizeClasses.md

  return (
    <div className={`relative flex items-center justify-center rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(56,189,248,0.4)] ${containerSize} ${className}`}>
      <img
        src="/logo.svg"
        alt="Mediabuy Lab Logo"
        className="h-full w-full object-cover rounded-2xl"
      />
    </div>
  )
}
