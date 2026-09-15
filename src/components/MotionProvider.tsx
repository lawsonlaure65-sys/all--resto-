import React from 'react';
import { MotionConfig } from 'motion/react';

export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionConfig reducedMotion="never">
      {children}
    </MotionConfig>
  );
}
