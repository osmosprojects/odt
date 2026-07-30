"use client";

import React from "react";

interface PipelineSidebarProps {
  children?: React.ReactNode;
}

export default function PipelineSidebar({ children }: PipelineSidebarProps) {
  // Simple layout utility wrapper to ensure it compiles cleanly and fits layout structures
  return <div className="w-full">{children}</div>;
}
