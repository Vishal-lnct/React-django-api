import csv
from django.core.management.base import BaseCommand
from store.models import Product, Category


class Command(BaseCommand):
    help = "Import products from CSV"

    def handle(self, *args, **kwargs):

        with open("products.csv", newline="", encoding="utf-8") as file:
            reader = csv.DictReader(file)

            for row in reader:

                # ✅ Create or get category
                category_obj, created = Category.objects.get_or_create(
                    name=row["category"]
                )

                # ✅ Create product
                Product.objects.create(
                    name=row["name"],
                    description=row["description"],
                    price=row["price"],
                    image=row["image"],
                    category=category_obj,
                )

        self.stdout.write(
            self.style.SUCCESS("✅ Products Imported Successfully")
        )