FROM nvidia/cuda:12.1.1-cudnn8-runtime-ubuntu22.04

# System dependencies (as root)
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    python3 \
    python3-pip \
    python3-dev \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

# Set Python aliases (as root)
RUN ln -s /usr/bin/python3 /usr/bin/python
RUN ln -sf /usr/bin/pip3 /usr/bin/pip

# Install system-level Python packages (as root)
RUN pip install --upgrade pip

# Set up a new user named "user" with user ID 1000
RUN useradd -m -u 1000 user

# Switch to the "user" user
USER user

# Set home to the user's home directory
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Set the working directory to the user's home directory
WORKDIR $HOME/app

# Install Python packages as user (goes to ~/.local/bin)
RUN pip install --no-cache-dir --user "vllm[triton]"
RUN pip install --no-cache-dir --user gradio Pillow requests

# Copy files with correct ownership
COPY --chown=user numarkdown.svg $HOME/app/
COPY --chown=user app.py $HOME/app/
COPY --chown=user start.sh $HOME/app/
COPY --chown=user example_images/ $HOME/app/example_images/
RUN chmod +x $HOME/app/start.sh

# Expose the Space UI port
EXPOSE 7860

CMD ["./start.sh"]