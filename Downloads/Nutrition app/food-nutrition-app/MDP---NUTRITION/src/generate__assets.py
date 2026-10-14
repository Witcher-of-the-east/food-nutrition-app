import os

images = {
    "burger.png": '''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100" height="100" fill="#FFF5F0" rx="20"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="50">🍔</text></svg>''',
    "hotdog.png": '''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100" height="100" fill="#FFF5F0" rx="20"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="50">🌭</text></svg>''',
    "pizza.png": '''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100" height="100" fill="#FFF5F0" rx="20"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="50">🍕</text></svg>''',
    "donut.png": '''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100" height="100" fill="#FFF5F0" rx="20"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="50">🍩</text></svg>''',
    "cake.png": '''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100" height="100" fill="#FFF5F0" rx="20"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="50">🍰</text></svg>''',
    "popcorn.png": '''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100" height="100" fill="#FFF5F0" rx="20"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="50">🍿</text></svg>''',
    "cookies.png": '''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100" height="100" fill="#FFF5F0" rx="20"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="50">🍪</text></svg>'''
}

os.makedirs("public/images", exist_ok=True)
for file_name, svg in images.items():
    with open(f"public/images/{file_name}", "w", encoding="utf-8") as f:
        f.write(svg)

print("All asset files created in public/images/")