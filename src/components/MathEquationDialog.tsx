import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { MathfieldElement, ensureMathLiveLoaded } from "../types/mathlive";
import "../styles/mathEquationDialog.css";

// Ensure MathLive is loaded (especially important for Next.js)
ensureMathLiveLoaded();

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement>,
        MathfieldElement
      > & {
        ref?: React.Ref<MathfieldElement>;
        value?: string;
        onInput?: (event: any) => void;
        "virtual-keyboard-mode"?: string;
        "math-mode"?: string;
        "smart-mode"?: string;
        "smart-fence"?: string;
        "smart-superscript"?: string;
        "smart-subscript"?: string;
        "smart-operator"?: string;
        "smart-fraction"?: string;
        "smart-sqrt"?: string;
        "smart-bracket"?: string;
        "smart-paren"?: string;
        "smart-quote"?: string;
        "smart-space"?: string;
        "smart-command"?: string;
        "menu-items"?: string;
        "menu-toggle"?: string;
        "menu-toggle-visible"?: string;
        [key: string]: any;
      };
    }
  }
}

// The MathfieldElement is automatically registered when importing 'mathlive'
// No need to manually register it

interface MathEquationDialogProps {
  onClose: () => void;
  onInsert: (latex: string) => void;
  initialValue?: string;
}

interface SymbolItem {
  symbol: string;
  title: string;
  display: string;
}

type TabSections = {
  [K in
    | "basic"
    | "fractions"
    | "powers"
    | "trig"
    | "logs"
    | "greek"
    | "calculus"
    | "symbols"
    | "geometry"
    | "brackets"]: SymbolItem[];
};

const MathEquationDialog = forwardRef<HTMLDivElement, MathEquationDialogProps>(
  ({ onClose, onInsert, initialValue = "" }, _ref) => {
    const [latex, setLatex] = useState(initialValue);
    const [activeTab, setActiveTab] = useState<keyof TabSections>("basic");
    const [isInserting, setIsInserting] = useState(false);
    const mathFieldRef = useRef<MathfieldElement | null>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const handleInput = useCallback((e: any) => {
      setLatex(e.target.value);
    }, []);

    const handleSave = useCallback(() => {
      setIsInserting(true);
      try {
        onInsert(latex);
        onClose();
      } finally {
        setIsInserting(false);
      }
    }, [latex, onInsert, onClose]);

    const insertSymbol = useCallback((symbol: string) => {
      if (mathFieldRef.current) {
        mathFieldRef.current.insert(symbol);
        mathFieldRef.current.focus();
      }
    }, []);

    useEffect(() => {
      if (mathFieldRef.current) {
        mathFieldRef.current.value = latex;
        mathFieldRef.current.focus();
      }

      // Add keyboard event listener for Escape and Enter keys
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        } else if (
          e.key === "Enter" &&
          !e.shiftKey &&
          !e.ctrlKey &&
          !e.metaKey
        ) {
          e.preventDefault();
          handleSave();
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [latex, onClose, handleSave]);
    const toolbarSections: TabSections = useMemo(
      () => ({
        basic: [
          { symbol: "+", title: "Plus", display: "+" },
          { symbol: "-", title: "Minus", display: "−" },
          { symbol: "\\times", title: "Multiply", display: "×" },
          { symbol: "\\div", title: "Divide", display: "÷" },
          { symbol: "\\pm", title: "Plus Minus", display: "±" },
          { symbol: "\\mp", title: "Minus Plus", display: "∓" },
          { symbol: "=", title: "Equals", display: "=" },
          { symbol: "\\neq", title: "Not Equal", display: "≠" },
          { symbol: "\\approx", title: "Approximately", display: "≈" },
          { symbol: "\\equiv", title: "Equivalent", display: "≡" },
          { symbol: "<", title: "Less Than", display: "<" },
          { symbol: ">", title: "Greater Than", display: ">" },
          { symbol: "\\leq", title: "Less or Equal", display: "≤" },
          { symbol: "\\geq", title: "Greater or Equal", display: "≥" },
          { symbol: "\\ll", title: "Much Less", display: "≪" },
          { symbol: "\\gg", title: "Much Greater", display: "≫" },
        ],
        fractions: [
          { symbol: "\\frac{}{}", title: "Fraction", display: "a/b" },
          { symbol: "\\frac{1}{2}", title: "One Half", display: "½" },
          { symbol: "\\frac{1}{3}", title: "One Third", display: "⅓" },
          { symbol: "\\frac{1}{4}", title: "One Quarter", display: "¼" },
          { symbol: "\\frac{3}{4}", title: "Three Quarters", display: "¾" },
          { symbol: "\\frac{2}{3}", title: "Two Thirds", display: "⅔" },
          { symbol: "\\frac{d}{dx}", title: "Derivative", display: "d/dx" },
          {
            symbol: "\\frac{\\partial}{\\partial x}",
            title: "Partial Derivative",
            display: "∂/∂x",
          },
        ],
        powers: [
          { symbol: "#@^2", title: "Square", display: "x²" },
          { symbol: "#@^3", title: "Cube", display: "x³" },
          { symbol: "#@^{}", title: "Power", display: "xⁿ" },
          { symbol: "#@_{}", title: "Subscript", display: "x₁" },
          { symbol: "#@_{}^{}", title: "Sub-Superscript", display: "xₙᵐ" },
          { symbol: "\\sqrt{}", title: "Square Root", display: "√" },
          { symbol: "\\sqrt[3]{}", title: "Cube Root", display: "∛" },
          { symbol: "\\sqrt[n]{}", title: "Nth Root", display: "ⁿ√" },
          { symbol: "e^{}", title: "Exponential", display: "eˣ" },
          { symbol: "10^{}", title: "Power of 10", display: "10ˣ" },
          { symbol: "#@^{-1}", title: "Reciprocal", display: "x⁻¹" },
        ],
        trig: [
          { symbol: "\\sin", title: "Sine", display: "sin" },
          { symbol: "\\cos", title: "Cosine", display: "cos" },
          { symbol: "\\tan", title: "Tangent", display: "tan" },
          { symbol: "\\cot", title: "Cotangent", display: "cot" },
          { symbol: "\\sec", title: "Secant", display: "sec" },
          { symbol: "\\csc", title: "Cosecant", display: "csc" },
          { symbol: "\\arcsin", title: "Arcsine", display: "sin⁻¹" },
          { symbol: "\\arccos", title: "Arccosine", display: "cos⁻¹" },
          { symbol: "\\arctan", title: "Arctangent", display: "tan⁻¹" },
          { symbol: "\\sinh", title: "Hyperbolic Sine", display: "sinh" },
          { symbol: "\\cosh", title: "Hyperbolic Cosine", display: "cosh" },
          { symbol: "\\tanh", title: "Hyperbolic Tangent", display: "tanh" },
        ],
        logs: [
          { symbol: "\\log", title: "Logarithm", display: "log" },
          { symbol: "\\log_{}", title: "Log Base", display: "log₍ₓ₎" },
          { symbol: "\\log_{10}", title: "Log Base 10", display: "log₁₀" },
          { symbol: "\\log_2", title: "Log Base 2", display: "log₂" },
          { symbol: "\\ln", title: "Natural Log", display: "ln" },
          { symbol: "\\lg", title: "Common Log", display: "lg" },
          { symbol: "e", title: "Euler's Number", display: "e" },
          { symbol: "\\exp", title: "Exponential Function", display: "exp" },
        ],
        greek: [
          { symbol: "\\alpha", title: "Alpha", display: "α" },
          { symbol: "\\beta", title: "Beta", display: "β" },
          { symbol: "\\gamma", title: "Gamma", display: "γ" },
          { symbol: "\\delta", title: "Delta", display: "δ" },
          { symbol: "\\epsilon", title: "Epsilon", display: "ε" },
          { symbol: "\\zeta", title: "Zeta", display: "ζ" },
          { symbol: "\\eta", title: "Eta", display: "η" },
          { symbol: "\\theta", title: "Theta", display: "θ" },
          { symbol: "\\lambda", title: "Lambda", display: "λ" },
          { symbol: "\\mu", title: "Mu", display: "μ" },
          { symbol: "\\nu", title: "Nu", display: "ν" },
          { symbol: "\\pi", title: "Pi", display: "π" },
          { symbol: "\\rho", title: "Rho", display: "ρ" },
          { symbol: "\\sigma", title: "Sigma", display: "σ" },
          { symbol: "\\tau", title: "Tau", display: "τ" },
          { symbol: "\\phi", title: "Phi", display: "φ" },
          { symbol: "\\chi", title: "Chi", display: "χ" },
          { symbol: "\\psi", title: "Psi", display: "ψ" },
          { symbol: "\\omega", title: "Omega", display: "ω" },
          { symbol: "\\Gamma", title: "Capital Gamma", display: "Γ" },
          { symbol: "\\Delta", title: "Capital Delta", display: "Δ" },
          { symbol: "\\Theta", title: "Capital Theta", display: "Θ" },
          { symbol: "\\Lambda", title: "Capital Lambda", display: "Λ" },
          { symbol: "\\Pi", title: "Capital Pi", display: "Π" },
          { symbol: "\\Sigma", title: "Capital Sigma", display: "Σ" },
          { symbol: "\\Phi", title: "Capital Phi", display: "Φ" },
          { symbol: "\\Psi", title: "Capital Psi", display: "Ψ" },
          { symbol: "\\Omega", title: "Capital Omega", display: "Ω" },
        ],
        calculus: [
          { symbol: "\\sum", title: "Sum", display: "∑" },
          {
            symbol: "\\sum_{i=1}^{n}",
            title: "Sum with Limits",
            display: "∑ᵢ₌₁ⁿ",
          },
          { symbol: "\\prod", title: "Product", display: "∏" },
          {
            symbol: "\\prod_{i=1}^{n}",
            title: "Product with Limits",
            display: "∏ᵢ₌₁ⁿ",
          },
          { symbol: "\\int", title: "Integral", display: "∫" },
          {
            symbol: "\\int_{a}^{b}",
            title: "Definite Integral",
            display: "∫ₐᵇ",
          },
          { symbol: "\\iint", title: "Double Integral", display: "∬" },
          { symbol: "\\iiint", title: "Triple Integral", display: "∭" },
          { symbol: "\\oint", title: "Contour Integral", display: "∮" },
          { symbol: "\\lim", title: "Limit", display: "lim" },
          {
            symbol: "\\lim_{x \\to \\infty}",
            title: "Limit to Infinity",
            display: "lim_{x→∞}",
          },
          {
            symbol: "\\lim_{x \\to 0}",
            title: "Limit to Zero",
            display: "lim_{x→0}",
          },
          { symbol: "\\nabla", title: "Nabla/Gradient", display: "∇" },
          { symbol: "\\partial", title: "Partial", display: "∂" },
        ],
        symbols: [
          { symbol: "\\infty", title: "Infinity", display: "∞" },
          { symbol: "\\emptyset", title: "Empty Set", display: "∅" },
          { symbol: "\\in", title: "Element Of", display: "∈" },
          { symbol: "\\notin", title: "Not Element Of", display: "∉" },
          { symbol: "\\subset", title: "Subset", display: "⊂" },
          { symbol: "\\supset", title: "Superset", display: "⊃" },
          { symbol: "\\subseteq", title: "Subset or Equal", display: "⊆" },
          { symbol: "\\supseteq", title: "Superset or Equal", display: "⊇" },
          { symbol: "\\cup", title: "Union", display: "∪" },
          { symbol: "\\cap", title: "Intersection", display: "∩" },
          { symbol: "\\forall", title: "For All", display: "∀" },
          { symbol: "\\exists", title: "Exists", display: "∃" },
          { symbol: "\\nexists", title: "Does Not Exist", display: "∄" },
          { symbol: "\\therefore", title: "Therefore", display: "∴" },
          { symbol: "\\because", title: "Because", display: "∵" },
          { symbol: "\\propto", title: "Proportional", display: "∝" },
          { symbol: "\\cdot", title: "Center Dot", display: "·" },
          { symbol: "\\bullet", title: "Bullet", display: "•" },
        ],
        geometry: [
          { symbol: "#@^\\circ", title: "Degree Symbol", display: "°" },
          { symbol: "100^\\circ", title: "100 Degrees", display: "100°" },
          { symbol: "90^\\circ", title: "90 Degrees", display: "90°" },
          { symbol: "180^\\circ", title: "180 Degrees", display: "180°" },
          { symbol: "360^\\circ", title: "360 Degrees", display: "360°" },
          { symbol: "\\angle", title: "Angle", display: "∠" },
          { symbol: "\\angle ABC", title: "Angle ABC", display: "∠ABC" },
          { symbol: "\\measuredangle", title: "Measured Angle", display: "∡" },
          {
            symbol: "\\sphericalangle",
            title: "Spherical Angle",
            display: "∢",
          },
          { symbol: "\\triangle", title: "Triangle", display: "△" },
          { symbol: "\\triangle ABC", title: "Triangle ABC", display: "△ABC" },
          { symbol: "\\square", title: "Square", display: "□" },
          { symbol: "\\blacksquare", title: "Black Square", display: "■" },
          { symbol: "\\diamond", title: "Diamond", display: "◊" },
          { symbol: "\\blacklozenge", title: "Black Diamond", display: "⧫" },
          { symbol: "\\bigcirc", title: "Circle", display: "○" },
          { symbol: "\\circ", title: "Small Circle", display: "∘" },
          { symbol: "\\odot", title: "Circle Dot", display: "⊙" },
          { symbol: "\\parallel", title: "Parallel", display: "∥" },
          { symbol: "\\nparallel", title: "Not Parallel", display: "∦" },
          { symbol: "\\perp", title: "Perpendicular", display: "⊥" },
          { symbol: "\\cong", title: "Congruent", display: "≅" },
          { symbol: "\\ncong", title: "Not Congruent", display: "≇" },
          { symbol: "\\sim", title: "Similar", display: "∼" },
          { symbol: "\\nsim", title: "Not Similar", display: "≁" },
          { symbol: "\\simeq", title: "Similar or Equal", display: "≃" },
          { symbol: "\\overline{AB}", title: "Line Segment", display: "AB̄" },
          { symbol: "\\overrightarrow{AB}", title: "Ray", display: "AB⃗" },
          { symbol: "\\overleftrightarrow{AB}", title: "Line", display: "AB↔" },
        ],
        brackets: [
          { symbol: "()", title: "Parentheses", display: "( )" },
          { symbol: "[]", title: "Square Brackets", display: "[ ]" },
          { symbol: "\\{\\}", title: "Curly Braces", display: "{ }" },
          {
            symbol: "\\langle\\rangle",
            title: "Angle Brackets",
            display: "⟨ ⟩",
          },
          {
            symbol: "\\left(\\right)",
            title: "Auto-sized Parentheses",
            display: "( )",
          },
          {
            symbol: "\\left[\\right]",
            title: "Auto-sized Brackets",
            display: "[ ]",
          },
          {
            symbol: "\\left\\{\\right\\}",
            title: "Auto-sized Braces",
            display: "{ }",
          },
          {
            symbol: "\\left|\\right|",
            title: "Absolute Value",
            display: "| |",
          },
          { symbol: "\\left\\|\\right\\|", title: "Norm", display: "‖ ‖" },
          {
            symbol: "\\left\\langle\\right\\rangle",
            title: "Auto-sized Angle",
            display: "⟨ ⟩",
          },
          {
            symbol: "\\left\\lceil\\right\\rceil",
            title: "Ceiling",
            display: "⌈ ⌉",
          },
          {
            symbol: "\\left\\lfloor\\right\\rfloor",
            title: "Floor",
            display: "⌊ ⌋",
          },
        ],
      }),
      [],
    );

    const renderToolbar = useCallback(
      (symbols: SymbolItem[]) => (
        <div className="math-toolbar-grid">
          {symbols.map((item: SymbolItem, index: number) => (
            <button
              key={index}
              onClick={() => insertSymbol(item.symbol)}
              title={item.title}
              className="math-symbol-button"
              type="button"
            >
              {item.display}
            </button>
          ))}
        </div>
      ),
      [insertSymbol],
    );

    return (
      <div
        className="math-dialog-overlay"
        onClick={(e) => {
          e.stopPropagation();
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="math-dialog-title"
      >
        <div
          className="math-dialog"
          ref={dialogRef}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="math-dialog-header">
            <h3 id="math-dialog-title">Insert Math Equation</h3>
            <button
              className="close-button"
              onClick={onClose}
              type="button"
              aria-label="Close dialog"
            >
              ×
            </button>
          </div>

          <div className="math-toolbar-tabs">
            {(Object.keys(toolbarSections) as Array<keyof TabSections>).map(
              (tab) => (
                <button
                  key={tab}
                  className={`tab-button ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                  type="button"
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ),
            )}
          </div>

          <div className="math-toolbar-container">
            {renderToolbar(toolbarSections[activeTab])}
          </div>

          <div className="math-examples">
            <h4>General Math</h4>
            <div className="equation-buttons">
              <button
                onClick={() =>
                  insertSymbol("x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}")
                }
                type="button"
              >
                Quadratic Formula
              </button>
              <button
                onClick={() => insertSymbol("a^2 + b^2 = c^2")}
                type="button"
              >
                Pythagorean Theorem
              </button>
              <button
                onClick={() => insertSymbol("A = \\pi r^2")}
                type="button"
              >
                Area of Circle
              </button>
              <button
                onClick={() => insertSymbol("C = 2 \\pi r")}
                type="button"
              >
                Circumference
              </button>
            </div>
          </div>

          <div className="math-examples">
            <h4>Higher Math</h4>
            <div className="equation-buttons">
              <button
                onClick={() => insertSymbol("\\frac{dy}{dx}")}
                type="button"
              >
                Derivative
              </button>
              <button
                onClick={() => insertSymbol("e^{i\\pi} + 1 = 0")}
                type="button"
              >
                Euler's Identity
              </button>
              <button
                onClick={() =>
                  insertSymbol(
                    "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
                  )
                }
                type="button"
              >
                Limit Definition of Derivative
              </button>
              <button
                onClick={() =>
                  insertSymbol(
                    "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}",
                  )
                }
                type="button"
              >
                Gaussian Integral
              </button>
            </div>
          </div>

          <div className="math-examples">
            <h4>Physics</h4>
            <div className="equation-buttons">
              <button onClick={() => insertSymbol("F = ma")} type="button">
                Newton's 2nd Law
              </button>
              <button onClick={() => insertSymbol("E = mc^2")} type="button">
                E=mc²
              </button>
              <button
                onClick={() => insertSymbol("KE = \\frac{1}{2} mv^2")}
                type="button"
              >
                Kinetic Energy
              </button>
              <button onClick={() => insertSymbol("V = IR")} type="button">
                Ohm's Law
              </button>
              <button
                onClick={() =>
                  insertSymbol("\\Delta x \\Delta p \\geq \\frac{\\hbar}{2}")
                }
                type="button"
              >
                Uncertainty Principle
              </button>
              <button
                onClick={() =>
                  insertSymbol(
                    "\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\epsilon_0}",
                  )
                }
                type="button"
              >
                Gauss's Law
              </button>
            </div>
          </div>

          <div className="math-examples">
            <h4>Chemistry</h4>
            <div className="equation-buttons">
              <button onClick={() => insertSymbol("H_2O")} type="button">
                Water Formula
              </button>
              <button
                onClick={() => insertSymbol("n = \\frac{m}{M}")}
                type="button"
              >
                Molar Mass
              </button>
              <button onClick={() => insertSymbol("PV = nRT")} type="button">
                Ideal Gas Law
              </button>
              <button
                onClick={() => insertSymbol("2H_2 + O_2 \\to 2H_2O")}
                type="button"
              >
                Chemical Reaction
              </button>
              <button
                onClick={() => insertSymbol("K_a = \\frac{[H^+][A^-]}{[HA]}")}
                type="button"
              >
                Acid Constant
              </button>
            </div>
          </div>

          <div className="math-examples">
            <h4>Geometry</h4>
            <div className="equation-buttons">
              <button
                onClick={() => insertSymbol("\\angle ABC = 90^\\circ")}
                type="button"
              >
                Right Angle
              </button>
              <button
                onClick={() => insertSymbol("\\angle ABC = 180^\\circ")}
                type="button"
              >
                Straight Angle
              </button>
              <button
                onClick={() => insertSymbol("A = \\frac{1}{2}bh")}
                type="button"
              >
                Triangle Area
              </button>
              <button onClick={() => insertSymbol("A = s^2")} type="button">
                Square Area
              </button>
              <button onClick={() => insertSymbol("A = lw")} type="button">
                Rectangle Area
              </button>
              <button
                onClick={() => insertSymbol("V = \\frac{4}{3}\\pi r^3")}
                type="button"
              >
                Sphere Volume
              </button>
              <button
                onClick={() =>
                  insertSymbol("\\triangle ABC \\cong \\triangle DEF")
                }
                type="button"
              >
                Congruent Triangles
              </button>
              <button
                onClick={() => insertSymbol("AB \\parallel CD")}
                type="button"
              >
                Parallel Lines
              </button>
              <button
                onClick={() => insertSymbol("AB \\perp CD")}
                type="button"
              >
                Perpendicular Lines
              </button>
            </div>
          </div>

          <div className="math-editor">
            {React.createElement("math-field", {
              ref: mathFieldRef,
              value: latex,
              onInput: handleInput,
              "virtual-keyboard-mode": "manual",
              className: "math-dialog-math-field",
              "math-mode": "latex",
              "smart-mode": "on",
              "smart-fence": "on",
              "smart-superscript": "on",
              "smart-subscript": "on",
              "smart-operator": "on",
              "smart-fraction": "on",
              "smart-sqrt": "on",
              "smart-bracket": "on",
              "smart-paren": "on",
              "smart-quote": "on",
              "smart-space": "on",
              "smart-command": "on",
            })}
          </div>

          <div className="math-dialog-footer">
            <button className="cancel-button" onClick={onClose} type="button">
              Cancel
            </button>
            <button
              className="save-button"
              onClick={handleSave}
              type="button"
              disabled={isInserting || !latex.trim()}
              aria-busy={isInserting}
            >
              {isInserting ? "Inserting..." : "Insert Equation"}
            </button>
          </div>
        </div>
      </div>
    );
  },
);

MathEquationDialog.displayName = "MathEquationDialog";

export default MathEquationDialog;
