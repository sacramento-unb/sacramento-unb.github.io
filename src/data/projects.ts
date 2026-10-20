export type ProjectDomain = "data" | "ai" | "geospatial" | "software";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  domain: ProjectDomain;
  technologies: string[];
  repositoryUrl: string;
  status: "Experimental";
  context: string;
  problem: string;
  role: string;
  technicalApproach: string;
  architecture: string;
  flow: { label: string; detail: string }[];
  implementation: string;
  challenges: string;
  results: string;
  lessons: string;
  verified: true;
  approvedForPublication: true;
};

// Explicit publication allowlist. Every entry is backed by a local audit report
// and the owner's publication approval; the site never discovers repositories.
export const projects: Project[] = [
  {
    slug: "obs-eye-contact",
    title: "OBS Eye Contact",
    summary: "An experimental CPU gaze-redirection pipeline for OBS and Linux video workflows.",
    domain: "ai",
    technologies: ["Python", "MediaPipe", "OpenCV", "LiteRT", "pyvirtualcam", "V4L2"],
    repositoryUrl: "https://github.com/sacramento-unb/obs-eye-contact",
    status: "Experimental",
    context: "A local computer-vision tool for improving eye contact in an OBS V4L2 video input.",
    problem: "Keep gaze correction responsive without allowing camera frames to accumulate in an inference backlog.",
    role: "Personal project author and maintainer, supported by the repository history.",
    technicalApproach: "Capture only the latest frame, detect eye and iris landmarks, guard unsuitable poses or blinks, then apply model-based eye warps before compositing the frame.",
    architecture: "A capture thread feeds an in-memory frame path; MediaPipe provides landmarks, two eye-warp models transform crops, OpenCV composites the result and pyvirtualcam writes to the V4L2 device. A watchdog handles stalls.",
    flow: [
      { label: "Capture", detail: "The latest camera frame enters the in-memory path." },
      { label: "Landmarks", detail: "MediaPipe locates eyes and iris; geometry guards reject unsuitable poses." },
      { label: "Transform", detail: "Eye-warp models and OpenCV composite the frame." },
      { label: "Output", detail: "pyvirtualcam writes to V4L2; a watchdog detects stalls." },
    ],
    implementation: "The audited entry point is `gaze_camera.py`; model preparation is isolated in `tools/prepare_models.py`, while system and user installers are kept separate.",
    challenges: "Model conversion depends on heavyweight external downloads, hardware behavior is device-specific and the project still needs a repository-level license.",
    results: "Five unit tests passed and Python compilation succeeded; three model-dependent tests remained blocked because generated models were intentionally absent. Hardware output and FPS were not re-verified.",
    lessons: "A responsive vision pipeline needs explicit frame-dropping, guarded geometry and a clear boundary between reproducible unit checks and hardware validation.",
    verified: true,
    approvedForPublication: true,
  },
  {
    slug: "editor-inteligente-video",
    title: "Editor Inteligente de Vídeo",
    summary: "An experimental non-destructive video review and rendering system with a human-approved edit flow.",
    domain: "software",
    technologies: ["Rust", "Axum", "SQLite", "SQLx", "React", "TypeScript", "FFmpeg", "Docker"],
    repositoryUrl: "https://github.com/sacramento-unb/editor-inteligente-video",
    status: "Experimental",
    context: "A local media workflow that turns uploaded video into reviewable analysis and deterministic render jobs.",
    problem: "Preserve original media while allowing selected cuts and removals to become a controlled render plan.",
    role: "Personal project author and maintainer, supported by the repository history.",
    technicalApproach: "Stream uploads to temporary storage, hash and rename them, analyze with FFprobe, queue one deterministic worker and require manual selection before rendering.",
    architecture: "Rust/Axum orchestrates uploads, SQLite migrations and jobs; a React interface reviews suggestions; FFmpeg and FFprobe perform media work; output is written separately from the source.",
    flow: [
      { label: "Upload", detail: "Axum streams, hashes and stores original media." },
      { label: "Analyze", detail: "FFprobe supplies metadata; SQLite persists jobs." },
      { label: "Review", detail: "The React interface collects human-approved edits." },
      { label: "Render", detail: "A deterministic worker runs FFmpeg and writes a separate output." },
    ],
    implementation: "The backend starts at `backend/src/main.rs`, the frontend at `frontend/src/main.tsx`, and binary paths are configured with `FFMPEG_BIN` and `FFPROBE_BIN`.",
    challenges: "The current code is safe only when kept on a local boundary: CORS is broad, non-loopback binding has no authentication, media integration was not run and planned Whisper/Gemini layers are not implemented.",
    results: "Six Rust tests, the frontend test, the TypeScript/Vite production build and the production dependency audit passed. No server, container, FFmpeg process or end-to-end render was executed.",
    lessons: "A review-first media pipeline benefits from immutable inputs, explicit job boundaries and a strict distinction between implemented behavior and roadmap ideas.",
    verified: true,
    approvedForPublication: true,
  },
  {
    slug: "yeti-voice",
    title: "Yeti Voice",
    summary: "A local Linux audio engine and TUI for a Blue Yeti Nano microphone.",
    domain: "software",
    technologies: ["Python", "FFmpeg", "PipeWire", "PulseAudio", "ALSA", "systemd"],
    repositoryUrl: "https://github.com/sacramento-unb/yeti-voice",
    status: "Experimental",
    context: "A local-first utility for creating a processed virtual microphone source without a network service.",
    problem: "Expose repeatable microphone profiles while managing device controls, DSP and service recovery in one user session.",
    role: "Personal project author and maintainer, supported by commit and plugin metadata.",
    technicalApproach: "Dispatch a CLI to profile management, diagnostics, a TUI or an audio daemon; generate an FFmpeg filter chain and publish its monitor as a virtual source.",
    architecture: "JSON profiles and settings feed a user service; the daemon discovers the source, creates a PipeWire null sink, starts FFmpeg and restarts on configuration, device or process changes.",
    flow: [
      { label: "Configure", detail: "CLI and TUI manage JSON profiles and settings." },
      { label: "Discover", detail: "The user daemon discovers the microphone source." },
      { label: "Process", detail: "FFmpeg applies a filter chain through a PipeWire null sink." },
      { label: "Route", detail: "The monitor becomes a virtual source; the service handles restarts." },
    ],
    implementation: "The `yeti-voice` CLI and `yeti_voice.daemon:main` are the primary entry points; optional Omarchy and Hyprland integration remains separate from the core engine.",
    challenges: "Real ALSA, PipeWire, FFmpeg and systemd behavior depends on one Linux hardware environment, and the repository still needs a license decision.",
    results: "Twenty-three unit tests passed twice, compilation passed and Markdown links were checked. Hardware routing, acoustic quality and the installer were intentionally not executed.",
    lessons: "Local-first tools should state their side effects before installation and keep mocked logic checks separate from hardware integration claims.",
    verified: true,
    approvedForPublication: true,
  },
  {
    slug: "cor-contritum",
    title: "Cor Contritum",
    summary: "A privacy-first, local-first PWA for personal preparation, with opt-in encrypted persistence.",
    domain: "software",
    technologies: ["React", "TypeScript", "Vite", "IndexedDB", "Web Crypto", "Service Worker"],
    repositoryUrl: "https://github.com/sacramento-unb/cor-contritum",
    status: "Experimental",
    context: "A browser-based tool designed to work without a backend, analytics client or runtime API.",
    problem: "Offer a focused preparation flow while keeping optional saved sessions encrypted in the browser.",
    role: "Personal project author and maintainer, supported by the repository history.",
    technicalApproach: "Keep the default flow in memory; when persistence is requested, derive an AES-256-GCM key with PBKDF2 and store ciphertext, salt and IV in IndexedDB.",
    architecture: "`src/App.tsx` owns the flow, `src/data.ts` contains the deterministic catalog, `src/storage.ts` handles encrypted persistence and a service worker provides same-request offline caching.",
    flow: [
      { label: "Prepare", detail: "React presents a deterministic catalog and preparation flow." },
      { label: "Keep local", detail: "Session state stays in memory by default." },
      { label: "Opt in", detail: "Optional persistence derives an AES-GCM key with PBKDF2." },
      { label: "Store", detail: "IndexedDB holds ciphertext, salt and IV; the service worker caches requests." },
    ],
    implementation: "The entry point is `src/main.tsx`; configuration is build-time Vite configuration and no environment variable is required by the audited code.",
    challenges: "Browser cryptography, IndexedDB, service-worker lifecycle, accessibility and offline installation remain under-tested; direct dependencies also use broad `latest` ranges.",
    results: "The unit test, TypeScript lint, production build and production dependency audit passed. Browser persistence, installation, printing and accessibility were not re-verified.",
    lessons: "Privacy claims are strongest when the default data path is local, persistence is opt-in and the limits of browser-level verification are explicit.",
    verified: true,
    approvedForPublication: true,
  },
  {
    slug: "dem-drainage",
    title: "DEM Drainage",
    summary: "An experimental DEM-to-GeoParquet pipeline that extracts Hack-ordered drainage networks with WhiteboxTools.",
    domain: "geospatial",
    technologies: ["Python", "WhiteboxTools", "Rasterio", "GeoPandas", "GeoParquet", "FastAPI", "React", "Docker"],
    repositoryUrl: "https://github.com/sacramento-unb/dem-drainage",
    status: "Experimental",
    context: "A local CLI, API and web studio for turning digital elevation model tiles into inspectable drainage outputs.",
    problem: "Turn tiled elevation rasters into structured drainage networks while keeping thresholds, intermediate rasters and block boundaries visible.",
    role: "Personal project author and maintainer, supported by the repository history and published package metadata.",
    technicalApproach: "Validate single-band, CRS-bearing DEMs, breach depressions, derive D8 pointer and flow accumulation, extract streams, assign Hack order and write GeoParquet outputs.",
    architecture: "The Python CLI runs the WhiteboxTools pipeline and writes an auditable manifest; a FastAPI service exposes local jobs, while the React web studio uploads DEMs, tracks processing and maps generated artifacts. Docker and uv.lock describe the reproducible environment.",
    flow: [
      { label: "Validate", detail: "The CLI checks DEM bands, CRS and input paths before processing." },
      { label: "Hydrology", detail: "WhiteboxTools derives breached DEM, D8 pointer, accumulation and streams." },
      { label: "Order", detail: "HackStreamOrder assigns hierarchy and GeoParquet stores geometry and attributes." },
      { label: "Inspect", detail: "The API and React studio expose job state, manifests and generated map artifacts." },
    ],
    implementation: "The package exposes `dem-drainage` through `dem_drainage.cli:main` and the local web service through `dem_drainage.api:main`. Each processed block retains intermediate rasters and a run manifest alongside the final GeoParquet.",
    challenges: "Block-local processing does not create a globally continuous network between tile edges. The API still needs upload, job-count and execution-time limits, authentication and restricted CORS before exposure beyond a trusted local network. WhiteboxTools and the browser/API integration remain external runtime boundaries.",
    results: "Five Python source files compiled and the repository passed `git diff --check`; synthetic and mocked tests are present, but pytest, WhiteboxTools, Docker, the API and the web application were not executed in the audit environment.",
    lessons: "Geospatial pipelines become easier to inspect when thresholds, intermediate rasters, output contracts and block limitations are recorded beside each run instead of hidden behind a single map view.",
    verified: true,
    approvedForPublication: true,
  },
];
