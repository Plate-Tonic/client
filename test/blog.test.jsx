import { test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Blog from "../src/pages/blog";

// Test if the Blog page renders the main title
test("renders blog page with title", () => {
  render(
    <MemoryRouter>
      <Blog />
    </MemoryRouter>
  );

  // Expect the main banner text to be present
  expect(screen.getByText("Blog & Articles")).toBeInTheDocument();
});

// Test if the filter section is rendered
test("renders filter section", () => {
  render(
    <MemoryRouter>
      <Blog />
    </MemoryRouter>
  );

  // Expect the filter section title to be present
  expect(screen.getByText("Filter by Tags")).toBeInTheDocument();
});

// Test if the "Latest Posts" section is rendered
test("renders latest posts section", () => {
  render(
    <MemoryRouter>
      <Blog />
    </MemoryRouter>
  );

  // Expect the Latest Posts heading to be present
  expect(screen.getByText("Latest Posts")).toBeInTheDocument();
});

// Test if clicking a filter checkbox selects and deselects it
test("allows selecting and deselecting filters", async () => {
  render(
    <MemoryRouter>
      <Blog />
    </MemoryRouter>
  );

  // Find the checkbox for the "Nutrition" tag
  const checkbox = screen.getByLabelText("Nutrition");

  // Click the checkbox to select it
  await userEvent.click(checkbox);
  expect(checkbox).toBeChecked();

  // Click again to deselect it
  await userEvent.click(checkbox);
  expect(checkbox).not.toBeChecked();
});
