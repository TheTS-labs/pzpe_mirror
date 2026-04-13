# PZPE Mirror

**PZPE Mirror** is a fast, reliable, and open-source web interface for the [Zaporizhzhia National Polytechnic University Portal](https://portal.zp.edu.ua). It provides a modern user experience and implements aggressive request caching to ensure the schedule remains accessible even during portal downtime.

## Features

* **Modern UI**: Built with a clean, responsive interface using Tailwind CSS and Shadcn components.
* **Downtime Protection**: Utilizes Cloudflare KV for request caching, mitigating issues when the upstream portal is unavailable.
* **Edge Powered**: Optimized for deployment on Cloudflare Workers for global low-latency performance.

## Tech Stack

* **Framework**: [React Router 7](https://reactrouter.com/) (formerly Remix).
* **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com/).
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/).
* **Data Processing**: [HTMLRewriter](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/) for DOM parsing and [Day.js](https://day.js.org/) for time management.
* **Storage**: [Cloudflare KV](https://developers.cloudflare.com/kv/) for caching schedule data.

## Getting Started

### Prerequisites

* Node.js (latest LTS recommended)
* npm or yarn
* A Cloudflare account (for deployment)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/TheTS-labs/pzpe_mirror.git
    cd pzpe_mirror
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

### Development

Run the development server locally:

```bash
npm run dev
```

### Deployment

Deploy the project to Cloudflare Workers:

```bash
npm run deploy
```

*Note: Ensure your `wrangler.jsonc` is configured with the correct KV namespace ID and custom domain settings*.
