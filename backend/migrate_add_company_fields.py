"""Migration script to add company_name and company_logo fields to users table."""
import sqlite3
from pathlib import Path

# Database path
DB_PATH = Path(__file__).parent / "ats_database.db"

def migrate():
    """Add company_name and company_logo columns to users table."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        # Check if columns already exist
        cursor.execute("PRAGMA table_info(users)")
        columns = [row[1] for row in cursor.fetchall()]

        # Add company_name if it doesn't exist
        if 'company_name' not in columns:
            print("Adding company_name column...")
            cursor.execute("ALTER TABLE users ADD COLUMN company_name TEXT")
            print("✓ Added company_name column")
        else:
            print("✓ company_name column already exists")

        # Add company_logo if it doesn't exist
        if 'company_logo' not in columns:
            print("Adding company_logo column...")
            cursor.execute("ALTER TABLE users ADD COLUMN company_logo TEXT")
            print("✓ Added company_logo column")
        else:
            print("✓ company_logo column already exists")

        conn.commit()
        print("\n✓ Migration completed successfully!")

    except Exception as e:
        print(f"✗ Migration failed: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
