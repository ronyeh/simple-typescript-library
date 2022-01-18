import { A } from "./a.js";
test("A's getValue() returns 1", () => {
    expect(new A().getValue()).toBe(1);
});
