name: CI/CD Pipeline 🚀

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop

jobs:
  build:
    name: Build & Test NodeArch App
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code 🛎️
        uses: actions/checkout@v4

      - name: Set up Node.js 🏗️
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies 📦
        run: npm install

      - name: Lint Code 🧹
        run: npm run lint

      - name: Run Tests ✅
        run: npm test

      - name: Build Project 🏗️
        run: npm run build 

  docker:
    name: Build & Push Docker Image 🐳
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'  # Only push on main branch

    steps:
      - name: Checkout Code 🛎️
        uses: actions/checkout@v4

      - name: Log in to Docker Hub 🛠️
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_HUB_USERNAME }}
          password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}

      - name: Set up Docker Buildx 🏗️
        uses: docker/setup-buildx-action@v3

      - name: Build & Push Docker Image 🐳
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: your-dockerhub-username/my-nodearch-app:latest
          cache-from: type=registry,ref=your-dockerhub-username/my-nodearch-app:cache
          cache-to: type=inline
