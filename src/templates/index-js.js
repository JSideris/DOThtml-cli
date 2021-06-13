export default function(){ 

return `const dot = require("dothtml");

dot("body")
.h1("Hello, World!")
.p(
    dot.t("Congratulations on setting up DOThtml development server. For detailed documentation, visit ")
        .a("https://dothtml.org/").href("https://dothtml.org/")
        .t(".")
);`;
}