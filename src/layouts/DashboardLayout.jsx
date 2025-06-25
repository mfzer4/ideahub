import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header'; 
import { motion } from 'framer-motion';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background via-background to-background/90 text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <motion.main 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 custom-scrollbar"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout;