describe("sayfa ac", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/");
    });
  
    it("bul user", () => {
      cy.get("#user").should("have.value", "");
    });
  
    it("bul mail", () => {
      cy.get("#email").should("have.value", "");
    });
  
    it("bul sifre", () => {
      cy.get("#password").should("have.value", "");
    });
 
  }
);
  
 