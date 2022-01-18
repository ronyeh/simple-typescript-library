import { SimpleTypeScriptLibrary } from "./index.js";
test("Length of 'hello' is 5", () => {
    expect(SimpleTypeScriptLibrary.lengthOfString("hello")).toBe(5);
});
