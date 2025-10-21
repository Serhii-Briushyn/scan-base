# 📦 Scan Base

**Scan Base** is an offline desktop application for tracking and managing warehouse materials.  
Built with **React + Vite + Electron + Dexie + TypeScript**, it supports barcode scanners (Bluetooth/USB) and data export to **Excel (XLSX)**.

---

## 🚀 Main Features

| Category               | Description                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| 🧾 Material Records    | Scans and stores records of received materials with automatic timestamps                 |
| 🔍 Scanner Integration | Reads barcodes and validates scanned data automatically                                  |
| 💾 Local Database      | Stores all records locally using **IndexedDB (Dexie)** — fully offline operation         |
| 📊 Daily Archive       | Displays all saved material records filtered by selected date                            |
| 📁 Excel Export        | Exports daily records to .xlsx with auto-generated filenames `materials_DD-MM-YYYY.xlsx` |
| 🧠 Error Handling      | Centralized error management with toast notifications and input validation               |
| ⚡ Electron Runtime    | Runs as a native desktop app with auto-update support                                    |
| 🌙 User Interface      | Minimalist interface with focus control for smooth and efficient scanning                |

---

## 🏗 Project Architecture

```
📦 SCAN-BASE
│
├── apps/
│   ├── main/                     # Electron Main Process (creates the app window, handles IPC and auto-updates)
│   │   ├── src/
│   │   │   └── app/
│   │   │       ├── ipc/
│   │   │       │    └── register.ts
│   │   │       └── index.ts
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   ├── preload/                  # Preload Script (secure bridge between renderer and main process)
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   └── renderer/                 # Frontend (React + Vite)
│       ├── public/
│       │   ├── fonts/
│       │   └── icons/
│       ├── src/
│       │   ├── features/
│       │   │   ├── excel/
│       │   │   │   └── lib/exportDailyXlsx.ts
│       │   │   └── material/
│       │   │       ├── components/
│       │   │       │   └── ScanCapture/ScanCapture.tsx
│       │   │       ├── lib/
│       │   │       │   ├── errors.ts
│       │   │       │   ├── messages.ts
│       │   │       │   └── parse.ts
│       │   │       └── types/scan.ts
│       │   │
│       │   ├── pages/
│       │   │   └── MainPage/
│       │   │       ├── components/
│       │   │       │   ├── RecordsControls.tsx
│       │   │       │   ├── RecordsSection.tsx
│       │   │       │   ├── RecordsTable.tsx
│       │   │       │   └── ScanPanel.tsx
│       │   │       └── MainPage.tsx
│       │   │
│       │   ├── shared/
│       │   │   ├── db/
│       │   │   │   └── index.ts
│       │   │   ├── styles/
│       │   │   │   ├── fonts.css
│       │   │   │   ├── globals.css
│       │   │   │   └── vars.css
│       │   │   ├── types/
│       │   │   │   └── material.ts
│       │   │   └── utils/
│       │   │       ├── date.ts
│       │   │       └── showErrorToast.ts
│       │   │
│       │   ├── App.tsx
│       │   ├── global.d.ts
│       │   └── main.tsx
│       │
│       ├── index.html
│       ├── tsconfig.json
│       └── vite.config.ts
│
├── packages/
│   └── ipc/
│       ├── src/
│       │   └── preload-api.ts
│       └── tsconfig.json
│
├── public/
│   └── icons/
│       ├── app.ico
│       ├── app.icns
│       └── app.png
│
├── release/                      # Builds (.exe) and auto-updates
│
├── .gitignore
├── eslint.config.mjs
├── package.json
├── package-lock.json
├── tsconfig.base.json
├── tsconfig.json
└── README.md
```

---

## 💽 Data Structures

```ts
type ScanParsed = {
  materialId: string;
  steelGrade: string;
  treatmentCode: string;
  sourceNestingId: string | null;
  thickness: string;
  width: string;
  length: string;
};

type MaterialRecord = {
  id: string;
  date: string;
  material: ScanParsed;
  createdAt: number;
};
```

---

## 🧠 Scanning Mechanism

Component `ScanCapture`:

```tsx
<ScanCapture ref={scanRef} onParsed={handleParsed} blurOnParsed />
```

- Listens for **barcode scanner input** (Bluetooth/USB) via keyboard emulation
- Buffers scanned lines until a valid material code is detected
- Parses collected data using `parseScanLines()` from `lib/parse.ts`
- Sends the structured result to the parent component through `onParsed()`

---

## 🗃 Local Database (Dexie / IndexedDB)

```ts
export const db = new Dexie("scan-base");
db.version(1).stores({ records: "id, date, materialId, createdAt" });

await db.records.add({
  id: crypto.randomUUID(),
  date: ymd(),
  material,
  createdAt: Date.now(),
});
```

- All scanned records are stored **locally** in the browser`s IndexedDB using Dexie
- Fully offline operation — no external server or network connection required

---

## 📤 Excel Export (XLSX)

File: `features/excel/lib/exportDailyXlsx.ts`  
Exports all records for the selected date to an Excel file.  
File name example:

```tsx
materials_19-10-2025.xlsx
```

- Exports material data grouped by date
- Generates clear column headers and applies auto-formatting

---

## 🧰 Tech Stack

| Category        | Technologies                  |
| --------------- | ----------------------------- |
| 🧠 Language     | TypeScript                    |
| ⚛️ Frontend     | React + Vite                  |
| 🖥 Desktop       | Electron                      |
| 💾 Database     | Dexie (IndexedDB)             |
| 📊 Export       | ExcelJS                       |
| 🎨 UI           | CSS Modules                   |
| 🧱 Architecture | Feature-based + Electron Apps |
| 🧩 Typing       | Strict TS + Partial / Record  |

---

## 📜 Scripts

| Command           | Description                                |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Start development mode                     |
| `npm run build`   | Build renderer                             |
| `npm run dist`    | Build desktop installer (.exe)             |
| `npm run release` | Publish GitHub release (GH_TOKEN required) |

---

## 👤 Author

**Serhii Briushyn** — Full Stack Developer  
📍 Slovakia  
💼 Internal production tool for **NMH s.r.o.**
