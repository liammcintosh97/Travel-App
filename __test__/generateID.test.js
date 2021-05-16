// Import the js file to test
import { generateID } from "../src/server/server.js"

// The describe() function takes two arguments - a string description, and a test suite as a callback function.  
// A test suite may contain one or more related tests    
describe("Testing the Server functionality", () => {
  test("Testing the generateID() function", () => {
    expect(generateID(5)).toBeDefined();
  })
});