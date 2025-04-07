# MCP Gateway Frontend

A modern, elegant frontend for MCP Gateway management with an Apple-inspired design aesthetic.

## Features

- Complete HTTP interface management
- MCP server management and deployment
- Tool testing and monitoring
- Version history tracking
- Clean, modern UI with Apple-inspired design

## Tech Stack

- **Framework**: [Nuxt.js 3](https://nuxt.com/)
- **UI Components**: Custom components built with [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: SVG icons from [Heroicons](https://heroicons.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)

## Getting Started

1. Make sure you have Node.js (v16+) installed
2. Clone the repository
3. Install dependencies:

```bash
npm install
```

4. Configure environment variables:

```bash
# Create .env file based on the example
cp .env.example .env
```

5. Start the development server:

```bash
npm run dev
```

6. Build for production:

```bash
npm run build
```

## Project Structure

```
/
├── assets/             # Static assets
│   └── css/            # CSS files
├── components/         # Reusable components
├── composables/        # Vue 3 composables
├── layouts/            # App layouts
├── pages/              # Page components
│   ├── http-interfaces/  # HTTP interface management
│   └── mcp-servers/      # MCP server management
├── plugins/            # Nuxt plugins
└── public/             # Public static assets
```

## API Integration

The frontend connects to the MCP Gateway backend API. Configure the API URL in the `.env` file:

```
# .env
API_BASE_URL=http://localhost:8080
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT
