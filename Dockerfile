# 1. Use an official Python runtime as a parent image
FROM python:3.11-slim

# 2. Set environment variables
ENV DEBIAN_FRONTEND=noninteractive

# 3. Install system dependencies needed for the new key management method
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    gpg \
    --no-install-recommends

# 4. Add Google Chrome's official repository using the modern, secure method
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-chrome-keyring.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list

# 5. Install Google Chrome
RUN apt-get update \
    && apt-get install -y google-chrome-stable \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 6. Set the working directory for your app
WORKDIR /app

# 7. Copy and install your Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 8. Copy the rest of your application code into the container
COPY . .

# 9. Define the command to run your application
CMD ["gunicorn", "run:app", "--timeout", "120"]
