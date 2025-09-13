import {
  Project,
  SyntaxKind,
  ClassDeclaration,
  CallExpression,
} from "ts-morph";
import * as fs from "fs";
import * as path from "path";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

project.addSourceFilesAtPaths("src/**/*.{ts,tsx,js,jsx}");

const issues: { file: string; issue: string; line: number }[] = [];

project.getSourceFiles().forEach((sourceFile) => {
  sourceFile.forEachDescendant((node) => {
    const filePath = sourceFile.getFilePath();

    // 1. Class components
    if (node.getKind() === SyntaxKind.ClassDeclaration) {
      const classNode = node as ClassDeclaration;
      const heritage = classNode.getHeritageClauses();
      if (
        heritage &&
        heritage.some((h) => h.getText().includes("React.Component"))
      ) {
        issues.push({
          file: filePath,
          issue:
            "Class component found — consider converting to functional component.",
          line: node.getStartLineNumber(),
        });
      }
    }

    // 2. Deprecated lifecycle methods
    if (node.getKind() === SyntaxKind.MethodDeclaration) {
      const methodName = (node as any).getName?.();
      const legacyMethods = [
        "componentWillMount",
        "componentWillReceiveProps",
        "componentWillUpdate",
        "UNSAFE_componentWillMount",
        "UNSAFE_componentWillReceiveProps",
        "UNSAFE_componentWillUpdate",
        "componentDidMount",
        "componentDidUpdate",
      ];
      if (legacyMethods.includes(methodName)) {
        issues.push({
          file: filePath,
          issue: `Deprecated lifecycle method: ${methodName}`,
          line: node.getStartLineNumber(),
        });
      }
    }

    // 3. Error boundaries (componentDidCatch, getDerivedStateFromError)
    if (node.getKind() === SyntaxKind.MethodDeclaration) {
      const methodName = (node as any).getName?.();
      if (
        ["componentDidCatch", "getDerivedStateFromError"].includes(methodName)
      ) {
        issues.push({
          file: filePath,
          issue: `Error boundary method used: ${methodName}. Consider using react-error-boundary.`,
          line: node.getStartLineNumber(),
        });
      }
    }

    // 4. ReactDOM.render()
    if (
      node.getKind() === SyntaxKind.CallExpression &&
      (node as CallExpression)
        .getExpression()
        .getText()
        .includes("ReactDOM.render")
    ) {
      issues.push({
        file: filePath,
        issue:
          "ReactDOM.render is deprecated in React 18 — use createRoot instead.",
        line: node.getStartLineNumber(),
      });
    }

    // 5. React.createClass()
    if (node.getText().includes("React.createClass")) {
      issues.push({
        file: filePath,
        issue: "React.createClass is deprecated.",
        line: node.getStartLineNumber(),
      });
    }

    // 6. this.state / this.setState usage
    if (
      node.getText().includes("this.state") ||
      node.getText().includes("this.setState")
    ) {
      issues.push({
        file: filePath,
        issue:
          "this.state or this.setState found — consider migrating to hooks.",
        line: node.getStartLineNumber(),
      });
    }

    // 7. Inline anonymous functions in JSX (can harm performance)
    if (
      node.getKind() === SyntaxKind.JsxExpression &&
      node.getText().includes("=>")
    ) {
      issues.push({
        file: filePath,
        issue:
          "Inline arrow function in JSX — consider extracting for performance.",
        line: node.getStartLineNumber(),
      });
    }

    // 8. defaultProps in function components
    if (node.getText().includes(".defaultProps")) {
      issues.push({
        file: filePath,
        issue:
          "defaultProps in function components are no longer supported — use default parameters.",
        line: node.getStartLineNumber(),
      });
    }

    // 9. Legacy Context API
    if (
      node.getText().includes("contextTypes") ||
      node.getText().includes("childContextTypes")
    ) {
      issues.push({
        file: filePath,
        issue: "Legacy context API found — use createContext and useContext.",
        line: node.getStartLineNumber(),
      });
    }

    // 10. findDOMNode usage
    if (node.getText().includes("ReactDOM.findDOMNode")) {
      issues.push({
        file: filePath,
        issue:
          "findDOMNode is discouraged in concurrent mode — use useRef instead.",
        line: node.getStartLineNumber(),
      });
    }

    // 11. forceUpdate usage
    if (node.getText().includes("this.forceUpdate")) {
      issues.push({
        file: filePath,
        issue: "forceUpdate is an anti-pattern — rework state logic.",
        line: node.getStartLineNumber(),
      });
    }

    // 12. dangerouslySetInnerHTML usage
    if (node.getText().includes("dangerouslySetInnerHTML")) {
      issues.push({
        file: filePath,
        issue: "dangerouslySetInnerHTML used — make sure input is sanitized.",
        line: node.getStartLineNumber(),
      });
    }

    // 13. Missing keys in JSX Lists
    if (node.getText().includes(".map") && !node.getText().includes("key=")) {
      issues.push({
        file: filePath,
        issue: "Possible missing key prop in list rendering.",
        line: node.getStartLineNumber(),
      });
    }

    // 14. shouldComponentUpdate
    if ((node as any).getName?.() === "shouldComponentUpdate") {
      issues.push({
        file: filePath,
        issue: "Use React.memo or useMemo instead of shouldComponentUpdate.",
        line: node.getStartLineNumber(),
      });
    }

    // 15. Global event listeners
    if (
      node.getText().includes("window.addEventListener") ||
      node.getText().includes("document.addEventListener")
    ) {
      issues.push({
        file: filePath,
        issue: "Global event listener — make sure to clean up in useEffect.",
        line: node.getStartLineNumber(),
      });
    }
  });
});

const outputPath = path.resolve("migration-todo.json");
fs.writeFileSync(outputPath, JSON.stringify(issues, null, 2));
console.log(`Migration manifest saved to ${outputPath}`);
