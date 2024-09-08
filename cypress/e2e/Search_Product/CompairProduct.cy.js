describe('Price Comparison Between Amazon and Flipkart', () => {
    
    it('should get the price from Amazon', () => {
      const product = 'titan watches for men';
  
      cy.visit('https://www.amazon.in');
      cy.get('#twotabsearchtextbox').type(product);
      cy.wait(2000);
      cy.get('.s-suggestion-container').contains(product).click();
  
      // Extract the price of the product on Amazon
      cy.get('.s-main-slot .s-result-item').first().find('.a-price-whole').invoke('text').then((amazonPriceText) => {
        const amazonPrice = parseFloat(amazonPriceText.replace(/₹|,/g, ''));
        cy.wrap(amazonPrice).as('amazonPrice');
      });
    });
  
    
    it('should get the price from Flipkart', () => {
      const product = 'titan watches for men';
  
      cy.visit('https://www.flipkart.com');
  
      cy.get("input[placeholder='Search for Products, Brands and More']", { timeout: 10000 }).should('be.visible');

      cy.get("input[placeholder='Search for Products, Brands and More']").type(product + ' {enter}');
      cy.wait(2000);
  
      // Extract the price of the product on Flipkart
      cy.get('a[title="Karishma Analog Watch  - For Men NN1639SM02"]').invoke('removeAttr', 'target').click();
      cy.get('.Nx9bqj.CxhGGd').first().invoke('text').then((flipkartPriceText) => {
        const flipkartPrice = parseFloat(flipkartPriceText.replace(/₹|,/g, ''));
        cy.wrap(flipkartPrice).as('flipkartPrice');
      });
    });
  
    // Compare the prices and proceed with the cheaper option
    it('should compare the prices and proceed with the cheaper option', () => {
        const amazonPrice = Cypress.env('amazonPrice');
        const flipkartPrice = Cypress.env('flipkartPrice');
    
        cy.then(() => {
          if (amazonPrice < flipkartPrice) {
      
            cy.visit('https://www.amazon.in');
            cy.get('#twotabsearchtextbox').type('titan watches for men');
            cy.get('#nav-search-submit-button').click();
            cy.get('.s-main-slot .s-result-item').first().click(); 
            
          } else {
            
            cy.visit('https://www.flipkart.com');
            
            cy.get("input[placeholder='Search for Products, Brands and More']").type('titan watches for men {enter}');
            cy.get('a[title="Karishma Analog Watch  - For Men NN1639SM02"]').invoke('removeAttr', 'target').click();
            cy.get('form > .QqFHMw').click()
            
          }
        });
      });
  });
  