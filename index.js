global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'capitalflow-api'
    static_configs:
      - targets: ['api:3001']
    metrics_path: '/api/health'

  - job_name: 'capitalflow-frontend'
    static_configs:
      - targets: ['nginx:80']
