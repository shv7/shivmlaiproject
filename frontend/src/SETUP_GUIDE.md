# ShivMLAI — Refactored Project Structure
**Created by Shivesh Mishra · ShivMLAI.com — Zero to AGI**

---

## What Was Done

The entire `App.js` monolith has been split into a clean, scalable
file structure. All UI and functionality is **100% identical** — only
the code organisation changed.

---

## Final Folder Structure

```
src/
├── index.js                          ← React entry point
├── App.js                            ← Platform shell + routing (no lesson code)
│
├── shared/
│   └── lessonStyles.js               ← Shared palettes, style objects, NavPage
│
└── levels/
    ├── Level1_AIFundamentals/
    │   ├── Level1_AIFundamentals.js  ← Container + named re-exports
    │   ├── WhatIsAI.js               ← Lesson 1 (all components + page)
    │   ├── HistoryOfAI.js            ← Lesson 2 (all components + page)
    │   ├── AIVsMLVsDL.js             ← Lesson 3 (all components + page)
    │   ├── TypesOfAI.js              ← Lesson 4 (all components + page)
    │   └── AIApplications.js         ← Lesson 5 (all components + page)
    │
    ├── Level2_MathForAI.js           ← Placeholder
    ├── Level3_MachineLearning.js     ← Placeholder
    ├── Level4_DeepLearning.js        ← Placeholder
    ├── Level5_ModernAI.js            ← Placeholder
    ├── Level6_LLMs.js                ← Placeholder
    └── Level7_AGI.js                 ← Placeholder
```

---

## How to Set Up a New React Project

### Step 1 — Create the project

```bash
npx create-react-app shivmlai
cd shivmlai
```

### Step 2 — Copy all files

Replace the `src/` folder with the contents of this zip:

```bash
# Remove the default src
rm -rf src/

# Copy the new src folder (from the zip) into the project root
cp -r path/to/this/src ./src
```

### Step 3 — Install & run

```bash
npm start
```

Open **http://localhost:3000** — the platform loads exactly as before.

---

## How the Import Chain Works

```
src/index.js
  └── imports App  from ./App

src/App.js
  ├── imports { WhatIsAI, HistoryOfAI, AIVsMLVsDL, TypesOfAI, AIApplications }
  │             from ./levels/Level1_AIFundamentals/Level1_AIFundamentals
  │
  ├── imports Level2_MathForAI      from ./levels/Level2_MathForAI
  ├── imports Level3_MachineLearning from ./levels/Level3_MachineLearning
  ├── imports Level4_DeepLearning    from ./levels/Level4_DeepLearning
  ├── imports Level5_ModernAI        from ./levels/Level5_ModernAI
  ├── imports Level6_LLMs            from ./levels/Level6_LLMs
  ├── imports Level7_AGI             from ./levels/Level7_AGI
  │
  └── imports { T }  from ./shared/lessonStyles   ← T.amber / T.paper for nav CSS

src/levels/Level1_AIFundamentals/Level1_AIFundamentals.js
  ├── re-exports WhatIsAI       from ./WhatIsAI
  ├── re-exports HistoryOfAI    from ./HistoryOfAI
  ├── re-exports AIVsMLVsDL     from ./AIVsMLVsDL
  ├── re-exports TypesOfAI      from ./TypesOfAI
  └── re-exports AIApplications from ./AIApplications

Each lesson file (e.g. WhatIsAI.js)
  └── imports { T, px, LCARD, LTAG … } from ../../shared/lessonStyles
```

---

## How Lesson Routing Works (App.js)

`App.js` holds the `activePage` state. When a user clicks a lesson in the
Roadmap, `handleOpenLesson(pageKey)` is called and `activePage` is set to
the corresponding key. The relevant lesson page component is then rendered.

```
"what-is-ai"       → <WhatIsAIPage onBack={…} />
"history-of-ai"    → <HistoryOfAIPage onBack={…} />
"ai-vs-ml-dl"      → <AIvsMLPage onBack={…} />
"types-of-ai"      → <TypesOfAIPage onBack={…} />
"ai-applications"  → <AIApplicationsPage onBack={…} />
```

---

## How to Add a New Lesson (e.g. Lesson 6 inside Level 1)

1. **Create the component file:**
   ```
   src/levels/Level1_AIFundamentals/AIEthics.js
   ```
   ```js
   import { T, px, LCARD, LTAG, LH2, LBODY, LSEC } from "../../shared/lessonStyles";

   function AIEthicsPage({ onBack }) {
     return <div>…your lesson content…</div>;
   }
   export default AIEthicsPage;
   ```

2. **Add a named re-export in `Level1_AIFundamentals.js`:**
   ```js
   export { default as AIEthics } from "./AIEthics";
   ```

3. **Add the import in `App.js`:**
   ```js
   import {
     …existing…,
     AIEthics as AIEthicsPage,
   } from "./levels/Level1_AIFundamentals/Level1_AIFundamentals";
   ```

4. **Add the route key in `LESSON_ROUTES` (App.js):**
   ```js
   const LESSON_ROUTES = {
     …existing…,
     "AI Ethics": "ai-ethics",
   };
   ```

5. **Add the route guard in `App.js`:**
   ```js
   if (activePage === "ai-ethics") return lessonNav("#ef4444", AIEthicsPage);
   ```

6. **Add the topic to `CURRICULUM` in `App.js`:**
   ```js
   { level: 1, title: "AI Fundamentals", …, topics: […, "AI Ethics"] }
   ```

---

## How to Build a Level 2 Lesson

Open `src/levels/Level2_MathForAI.js` — it already has a styled
placeholder. Replace the placeholder JSX with your full lesson content,
following the same pattern as any Level 1 lesson file.

You can also split Level 2 into sub-files exactly like Level 1:

```
src/levels/
└── Level2_MathForAI/
    ├── Level2_MathForAI.js   ← container
    ├── Vectors.js
    ├── GradientDescent.js
    └── Probability.js
```

Then update the import path in `App.js` from:
```js
import Level2_MathForAI from "./levels/Level2_MathForAI";
```
to:
```js
import Level2_MathForAI from "./levels/Level2_MathForAI/Level2_MathForAI";
```

---

## File Responsibilities at a Glance

| File | Responsibility |
|------|---------------|
| `index.js` | React DOM root render |
| `App.js` | Platform shell, navigation, routing logic, platform components |
| `shared/lessonStyles.js` | `T`, `V`, `px`, `LCARD`, `LTAG`, `LH2`, `LBODY`, `LSEC`, `LBTN`, `NavPage`, `STag`, `IBox`, `LN` |
| `Level1_AIFundamentals.js` | Named re-exports, lesson metadata |
| `WhatIsAI.js` | All Lesson 1 sub-components + `WhatIsAIPage` |
| `HistoryOfAI.js` | All Lesson 2 sub-components + `HistoryOfAIPage` |
| `AIVsMLVsDL.js` | All Lesson 3 sub-components + `AIvsMLPage` |
| `TypesOfAI.js` | All Lesson 4 sub-components + `TypesOfAIPage` |
| `AIApplications.js` | All Lesson 5 sub-components + `AIApplicationsPage` |
| `Level2_MathForAI.js` | Placeholder — ready for development |
| `Level3–7.js` | Placeholders — ready for development |

---

*ShivMLAI.com — Learn Artificial Intelligence Visually · Created by Shivesh Mishra*
----------------


