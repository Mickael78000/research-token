FROM ubuntu:22.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install basic dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    pkg-config \
    libudev-dev \
    libssl-dev \
    python3 \
    bzip2 \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Install Rust and Cargo
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install specific Rust version
RUN rustup default 1.79.0

# Install Solana CLI
RUN sh -c "$(curl -sSfL https://release.solana.com/v1.18.26/install)"
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Install Anchor CLI
# RUN cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
# RUN avm install 0.29.0
# RUN avm use 0.29.0

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY program/package*.json program/

# Install dependencies
# RUN npm install
# RUN cd program && npm install

# Copy project files
COPY . .

# Build the program
# RUN cd program && anchor build

# Set default command
CMD ["npm", "run", "dev"]
