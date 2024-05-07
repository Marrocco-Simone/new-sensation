import { Block, Rule } from "@/types";

function convertBlockToString(b: Block | undefined): string {
  if (!b) return "";

  let s = "";
  for (const t of b.text)
    switch (t.type) {
      case "TEXT":
        if (t.label.type !== "TEXT") throw new Error();
        s += " " + t.label.value + " ";
        break;
      case "PARAM_INTEGER":
        if (t.label.type !== "PARAM_INTEGER") throw new Error();
        s += t.value;
        break;
      case "PARAM_STRING":
        if (t.label.type !== "PARAM_STRING") throw new Error();
        s += t.value;
        break;
      case "PARAM_OPEN_STRING":
        if (t.label.type !== "PARAM_OPEN_STRING") throw new Error();
        s += t.value;
        break;
      case "PARAM_CLASS":
        if (t.label.type !== "PARAM_CLASS") throw new Error();
        s += convertBlockToString(t.choice);
        break;
    }
  return s.trim();
}

export function convertRuleToString(rule: Rule): string {
  let s = "APPENA ";
  s += convertBlockToString(rule.when);

  if (rule.while) {
    s += " MENTRE ";
    s += convertBlockToString(rule.while);
  }

  s += " ALLORA ";
  s += rule.do.map((b) => convertBlockToString(b)).join(" E ");

  return s;
}
