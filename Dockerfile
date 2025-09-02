# Stage 1: Build environment with Rust, Solana CLI, Anchor, and Agave
FROM ubuntu:22.04 AS builder

ENV DEBIAN_FRONTEND=noninteractive
ENV PATH="/root/.cargo/bin:/root/.local/share/solana/install/active_release/bin:${PATH}"

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    pkg-config \
    libssl-dev \
    llvm \
    libudev-dev \
    ca-certificates \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Rust 1.86.0
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y && \
    /root/.cargo/bin/rustup install 1.86.0 && \
    /root/.cargo/bin/rustup default 1.86.0

# Install Agave CLI v2.2.12
RUN curl -sSfL https://github.com/anza-xyz/agave/releases/download/v2.2.12/agave-install-init-x86_64-unknown-linux-gnu \
    -o /usr/local/bin/agave-install-init && \
    chmod +x /usr/local/bin/agave-install-init && \
    /usr/local/bin/agave-install-init v2.2.12

# Install Anchor CLI 0.31.1
RUN cargo install --version 0.31.1 anchor-cli

# Verify installations
RUN ls -l /root/.local/share/solana/install/active_release/bin && \
    solana --version && \
    anchor --version && \
    rustc --version
