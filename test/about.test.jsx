import { test } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "../src/pages/about";

test("renders About page with correct headings", () => {
  render(<About />);

  expect(screen.getByText("What are we about")).toBeInTheDocument();
  expect(screen.getByText("Our Purpose")).toBeInTheDocument();
  expect(screen.getByText("Our Mission")).toBeInTheDocument();
  expect(screen.getByText("Our Values")).toBeInTheDocument();
  expect(screen.getByText("Our Story")).toBeInTheDocument();
});

test("renders images correctly", () => {
  render(<About />);
  
  const images = screen.getAllByRole("img");
  expect(images).toHaveLength(4);
});
