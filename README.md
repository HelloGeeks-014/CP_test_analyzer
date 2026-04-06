# 🧪 CP Test Analyzer

A competitive programming stress tester that automatically generates random test cases, runs them against both a **correct (brute-force)** solution and a **target (optimized/buggy)** solution, and pinpoints exactly where they diverge — powered by Google Gemini AI.

---

## ✨ Features

- 🎲 **Random Test Case Generation** — auto-generates inputs based on problem constraints
- ⚖️ **Side-by-side Comparison** — runs both solutions and diffs their outputs
- 🔍 **Failure Detection** — highlights the exact test case where the bad solution fails
- 🤖 **AI-Powered** — uses Google Gemini to assist in analysis and case generation
- 🖥️ **Clean UI** — resizable panels, smooth animations, and a modern interface

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 + TypeScript | Frontend framework |
| Vite | Build tool & dev server |
| Tailwind CSS v4 | Styling |
| Google Gemini AI (`@google/genai`) | AI-powered test generation & analysis |
| Lucide React | Icons |
| Motion | Animations |
| react-resizable-panels | Resizable editor panels |
| Express | Backend server |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Gemini API key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/cp-test-analyzer.git
cd cp-test-analyzer

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

> Get your API key from [Google AI Studio](https://aistudio.google.com/)

### Running the App

```bash
# Start the development server
npm run dev
```

Open your browser at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📖 How to Use

1. **Paste your correct solution** (brute-force) in the left panel
2. **Paste your target solution** (the one you want to test) in the right panel
3. **Set problem constraints** (e.g., input size, value ranges)
4. **Run the stress test** — the analyzer generates random inputs and compares outputs
5. **View failing cases** — see the exact input and mismatched outputs when a failure is found

---

## 📁 Project Structure

```
cp-test-analyzer/
├── src/
│   ├── main.tsx          # App entry point
│   └── ...               # Components, pages, utils
├── index.html
├── package.json
├── vite.config.ts
└── .env                  # API keys (not committed)
```

---

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run TypeScript type check |
| `npm run clean` | Remove build artifacts |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

[MIT](LICENSE)

---

> Built with 💻 and vibes for competitive programmers who are tired of getting WA on edge cases.
