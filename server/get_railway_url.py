#!/usr/bin/env python3
"""
Helper script to guide users in getting their Railway PostgreSQL URL
"""

def main():
    print("🚀 Railway PostgreSQL URL Setup Guide")
    print("=" * 50)
    print()
    print("To get your Railway PostgreSQL URL:")
    print()
    print("1. Go to https://railway.app/dashboard")
    print("2. Select your PostgreSQL database project")
    print("3. Click on the 'Connect' tab")
    print("4. Copy the 'Postgres Connection URL'")
    print("5. Create a .env file in the server directory with:")
    print()
    print("   DATABASE_URL=your_railway_postgres_url_here")
    print("   JWT_SECRET_KEY=your-super-secret-jwt-key")
    print("   FLASK_ENV=development")
    print("   FLASK_DEBUG=True")
    print()
    print("Example .env file:")
    print("-" * 30)
    print("DATABASE_URL=postgresql://username:password@host:port/database_name")
    print("JWT_SECRET_KEY=my-super-secret-jwt-key-change-this")
    print("FLASK_ENV=development")
    print("FLASK_DEBUG=True")
    print("-" * 30)
    print()
    print("After creating the .env file, run:")
    print("   python setup_db.py")
    print()
    print("Then start the server with:")
    print("   python app.py")

if __name__ == "__main__":
    main()