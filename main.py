"""
🎮 Python Mini Projects — Interactive Launcher Menu
===================================================
A central, interactive CLI menu at the root level to browse,
search, and launch all games, math utilities, and other tools.
"""

import os
import subprocess
import sys
import json

REGISTRY_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "projects_registry.json")

try:
    with open(REGISTRY_PATH, "r", encoding="utf-8") as f:
        PROJECTS = json.load(f)
except Exception as e:
    print(f"Error loading project registry: {e}")
    PROJECTS = []

DIFFICULTY_BADGES = {
    "beginner": "🟢 Beg",
    "intermediate": "🟡 Int",
    "advanced": "🔴 Adv",
}

CATEGORY_EMOJIS = {
    "games": "🎮",
    "math": "🔢",
    "utilities": "🔧",
}

def print_header():
    print("\n" + "═" * 60)
    print("        🚀  PYTHON MINI PROJECTS — INTERACTIVE LAUNCHER")
    print("═" * 60)

def print_footer():
    print("═" * 60)

def list_projects_by_category(category_name):
    filtered = [p for p in PROJECTS if p.get("category", "") == category_name]
    filtered_sorted = sorted(filtered, key=lambda p: p.get("name", ""))
    return filtered_sorted

def launch_project(path):
    if not os.path.exists(path):
        print(f"\n❌ Error: File not found at '{path}'")
        input("\nPress Enter to return to menu...")
        return
    
    print(f"\n🚀 Launching: {os.path.basename(path)}")
    print("─" * 60 + "\n")
    try:
        # Run with current python executable
        subprocess.run([sys.executable, path])
    except Exception as e:
        print(f"\n❌ Error executing script: {e}")
    print("\n" + "─" * 60)
    input("ℹ️ Script finished. Press Enter to return to the launcher...")

def main_menu():
    while True:
        os.system('cls' if os.name == 'nt' else 'clear')
        print_header()
        print("  Please select a category to browse:")
        print("\n  [1] 🎮 Games")
        print("  [2] 🔢 Math Utilities")
        print("  [3] 🔧 General Utilities")
        print("  [4] 🔍 Search Projects by Keyword")
        print("  [5] 📋 List All Projects")
        print("  [6] ❌ Exit")
        print_footer()
        
        choice = input("👉 Enter choice (1-6): ").strip()
        
        if choice == "1":
            category_menu("games", "Games")
        elif choice == "2":
            category_menu("math", "Math Utilities")
        elif choice == "3":
            category_menu("utilities", "General Utilities")
        elif choice == "4":
            search_menu()
        elif choice == "5":
            list_all_menu()
        elif choice == "6":
            print("\n👋 Happy Coding! Goodbye.\n")
            break
        else:
            input("\n⚠️ Invalid selection. Press Enter to try again...")

def category_menu(category_key, category_title):
    while True:
        os.system('cls' if os.name == 'nt' else 'clear')
        print_header()
        print(f"  📂 Category: {category_title}")
        print("─" * 60)
        
        items = list_projects_by_category(category_key)
        for idx, item in enumerate(items, start=1):
            difficulty = DIFFICULTY_BADGES.get(item.get("difficulty", "Unknown"), item.get("difficulty", "Unknown"))
            print(f"  [{idx:2d}] {item.get('emoji', '')} {item.get('name', ''):30s} [{difficulty}]")
            print(f"       {item.get('description', '')}")
            print()
            
        print(f"  [B] 🔙 Back to Main Menu")
        print_footer()
        
        choice = input("👉 Select project number to launch (or 'b' to go back): ").strip().lower()
        if choice == 'b':
            break
        
        try:
            val = int(choice)
            if 1 <= val <= len(items):
                launch_project(items[val - 1]["path"])
            else:
                input("\n⚠️ Number out of range. Press Enter to try again...")
        except ValueError:
            input("\n⚠️ Invalid input. Please enter a number or 'b'. Press Enter to try again...")

def search_menu():
    os.system('cls' if os.name == 'nt' else 'clear')
    print_header()
    print("  🔍 Search Projects")
    print_footer()
    query = input("👉 Enter search keyword (e.g., game, solver, cipher): ").strip().lower()
    if not query:
        return
        
    results = [
        p for p in PROJECTS
        if query in p["name"].lower()
        or query in p["description"].lower()
        or any(query in kw.lower() for kw in p["keywords"])
    ]
    
    if not results:
        input("\n⚠️ No matching projects found. Press Enter to return to main menu...")
        return
        
    while True:
        os.system('cls' if os.name == 'nt' else 'clear')
        print_header()
        print(f"  🔍 Search Results for '{query}':")
        print("─" * 60)
        
        for idx, item in enumerate(results, start=1):
            cat_emoji = CATEGORY_EMOJIS.get(item.get("category", ""), "")
            difficulty = DIFFICULTY_BADGES.get(item.get("difficulty", "Unknown"), item.get("difficulty", "Unknown"))
            print(f"  [{idx:2d}] {cat_emoji} {item.get('name', ''):30s} [{difficulty}]")
            print(f"       {item.get('description', '')}")
            print()
            
        print(f"  [B] 🔙 Back to Main Menu")
        print_footer()
        
        choice = input("👉 Select project number to launch (or 'b' to go back): ").strip().lower()
        if choice == 'b':
            break
            
        try:
            val = int(choice)
            if 1 <= val <= len(results):
                launch_project(results[val - 1]["path"])
            else:
                input("\n⚠️ Number out of range. Press Enter to try again...")
        except ValueError:
            input("\n⚠️ Invalid input. Please enter a number or 'b'. Press Enter to try again...")

def list_all_menu():
    while True:
        os.system('cls' if os.name == 'nt' else 'clear')
        print_header()
        print("  📋 All Projects")
        print("─" * 60)
        
        sorted_all = sorted(PROJECTS, key=lambda p: (p.get("category", ""), p.get("name", "")))
        for idx, item in enumerate(sorted_all, start=1):
            cat_emoji = CATEGORY_EMOJIS.get(item.get("category", ""), "")
            difficulty = DIFFICULTY_BADGES.get(item.get("difficulty", "Unknown"), item.get("difficulty", "Unknown"))
            print(f"  [{idx:2d}] {cat_emoji} {item.get('name', ''):30s} [{difficulty}]")
            print(f"       {item.get('description', '')}")
            print()
            
        print(f"  [B] 🔙 Back to Main Menu")
        print_footer()
        
        choice = input("👉 Select project number to launch (or 'b' to go back): ").strip().lower()
        if choice == 'b':
            break
            
        try:
            val = int(choice)
            if 1 <= val <= len(sorted_all):
                launch_project(sorted_all[val - 1]["path"])
            else:
                input("\n⚠️ Number out of range. Press Enter to try again...")
        except ValueError:
            input("\n⚠️ Invalid input. Please enter a number or 'b'. Press Enter to try again...")

if __name__ == "__main__":
    try:
        main_menu()
    except KeyboardInterrupt:
        print("\n\n👋 Goodbye!")
