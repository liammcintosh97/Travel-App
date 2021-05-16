// Import the js file to test
import { validateString } from "../src/client/js/utility.js"

// The describe() function takes two arguments - a string description, and a test suite as a callback function.  
// A test suite may contain one or more related tests    
describe("Testing the Utility functionality", () => {
  test("Testing the validateString() function", () => {
    expect(validateString("test")).toBeTruthy();
  })
});