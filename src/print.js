const {
  align, concat, dedent, group, hardline, indent, join, line, markAsRoot
} = require("prettier").doc.builders;

const nodes = {
  "@const": (path, print) => path.getValue().body,
  "@ident": (path, print) => path.getValue().body,
  "@ivar": (path, print) => path.getValue().body,
  "@tstring_content": (path, print) => concat(["'", path.getValue().body, "'"]),
  args_add_block: (path, print) => {
    const [_, block] = path.getValue().body;
    const parts = path.map(print, "body", 0);

    if (block) {
      parts.push(path.map(print, "body", 1));
    }

    return group(concat(parts));
  },
  assign: (path, print) => join(" = ", path.map(print, "body")),
  bodystmt: (path, print) => join(line, path.map(print, "body", 0)),
  class: (path, print) => {
    const parts = ["class ", path.call(print, "body", 0)];

    if (path.getValue().body[1]) {
      parts.push(" < ", path.call(print, "body", 1));
    }

    parts.push(indent(path.call(print, "body", 2)), hardline, "end", hardline);

    return group(concat(parts));
  },
  command: (path, print) => join(" ", path.map(print, "body")),
  const_ref: (path, print) => path.call(print, "body", 0),
  def: (path, print) => group(concat([
    concat(["def ", path.call(print, "body", 0)]),
    path.call(print, "body", 1),
    indent(concat([hardline, path.call(print, "body", 2)])),
    hardline,
    "end"
  ])),
  params: (path, print) => (
    join(", ", path.getValue().body.reduce((parts, paramType, index) => {
      if (paramType) {
        return parts.concat(path.map(print, "body", index));
      }
      return parts;
    }, []))
  ),
  paren: (path, print) => concat(['(', ...path.map(print, "body"), ')']),
  program: (path, print) => markAsRoot(join(hardline, path.map(print, "body", 0))),
  string_content: (path, print) => concat(path.map(print, "body")),
  string_literal: (path, print) => concat(path.map(print, "body")),
  symbol: (path, print) => concat([":", ...path.map(print, "body")]),
  symbol_literal: (path, print) => concat(path.map(print, "body")),
  var_field: (path, print) => concat(path.map(print, "body")),
  var_ref: (path, print) => path.call(print, "body", 0),
  void_stmt: (path, print) => ""
};

const debugNode = (path, print) => {
  console.log("=== UNSUPPORTED NODE ===");
  console.log(path.getValue());
  console.log("========================");
  return "";
};

const genericPrint = (path, options, print) => {
  const { type } = path.getValue();
  return (nodes[type] || debugNode)(path, print);
};

module.exports = genericPrint;