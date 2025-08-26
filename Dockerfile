# Use an official Render image that includes Python and Chrome
FROM render/python-chrome:3.11

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of your application code into the container
COPY . .

# Command to run your application
CMD ["gunicorn", "run:app", "--timeout", "120"]
