import { test } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "../src/pages/about";

// Test if headers are rendered
test("renders About page with correct headings", () => {
  render(<About />); // Rendering the About page component

  // Checking if the specific headings are present in the document
  expect(screen.getByText("What are we about")).toBeInTheDocument();
  expect(screen.getByText("Our Purpose")).toBeInTheDocument();
  expect(screen.getByText("Our Mission")).toBeInTheDocument();
  expect(screen.getByText("Our Values")).toBeInTheDocument();
  expect(screen.getByText("Our Story")).toBeInTheDocument();
});

// Test to check if the images are rendered correctly
test("renders images correctly", () => {
  render(<About />);

  // Querying all images by their role
  const images = screen.getAllByRole("img");
  expect(images).toHaveLength(4); // Asserting that exactly 4 images are rendered
});
