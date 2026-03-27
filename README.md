# CometAPI Studio

CometAPI Studio is a desktop-style web app for working with CometAPI from a single interface. It brings chat, image generation, image editing, video generation, model selection, provider filtering, and local history into one place so you do not need to keep jumping between raw API calls, separate playgrounds, or multiple provider dashboards.

## What It Does

CometAPI Studio gives you one UI for:

- chat with supported language models
- image generation across multiple providers
- image editing with models that accept image inputs
- video generation with async polling for supported providers
- switching models by provider
- enabling or disabling models in settings
- storing local chat and generation history in the browser
- testing your CometAPI key and connection settings

The app currently includes screens for:

- `Chat`
- `History`
- `Image`
- `Video`
- `Settings`

## Why It Is Useful

CometAPI supports many different providers, but those providers do not behave the same way. Some use different request formats, some use different endpoints, some require polling, and some support features like image input or video reference frames while others do not.

This project is useful because it:

- hides most of the provider-specific request complexity
- makes it faster to compare models in one place
- gives non-developer-friendly controls for prompts, model settings, and outputs
- keeps a local history of what you generated and what you asked
- lets you reduce clutter by disabling models you do not want to see
- works as a practical front end for real CometAPI workflows instead of a generic demo

## Main Features

### Chat

- uses CometAPI chat models from your available account models where possible
- supports `/v1/responses` for models that support it, with fallback to `/v1/chat/completions`
- supports streaming replies
- saves chat history locally

### Image

- text-to-image generation
- image editing for models that support image inputs
- provider filtering in the model picker
- support for reference images on supported models
- support for multiple modern providers including OpenAI, Google, ByteDance, Alibaba, and Flux-based models
- local image history with downloadable results

### Video

- async video job submission and polling
- provider-specific submission logic where needed
- live account-based video model discovery where available
- reference image upload on supported models
- local video history with downloadable outputs

### Settings

- store CometAPI key and base URL locally in the browser
- test your API connection
- choose default chat, image, and video models
- turn individual models on or off
- view models grouped by provider

### History

- local browser history for:
	- chat
	- image generation and edits
	- video jobs
- quick access to past prompts and outputs

## Tech Stack

- React
- Vite
- Tailwind CSS
- react-hot-toast
- lucide-react

## Launching The App

### Quickest Options

From the project root, any of these will start the app and open the browser:

- `npm run start`
- `start-cometapi-studio.bat`
- `start-cometapi-studio.ps1`

By default the app runs at:

- `http://localhost:5173/`

### VS Code

This repo includes workspace tasks in `.vscode/tasks.json`:

- `Start CometAPI Studio`
- `Build CometAPI Studio`

Run them from `Terminal: Run Task`.

### Other Commands

- `npm run dev` - start the dev server without forcing the browser open
- `npm run start:host` - start the dev server on the network and open the browser
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally

## Installation

### Requirements

- Node.js 18+
- npm
- a valid CometAPI API key

### Setup

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run start
```

3. Open the browser if it does not open automatically:

```text
http://localhost:5173/
```

## How To Use

### 1. Configure Settings First

Open `Settings` and enter:

- your CometAPI API key
- your base URL if you are using something other than the default `https://api.cometapi.com/v1`

Then:

- click `Test Connection`
- choose your default chat, image, and video models
- disable any models you do not want shown in the app

### 2. Use Chat

Open `Chat` to:

- choose a model from the dropdown
- type a message
- stream or receive a full reply depending on settings

The app will try to use `/v1/responses` for supported models and fall back when needed.

### 3. Generate or Edit Images

Open `Image` and choose:

- `Generate` for new images
- `Edit` for image editing workflows

Then:

- select a model
- optionally filter by provider
- enter your prompt
- upload reference images or source images where supported
- download results directly from the UI

### 4. Generate Videos

Open `Video` to:

- choose a video model
- set prompt, duration, resolution, aspect ratio, and related options
- upload a reference image if the selected model supports it
- submit the job and wait for polling to complete

Completed videos can be downloaded from the generation screen or from History.

### 5. Review History

Open `History` to review:

- previous chat prompts and replies
- previous image generations and edits
- previous video jobs

History is stored locally in the browser, not in a server-side database.

## Data Storage

This app stores settings and history locally in browser storage.

That includes:

- API settings
- default model selections
- enabled and disabled model state
- chat history
- image history
- video history

Generated media is not copied into the repository. The app stores references and local metadata for the browser session history.

## Notes

- Model availability may differ by API key
- Some providers expose models dynamically through CometAPI, so the exact list can vary by account
- Some downloads may fall back to opening the source URL in a new tab if the upstream media host blocks direct browser fetches
- Video providers may use different submission and polling mechanics under the hood

## Build

To create a production build:

```bash
npm run build
```

## Repository Goal

This project is intended to be a practical CometAPI control surface rather than a generic starter app. The goal is to make multi-provider chat, image, and video workflows easier to launch, test, compare, and manage from one UI.
