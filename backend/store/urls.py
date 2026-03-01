from django.urls import path
from . import views
from .views import get_orders
from .views import cancel_order
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [

    # AUTH
    path('register/', views.register_view),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # PRODUCTS
    path('products/', views.get_products),
    path('products/<int:pk>/', views.get_product),

    # CATEGORIES
    path('categories/', views.get_categories),

    #order cancel
    path("orders/<int:order_id>/cancel/", cancel_order),

    # CART
    path('cart/', views.get_cart),
    path('cart/add/', views.add_to_cart),
    path('cart/remove/', views.remove_from_cart),
    path('cart/update/', views.update_cart_quantity),

    # ORDER
    path('orders/create/', views.create_order),

#my order me dikhane ke lie
    path('orders/', get_orders),
]