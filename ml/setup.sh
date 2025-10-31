#!/bin/bash

# ATS Machine Learning Setup Script

echo "========================================="
echo "ATS ML Environment Setup"
echo "========================================="

# Create virtual environment
echo ""
echo "Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo ""
echo "Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo ""
echo "Installing Python packages..."
pip install -r requirements.txt

# Download spaCy model
echo ""
echo "Downloading spaCy English model..."
python -m spacy download en_core_web_sm

# Create necessary directories
echo ""
echo "Creating directory structure..."
mkdir -p data/raw
mkdir -p data/processed
mkdir -p models
mkdir -p api

echo ""
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Generate synthetic data: python src/generate_synthetic_data.py"
echo "3. Or download real data and place in data/raw/"
echo "4. Run Jupyter notebook: jupyter notebook notebooks/"
echo ""
