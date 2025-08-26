import os

port = int(os.environ.get("PORT", 10000))
bind = f"0.0.0.0:{port}"
workers = int(os.environ.get("WEB_CONCURRENCY", 3))
worker_class = "sync"
loglevel = "info"
accesslog = "-"
errorlog = "-"
