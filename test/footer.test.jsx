import { test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "../src/components/footer";

// ✅ **TEST: Renders Footer component correctly**
test("renders Footer component", () => {
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );

  expect(screen.getByRole("contentinfo")).toBeInTheDocument();
});

// ✅ **TEST: Footer contains expected links**
test("footer contains expected links", () => {
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );

  expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute("href", "/about");
  expect(screen.getByRole("link", { name: /terms & conditions/i })).toHaveAttribute("href", "/terms-and-conditions");
  expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute("href", "/contact");
});

// ✅ **TEST: Footer contains social media icons with correct links**
test("footer contains social media icons with correct links", () => {
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );

  // Get all links and filter by href
  const socialLinks = screen.getAllByRole("link");

  expect(socialLinks.some((link) => link.getAttribute("href") === "https://facebook.com")).toBeTruthy();
  expect(socialLinks.some((link) => link.getAttribute("href") === "https://twitter.com")).toBeTruthy();
  expect(socialLinks.some((link) => link.getAttribute("href") === "https://instagram.com")).toBeTruthy();
});

// ✅ **TEST: Footer displays the correct copyright year**
test("footer displays correct copyright year", () => {
  const currentYear = new Date().getFullYear();
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );

  expect(screen.getByText(`© ${currentYear} Plate Tonic. All rights reserved.`)).toBeInTheDocument();
});
