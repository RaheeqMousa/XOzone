# Tic Tac Toe Game

## Project Overview
This project is a fully interactive **Tic Tac Toe game** built using **HTML, CSS, and JavaScript**. The game supports both **single-player** (against computer) and **multiplayer** (two human players) modes. The AI uses the **Minimax algorithm with Alpha-Beta pruning** for optimal performance. Players can also choose the **size of the game board** (3x3, 4x4, 5x5, etc.).  

Additionally, the game includes **Light/Dark mode** and a **background music button** for a more engaging experience. The game logic is organized using **Object-Oriented Programming (OOP)** with **classes** for modularity and reusability.

**Note:** This project must be opened from a **Live Server** (e.g., VS Code Live Server) because the JavaScript files are **ES6 modules**.

# Project Demo
[Watch Full Video Demo](https://drive.google.com/file/d/1qgJsJ3I44tq7zK1ySFkI2E--7m8Gdh_C/view?usp=drive_link)

# Live Demo
[View XOzone App](https://raheeqmousa.github.io/XOzone/)

## Features

### Game Modes
1. **Single Player vs Computer**
   - AI uses **Minimax algorithm with Alpha-Beta pruning**.
   - Three difficulty levels:
     - **Easy**: Random moves.
     - **Medium**: Limited-depth Minimax (`depth = n*n / 3`) for faster computation on larger boards.
     - **Hard**: Full Minimax with Alpha-Beta pruning (optimal moves).
2. **Multiplayer**
   - Two players can take turns on the same device.

### Board Sizes
- Supports **custom board sizes**: 3x3, 4x4, 5x5, etc.
- AI adapts to the chosen board size.

### User Interface
- Clean, responsive design using **CSS**.
- Highlights winning combinations.
- Interactive hover effects.
- **Light/Dark mode toggle**.
- **Background music button** to play/pause music.
- Easy-to-use game controls for selecting mode, difficulty, and board size.


## Minimax Algorithm with Alpha-Beta Pruning Explanation

The **Minimax algorithm** is a recursive decision-making algorithm used in AI for zero-sum games like Tic Tac Toe. **Alpha-Beta pruning** optimizes Minimax by skipping branches that cannot affect the final decision, reducing computation time.

**How it works:**
1. **Maximizer (AI)** tries to **maximize the score**.
2. **Minimizer (Human)** tries to **minimize the score**.
3. **Recursion**:
   - For each empty cell:
     - Simulate a move.
     - Call Minimax with Alpha-Beta pruning on the new board state.
     - Evaluate the score.
4. **Alpha-Beta pruning**:
   - `Alpha` = Best already explored score for Maximizer.
   - `Beta` = Best already explored score for Minimizer.
   - Skip evaluating branches if `Beta <= Alpha`.
5. **Difficulty levels**:
   - Easy → random moves.
   - Medium → **limited-depth Minimax**, depth = `n*n / 3`, for faster computation.
   - Hard → full Minimax with Alpha-Beta pruning (optimal moves).

*Note*: Limited-depth for Medium level is important for larger boards to prevent the AI from taking too long to make a move. Full-depth Minimax is used in Hard level for maximum challenge.
