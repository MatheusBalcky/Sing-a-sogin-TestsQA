import { faker } from "@faker-js/faker";

describe("Should insert a new recommendation", () => {
  it("should signUp successfully", async () => {
    const fakeNameVideo = faker.random.alphaNumeric(8);
    const fakeYtbUrl =  `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(10)}`;

    cy.visit("http://localhost:3000/");

    cy.get('[data-cy="nameVideoInput"]').type(fakeNameVideo);
		
		cy.get('[data-cy="youtubeLink"]').type(fakeYtbUrl);

		cy.get('[data-cy="sendButton"]').click();

		cy.contains(fakeNameVideo);

  });
});
