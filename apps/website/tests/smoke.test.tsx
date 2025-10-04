import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import Hero from "../app/components/Hero";

test("renders headline", () => {
  render(<Hero variant="roi" />);
  expect(screen.getByText(/ROI/i)).toBeInTheDocument();
});
