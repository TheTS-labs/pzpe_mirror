# PZPE Mirror

<p align="center">
    <a href="https://stats.uptimerobot.com/NCZbvU6h3E/802824223"><img alt="Mirror uptime ratio (30 days)" src="https://img.shields.io/uptimerobot/ratio/m802824223-c4c3abd56c706f30b325a4da?style=for-the-badge&label=Mirror%20uptime%20(30d)"></a>
    <a href="https://stats.uptimerobot.com/NCZbvU6h3E/802824243"><img alt="Origin uptime ratio (30 days)" src="https://img.shields.io/uptimerobot/ratio/m802824243-d0e76dbfacc27605e95ef8e0?style=for-the-badge&label=Origin%20uptime%20(30d)"></a>
    <a href="https://github.com/TheTS-labs/pzpe_mirror/blob/main/LICENSE"><img alt="License: MIT" src="https://img.shields.io/github/license/TheTS-labs/pzpe_mirror?style=for-the-badge"></a>
</p>

**PZPE Mirror** is a fast, reliable, and open-source web interface for the [Zaporizhzhia National Polytechnic University Portal](https://portal.zp.edu.ua). It provides a modern user experience and implements aggressive request caching to ensure the schedule remains accessible even during portal downtime.

## Features

* **Modern UI**: Built with a clean, responsive interface using Tailwind CSS and Shadcn components.
* **Downtime Protection**: Utilizes Redis for request caching, mitigating issues when the upstream portal is unavailable.
* **Edge Powered**: Serverless-friendly architecture ready to deploy on Vercel

## Tech Stack

* **Framework**: [React Router 7](https://reactrouter.com/) (formerly Remix).
* **Runtime**: [Vercel](https://vercel.com/).
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/).
* **Data Processing**: [Cheerio.JS](https://cheerio.js.org/) for DOM parsing and [Day.js](https://day.js.org/) for time management.
* **Storage**: [Upstash Redis](https://upstash.com/docs/redis/overall/getstarted/) for caching schedule data.

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

Deploy the project to Vercel:

```bash
npx vercel --prod
```
