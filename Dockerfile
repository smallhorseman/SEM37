# 1. Use an official Python runtime as a parent image
FROM python:3.11-slim

# 2. Set environment variables to prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# 3. Install system dependencies needed for Chrome
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    --no-install-recommends

# 4. Add Google Chrome's official repository and install the latest stable version
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 5. Set the working directory for your app
WORKDIR /app

# 6. Copy and install your Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 7. Copy the rest of your application code into the container
COPY . .

# 8. Define the command to run your application
CMD ["gunicorn", "run:app", "--timeout", "120"]
