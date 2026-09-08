import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Container from '../components/ui-components/container';
import { fadeUp, softHover } from '../utils/motion';

export default function ComingSoon({ title, description }) {
  return (
    <Container className="py-10">
      <motion.div
        {...fadeUp}
        {...softHover}
        className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-white p-10 shadow-sm"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-100/70 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-sky-100/80 blur-2xl" />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
            <Sparkles className="h-4 w-4" />
            Coming soon
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-3 max-w-2xl text-gray-600">{description}</p>
        </div>
      </motion.div>
    </Container>
  );
}
