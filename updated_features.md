# Future Features: Advanced Question Types

This document outlines a roadmap for new, more interactive, and conceptually deeper question types that can be added to the MathQuest application. The goal is to move beyond simple recall and encourage active learning, intuition-building, and a robust understanding of mathematical concepts.

---

### Category 1: Direct Input & Selection

These are the most straightforward types, but often with an interactive twist.

*   **Numeric Input**: The user calculates a value and types the number into a box.
    *   **Purpose**: Tests direct calculation and problem-solving.
    *   **Implementation**: This is already implemented.

*   **Visual Multiple Choice (Image Selection)**: Instead of text options, the user is presented with several diagrams, graphs, or images and must click on the correct one.
    *   **Purpose**: Tests visual and spatial reasoning. It's much harder to guess than text-based multiple choice.
    *   **Example**: "Which of the following graphs represents the function y = -x² + 3?" (Shows four different parabolas).
    *   **Technical Approach**: The `Question` type would need an `options` array where each option is an image URL or SVG data. `QuestionPanel` would render these as clickable images.

*   **Multiple Select (Checkboxes)**: The user must select all options that apply from a list.
    *   **Purpose**: Tests comprehensive knowledge of a concept's properties, forcing the user to evaluate each option independently.
    *   **Implementation**: This is already implemented.

### Category 2: Interactive & Manipulative

This is the core of the "active learning" philosophy. The user learns by doing and seeing the immediate consequences of their actions.

*   **Interactive Graph Sliders**: The user drags a slider that controls a variable (e.g., the slope `m` in y = mx + b) and sees the graph update in real-time.
    *   **Purpose**: To build deep, intuitive understanding of how parameters affect functions and systems.
    *   **Example**: A slider controls the value of `c` in a quadratic y = ax² + bx + c. The question asks: "What does the parameter `c` represent?" By moving the slider, the user discovers it's the y-intercept.
    *   **Technical Approach**: Requires adding a `parameters` field to the `Question` type. The `Graph` component would render sliders for these parameters. The function definition would need to accept these parameters. State management in the `Graph` component would update the plot in real-time as sliders are moved.

*   **Object Manipulation & Simulation**: The user can drag, drop, rotate, or connect objects within a virtual canvas to solve a puzzle.
    *   **Purpose**: To make abstract rules concrete and engaging. Excellent for geometry, logic, and physics-based math problems.
    *   **Example (Geometry)**: "Arrange the four shapes to form a perfect square."
    *   **Technical Approach**: This would require a dedicated component using either SVG or a Canvas library (like Konva.js) to handle the interactive objects. The `Question` data would define the initial state of the objects.

*   **Click-to-Highlight / Annotation**: The user interacts directly with a diagram by clicking on specific parts of it.
    *   **Purpose**: Tests the ability to identify specific components or features within a complex system.
    *   **Implementation**: This is already implemented with the `click-on-graph` question type.

### Category 3: Conceptual & Logical

These questions test the "why" behind the math, not just the "what."

*   **Counter-example Selection**: Instead of proving something true, the user is asked to find the one case that proves a statement false.
    *   **Purpose**: A powerful way to test the boundaries and conditions of a mathematical rule.
    *   **Example**: "The statement 'All prime numbers are odd' is false. Select the number below that serves as a counter-example." (Options include 2, 7, 11, 13).
    *   **Technical Approach**: This can be implemented as a standard `multiple-choice` question, where the question text frames the problem correctly.

*   **Build the Equation/Expression**: The user is given tiles representing numbers, variables, and operators, and they must drag them into a box to construct a valid expression or equation.
    *   **Purpose**: Reinforces syntax and the structure of mathematical statements.
    *   **Example**: "Using the tiles, construct the quadratic formula."
    *   **Technical Approach**: This would be a new question type (`'build-expression'`). The UI would feature a "palette" of draggable tokens and a "canvas" drop zone. State would track the sequence of dropped tokens. Validation would be complex, potentially requiring parsing the constructed expression.

### Category 4: Structural & Sequential

These questions are about process and order.

*   **Drag-and-Drop Ordering**: The user is given a series of steps (for a proof, an algorithm, or solving an equation) and must drag them into the correct logical sequence.
    *   **Purpose**: Teaches logical reasoning and the structure of a formal argument or procedure.
    *   **Example**: "Arrange the following lines in the correct order to complete the proof that the sum of angles in a triangle is 180°."
    *   **Technical Approach**: Implement a new answer type `'dnd-ordering'`. The `QuestionPanel` would render a list of draggable items. The HTML5 Drag and Drop API can be used to manage the reordering. The answer is submitted as a sorted array of strings for validation against `correctAnswer`.
