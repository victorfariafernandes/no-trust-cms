describe("Pad flow — three tabs", () => {
  const slug = `e2e-${Date.now()}`;
  const content = "Hello from Cypress";
  const edited = "Edited by Cypress";

  it("Tab 1 — creates a pad", () => {
    cy.visit("/");
    cy.get('input[placeholder="page-name"]').type(slug);
    cy.contains("button", "Go").click();
    cy.url().should("include", `/${slug}`);
    cy.get("textarea").type(content);
    cy.contains("saved", { timeout: 4000 }).should("be.visible");
  });

  it("Tab 2 — reads the pad in a new tab", () => {
    cy.visit(`/${slug}`);
    cy.get("textarea", { timeout: 4000 }).should("have.value", content);
  });

  it("Tab 3 — edits the pad in a new tab", () => {
    cy.visit(`/${slug}`);
    cy.get("textarea", { timeout: 4000 }).should("have.value", content);
    cy.get("textarea").clear().type(edited);
    cy.contains("saved", { timeout: 4000 }).should("be.visible");
    cy.visit(`/${slug}`);
    cy.get("textarea", { timeout: 4000 }).should("have.value", edited);
  });
});
