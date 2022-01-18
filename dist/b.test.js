import { B } from "./b.js";
test("B's getValue() returns 2", () => {
    expect(new B().getValue()).toBe(2);
});
test("B's doSomething() returns undefined", () => {
    expect(new B().doSomething()).toBe(undefined);
});
