name: CapitalFlow CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build frontend
        run: npm run build
        env:
          TURSO_URL: ${{ secrets.TURSO_URL }}
          TURSO_TOKEN: ${{ secrets.TURSO_TOKEN }}
      
      - name: Run tests
        run: npm test -- --passWithNoTests
      
      - name: Deploy to Docker
        run: |
          docker-compose up --build -d
        env:
          TURSO_URL: ${{ secrets.TURSO_URL }}
          TURSO_TOKEN: ${{ secrets.TURSO_TOKEN }}
          TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
