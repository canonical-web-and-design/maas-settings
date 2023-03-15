import { generateMAASURL } from "../../../utils";

context("Settings - Security - Session timeout", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/settings/security/session-timeout"));
  });

  it("logs the user out when the session timeout expiration is changed", () => {
    cy.findByRole("textbox", { name: "Session timeout expiration" }).clear();
    cy.findByRole("textbox", { name: "Session timeout expiration" }).type(
      "13 days"
    );
    cy.findByRole("button", { name: "Save" }).click();

    cy.findByRole("textbox", { name: "Username" }).should("exist");
    cy.findByRole("textbox", { name: "Password" }).should("exist");
    cy.findByRole("button", { name: "Login" }).should("exist");
  });
});
