import { A } from "./a.js";
import { B } from "./b.js";
import { VERSION, DATE } from "./version.js";

const SimpleTypeScriptLibrary = {
    name: "simple-typescript-library",
    num: 12,
    addAtoB() {
        return new A().getValue() + new B().getValue();
    },
    lengthOfString(str: string) {
        return str.length;
    },
    sum: (x: number, y: number) => x + y,
    version() {
        return "VERSION: " + VERSION;
    },
    date() {
        return "DATE: " + DATE;
    },
};

export { SimpleTypeScriptLibrary };
export default SimpleTypeScriptLibrary;
