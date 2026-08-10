import { motion } from 'motion/react'

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050914]" aria-hidden="true">
      {/* Orb 1: Shifting Cyan/Deep Blue mesh glow */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 25, 0],
          scale: [1, 1.15, 0.95, 1],
          opacity: [0.35, 0.55, 0.4, 0.35]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute -left-20 -top-20 h-[30rem] w-[30rem] rounded-full bg-gradient-to-br from-cyan-500/25 via-blue-600/20 to-indigo-900/10 blur-[100px]"
        style={{ transform: 'translate3d(0,0,0)', willChange: 'transform, opacity' }}
      />

      {/* Orb 2: Deep Violet/Indigo ambient pulse */}
      <motion.div
        animate={{
          x: [0, -45, 30, 0],
          y: [0, 35, -25, 0],
          scale: [1, 1.2, 0.9, 1],
          opacity: [0.3, 0.5, 0.35, 0.3]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute -right-24 top-1/3 h-[32rem] w-[32rem] rounded-full bg-gradient-to-tl from-indigo-600/20 via-purple-700/15 to-blue-950/20 blur-[110px]"
        style={{ transform: 'translate3d(0,0,0)', willChange: 'transform, opacity' }}
      />

      {/* Orb 3: Electric Sky Blue bottom pulse */}
      <motion.div
        animate={{
          x: [0, 35, -35, 0],
          y: [0, -25, 45, 0],
          scale: [1, 1.12, 0.95, 1],
          opacity: [0.25, 0.45, 0.3, 0.25]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute -bottom-32 left-1/4 h-[30rem] w-[30rem] rounded-full bg-gradient-to-r from-blue-500/20 via-cyan-600/15 to-teal-900/10 blur-[100px]"
        style={{ transform: 'translate3d(0,0,0)', willChange: 'transform, opacity' }}
      />

      {/* Cyber Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />
    </div>
  )
}
