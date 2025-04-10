'use client'

import { getQueryClient } from '@/config/get-query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import type * as React from 'react'
import { axiosInit } from "@/services/axios-init";
import { useEffect } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) axiosInit(token);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}