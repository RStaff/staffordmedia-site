"use client";
import React, { Component, ReactNode } from "react";
import Link from "next/link";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Unhandled error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
          <h1 className="text-2xl font-bold mb-4 text-[#1C2D4A]">
            Something went wrong.
          </h1>
          <p className="text-gray-700 mb-6">
            We’re on it. Please try again or contact support.
          </p>
          <Link
            href="/"
            className="bg-[#FFD700] text-[#1C2D4A] px-4 py-2 rounded font-semibold"
          >
            Return Home
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
