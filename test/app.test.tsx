import { expect, test } from "@jest/globals";
import { renderRouter, screen } from "expo-router/testing-library";

test("renders the app router", async () => {
  await renderRouter("./src/app");
  expect(await screen.findByText("Home")).toBeTruthy();
});
