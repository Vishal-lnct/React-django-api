import csv
import random
import os

# Always save CSV beside this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_DIR, "products.csv")

products = [
    ("Nike Air Max", "Running shoes", "Shoes"),
    ("Adidas Hoodie", "Winter hoodie", "Clothing"),
    ("Puma Sneakers", "Comfort sneakers", "Shoes"),
    ("Casual T-Shirt", "Cotton t-shirt", "Clothing"),
    ("Denim Jeans", "Slim fit jeans", "Clothing"),
    ("Sports Watch", "Digital watch", "Accessories"),
    ("Leather Wallet", "Premium wallet", "Accessories"),
    ("Bluetooth Headphones", "Wireless sound", "Electronics"),
    ("Smartphone Stand", "Adjustable stand", "Electronics"),
    ("Gaming Mouse", "RGB gaming mouse", "Electronics"),
]

with open(csv_path, "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)

    # CSV header
    writer.writerow(["name", "price", "description", "image", "category"])

    for i in range(200):
        name, desc, category = random.choice(products)

        # ✅ UNIQUE IMAGE for every product
        image_url = f"https://picsum.photos/400/400?random={i}"

        writer.writerow([
            f"{name} {i+1}",
            random.randint(299, 9999),
            desc,
            image_url,
            category,
        ])

print("✅ 200 products CSV generated successfully!")