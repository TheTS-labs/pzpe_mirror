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
* **Edge Ready**: Serverless-friendly architecture ready to deploy on Vercel.
* **Docker Ready:** Fully containerized with `Dockerfile` and `docker-compose.yml`.

## Tech Stack

* **Framework**: [React Router 7](https://reactrouter.com/).
* **Runtime**: [Vercel](https://vercel.com/) or Docker & Docker Compose.
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/).
* **i18n:** [Intlayer](https://intlayer.org/)
* **Data Processing**: [Cheerio.JS](https://cheerio.js.org/) for DOM parsing and [Day.js](https://day.js.org/) for time management.
* **Storage**: [Upstash Redis](https://upstash.com/docs/redis/overall/getstarted/) for caching.

## Getting Started

### Prerequisites

Ensure you have the following installed:

* [Node.js](https://nodejs.org/) (latest LTS is recommended)
* [npm](https://www.npmjs.com/)
* [Docker](https://www.docker.com/) (optional, for containerized deployment)
* [Vercel](https://vercel.com/) account (for edge deployment)

### Local Development

1. **Install dependencies:**

    ```bash
    npm install
    ```

2. **Create .env file:**

    ```bash
    cp .env.example .env
    ```

3. **Start Redis server and Serverless API:**

    ```bash
    docker compose up redis serverless-redis -d
    ```

4. **Start the development server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173` (or the port specified by Vite).

## Deployment

### Using Docker (Recommended)

The easiest way to deploy the application in production is using Docker Compose.

1. Build and start the container in detached mode:

    ```bash
    docker compose up -d --build
    ```

### Manual Build

To build the application for production without Docker:

1. Build the project:

    ```bash
    npm run build
    ```

2. Start the production server:

    ```bash
    npm run start
    ```

### Using Vercel

Deploy the application to Vercel.

1. **Connect Redis:**

    Add [Upstash Redis](https://vercel.com/marketplace/upstash) instance to your project.

2. **Deploy the application:**

    ```bash
    npx vercel --prod
    ```

### Axiom

When deploying the app, regardless of the deployment method, you can choose to record logs to [Axiom](https://axiom.co).

To enable, make sure you have `AXIOM_DATASET_NAME` and `AXIOM_TOKEN` environment variables set.

[Learn how you can add environment variables on Vercel](https://vercel.com/docs/environment-variables)

## License

Please refer to the `LICENSE` file in the root directory for more information.
