<div align="center">

<!-- Animated Header -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2,25,30&height=300&section=header&text=Prism%20Studio&fontSize=90&animation=fadeIn&fontAlignY=38&desc=The%20Ultimate%20AI%20Creative%20Suite&descAlignY=51&descAlign=62" width="100%" />

<!-- Typing Effect -->
<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=24&pause=1000&color=333333&background=00000000&center=true&vCenter=true&width=500&lines=Unleash+Your+Creativity;Detect+Deepfakes+Instantly;Generate+Stunning+Visuals;Transform+Your+Workflow" alt="Typing SVG" /></a>

<br/>

<!-- Badges -->
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<br/>

### *Where Imagination Meets Intelligence*

[![Prism Studio Landing](prism_landing.png)](prism_landing.png)

[🌐 Live Demo](https://deep-fake-audio-video-detector.vercel.app/) · [📝 Report Bug](https://github.com/yourusername/prism-studio/issues) · [✨ Request Feature](https://github.com/yourusername/prism-studio/issues)

</div>

<br/>

---

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&height=5&section=header&text=&animation=fadeIn" width="100%" />
</div>

## 📑 Table of Contents

- [✨ Features](#-features)
- [🏗️ How It Works](#-%EF%B8%8F-how-it-works)
- [🛠️ Tech Stack](#-%EF%B8%8F-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [💻 Development](#-development)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## ✨ Features

Experience a unified workspace consisting of three powerful pillars.

<table>
<tr>
<td width="50%" valign="top">

### 🎨 **Creative Studio**
> *Transform ideas into reality.*

- **Image Generator** 🖌️
  - Create high-fidelity visuals from text prompts.
- **3D Motion** 🌀
  - Add depth and movement to static images.
- **Magic Eraser** 🪄
  - Seamlessly remove unwanted objects.
- **Background Remover** ✂️
  - Instant precision cutout and transparency.
- **Image Upscaler** 🔍
  - Enhanced resolution up to 4x.
- **Image to PDF** 📄
  - Professional document conversion.

</td>
<td width="50%" valign="top">

### 🛡️ **Security & Intelligence**
> *Protect and uphold the truth.*

- **Deepfake Detector** 🕵️‍♂️
  - Multimodal analysis (Audio & Video) to detect manipulation.
  - Granular confidence scoring.
- **Live Guard** 🛡️ (*Coming Soon*)
  - Real-time digital threat monitoring.

### ⚡ **Productivity Hub**
> *Work smarter, not harder.*

- **YouTube Summarizer** 📺
  - Extract detailed notes from long videos instantly.
- **Document Summarizer** 📚
  - Digest complex PDFs in seconds.
- **Essay Writer** ✍️
  - Structured content generation from prompts.
- **Text to Speech** 🗣️
  - Lifelike vocal synthesis and narration.

</td>
</tr>
</table>

---

## 🏗️ How It Works

Prism Studio routes your requests through specialized AI agents.

```mermaid
graph TD
    User([User]) -->|Interacts| UI{Prism UI}
    UI -->|Creative| Vision[Generative Vision Model]
    UI -->|Security| Forensics[Forensic Analysis Engine]
    UI -->|Text/Audio| NLP[Multimodal Gemini Core]
    
    Vision --> Result1[Images / 3D Assets]
    Forensics --> Result2[Authenticity Report]
    NLP --> Result3[Summaries / Essays / Audio]
    
    Result1 & Result2 & Result3 -->|Display| UI
    
    style UI fill:#6366f1,color:#fff,stroke:#fff
    style Vision fill:#ec4899,color:#fff
    style Forensics fill:#10b981,color:#fff
    style NLP fill:#f59e0b,color:#fff
```

---

## 🛠️ Tech Stack

We use the best tools to ensure speed, scalability, and beauty.

<div align="center">

[![My Skills](https://skillicons.dev/icons?i=react,ts,vite,tailwindcss,framer,tensorflow,vercel,github,nodejs,html,css,figma&perline=6)](https://skillicons.dev)

</div>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+)
- **Google Gemini API Key** ([Get Key](https://makersuite.google.com/app/apikey))

### ⚡ Installation

1. **Clone & Enter**
   ```bash
   git clone https://github.com/yourusername/prism-studio.git
   cd prism-studio
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Brain**
   Create a `.env.local` file:
   ```env
   VITE_API_KEY=your_gemini_api_key_here
   ```

4. **Launch**
   ```bash
   npm run dev
   ```

   Visit `http://localhost:5173` 🚀

---

## 💻 Development

### 📂 Structure

```bash
prism-studio/
├── 📂 src/
│   ├── 📂 pages/          # The Toolset (Detector, Generators...)
│   ├── 📂 components/     # UI Building Blocks
│   ├── 📂 services/       # AI Integration Layer
│   └── 📂 icons/          # Visual Assets
├── 📂 public/             # Static Files
└── 📄 package.json        # Dependencies
```

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

<div align="center">
  <img src="https://img.shields.io/badge/Powered%20by-Gemini%20AI-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</div>

<br/>

<div align="center">

### Made with ❤️ by Alins Binu

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2,25,30&height=150&section=footer" width="100%" />

</div>
