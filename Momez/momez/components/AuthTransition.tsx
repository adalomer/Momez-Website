'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AuthTransitionProps {
  children: ReactNode
  type?: 'login' | 'logout'
}

export default function AuthTransition({ children, type = 'login' }: AuthTransitionProps) {
  const variants = {
    login: {
      initial: { scale: 0.8, opacity: 0, rotateX: -20 },
      animate: { scale: 1, opacity: 1, rotateX: 0 },
      exit: { scale: 1.2, opacity: 0, rotateX: 20 },
    },
    logout: {
      initial: { scale: 1.2, opacity: 0, x: 200 },
      animate: { scale: 1, opacity: 1, x: 0 },
      exit: { scale: 0.8, opacity: 0, x: -200 },
    },
  }

  return (
    <motion.div
      initial={variants[type].initial}
      animate={variants[type].animate}
      exit={variants[type].exit}
      transition={{
        duration: 0.7,
        ease: [0.43, 0.13, 0.23, 0.96],
      }}
    >
      {children}
    </motion.div>
  )
}
