// Press ctrl+space for code completion
export default function transformer(file, api) {
  const j = api.jscodeshift;
  const ast = j(file.source);

  ast
    .find(j.MemberExpression, {
      object: { type: "ThisExpression" },
      property: { type: "Identifier", name: "refs" }
    })
    .forEach(n => {
      n.value.type = "ThisExpression";
    });

  return ast
    .find(j.JSXAttribute, { name: { name: "ref" }, value: { type: "Literal" } })
    .filter(c => typeof c.value.value.value === "string")
    .replaceWith(node => {
      const refName = node.value.value.value;
      const refArgument = j.identifier("c");
      return j.jsxAttribute(
        j.jsxIdentifier("ref"),
        j.jsxExpressionContainer(
          j.arrowFunctionExpression(
            [refArgument],
            j.assignmentExpression(
              "=",
              j.memberExpression(
                j.thisExpression(),
                j.identifier(refName),
                false
              ),
              refArgument
            )
          )
        )
      );
    })
    .toSource();
}
