#!/usr/bin/env python3
"""
StackIt Setup Script
This script will guide you through setting up StackIt with your Railway PostgreSQL database
"""

import os
import sys
import subprocess
import platform

def print_header():
    print("🚀 StackIt Setup")
    print("=" * 50)
    print("This script will help you set up StackIt with your Railway PostgreSQL database")
    print()

def check_prerequisites():
    """Check if required software is installed"""
    print("🔍 Checking prerequisites...")
    
    # Check Python
    python_version = sys.version_info
    if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 8):
        print("❌ Python 3.8+ is required")
        return False
    print(f"✅ Python {python_version.major}.{python_version.minor}.{python_version.micro}")
    
    # Check Node.js
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Node.js {result.stdout.strip()}")
        else:
            print("❌ Node.js is not installed")
            return False
    except FileNotFoundError:
        print("❌ Node.js is not installed")
        return False
    
    # Check npm
    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ npm {result.stdout.strip()}")
        else:
            print("❌ npm is not installed")
            return False
    except FileNotFoundError:
        print("❌ npm is not installed")
        return False
    
    print()
    return True

def setup_backend():
    """Setup the backend"""
    print("🔧 Setting up backend...")
    
    # Change to server directory
    os.chdir('server')
    
    # Install Python dependencies
    print("📦 Installing Python dependencies...")
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], check=True)
        print("✅ Python dependencies installed")
    except subprocess.CalledProcessError:
        print("❌ Failed to install Python dependencies")
        return False
    
    # Check if .env file exists
    if not os.path.exists('.env'):
        print("⚠️  .env file not found. You need to create it manually.")
        print("Run: python get_railway_url.py for instructions")
        return False
    
    # Test database connection
    print("🔍 Testing database connection...")
    try:
        result = subprocess.run([sys.executable, 'test_connection.py'], check=True)
        print("✅ Database connection successful")
    except subprocess.CalledProcessError:
        print("❌ Database connection failed")
        print("Please check your DATABASE_URL in .env file")
        return False
    
    # Setup database
    print("🗄️  Setting up database...")
    try:
        subprocess.run([sys.executable, 'setup_db.py'], check=True)
        print("✅ Database setup completed")
    except subprocess.CalledProcessError:
        print("❌ Database setup failed")
        return False
    
    # Go back to root directory
    os.chdir('..')
    print()
    return True

def setup_frontend():
    """Setup the frontend"""
    print("🔧 Setting up frontend...")
    
    # Change to client directory
    os.chdir('client')
    
    # Install Node.js dependencies
    print("📦 Installing Node.js dependencies...")
    try:
        subprocess.run(['npm', 'install'], check=True)
        print("✅ Node.js dependencies installed")
    except subprocess.CalledProcessError:
        print("❌ Failed to install Node.js dependencies")
        return False
    
    # Go back to root directory
    os.chdir('..')
    print()
    return True

def start_servers():
    """Start both servers"""
    print("🚀 Starting servers...")
    print()
    print("To start the backend server:")
    print("  cd server")
    print("  python app.py")
    print()
    print("To start the frontend server (in a new terminal):")
    print("  cd client")
    print("  npm start")
    print()
    print("The application will be available at:")
    print("  Frontend: http://localhost:3000")
    print("  Backend:  http://localhost:5000")
    print()

def main():
    print_header()
    
    # Check prerequisites
    if not check_prerequisites():
        print("❌ Prerequisites check failed. Please install the required software.")
        sys.exit(1)
    
    # Setup backend
    if not setup_backend():
        print("❌ Backend setup failed.")
        sys.exit(1)
    
    # Setup frontend
    if not setup_frontend():
        print("❌ Frontend setup failed.")
        sys.exit(1)
    
    print("🎉 Setup completed successfully!")
    print()
    start_servers()
    
    print("📚 Next steps:")
    print("1. Create a .env file in the server directory with your Railway PostgreSQL URL")
    print("2. Start the backend server: cd server && python app.py")
    print("3. Start the frontend server: cd client && npm start")
    print("4. Open http://localhost:3000 in your browser")
    print("5. Register a new account and start asking questions!")

if __name__ == "__main__":
    main() 