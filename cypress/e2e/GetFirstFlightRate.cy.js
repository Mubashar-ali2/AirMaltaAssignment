describe('Air Malta Flight Booking Tests', () => {
  it('Get the first available flight Price', () => {
    cy.visit('https://airmalta.com/en-gb');
    //Applying assertion on page title and Flight form
    cy.title().should('eq', 'Air Malta | The Airline of the Maltese Islands : Air Malta');

    cy.get('.flight-search-form').should('be.visible')
    cy.contains('Search airport').eq(0).click();
    cy.contains('Vienna International').click();
    cy.contains('Search airport').eq(0).click();
    cy.contains('Malta International Airport').click();
    cy.get('input[title="Round trip"]').click();
    cy.contains('One way').click();
    cy.get('.DayPickerInput').click();
    //Getting the today date as flight date
    const currentDate = new Date();
    const day = currentDate.getDate();
    cy.get('[role=gridcell]').contains(day).eq(0).click();
    
    //Waiting for page to load completely
    cy.intercept('https://book.airmalta.com/api/flightSearch/itineraryPart').as('getpage')
    cy.get('button[type="submit"]').contains('Find flights').click();
    cy.wait(4000)
    cy.wait('@getpage')

    //Opening Flexible date Calendaer page
    cy.get('a[href="/calendar/oneway"]').click();

    //Waiting for page to load completely
    cy.intercept('https://book.airmalta.com/api/flightSearch/calendar/itineraryPart').as('getCalenderpage')
    cy.wait(4000)
    cy.wait('@getCalenderpage')

    cy.url().should('include', 'https://book.airmalta.com/calendar/oneway');

    //Retreving and logging the first available flight price
    cy.get('.sc-jVOTke.cmVAqE').eq(0).invoke('text').then((flightPrice)=>{
      cy.log(flightPrice)
    })
  })
})