from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.db.models import Q
from django.shortcuts import get_object_or_404


from .models import Product, Category, Cart, CartItem, Order, OrderItem
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ProductSerializer,
    CategorySerializer,
    CartSerializer,
    CartItemSerializer,
    OrderSerializer
)


# ====================================
# PRODUCTS (SEARCH + CATEGORY FILTER)
# ====================================
@api_view(['GET'])
def get_products(request):
    search = request.GET.get('search')
    category = request.GET.get('category')

    # optimization: avoids extra DB queries
    products = Product.objects.select_related('category').all()

    # SEARCH FILTER
    if search:
        products = products.filter(
            Q(name__icontains=search) |
            Q(description__icontains=search)
        )

    # CATEGORY FILTER (case insensitive)
    if category and category.strip():
        products = products.filter(
            category__slug__iexact=category
        )

    # optional ordering
    products = products.order_by('-id')

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_product(request, pk):
    product = get_object_or_404(Product, id=pk)
    serializer = ProductSerializer(product)
    return Response(serializer.data)


# ====================================
# CATEGORIES
# ====================================
@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all().order_by('name')
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


# ====================================
# CART
# ====================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product_id')

    if not product_id:
        return Response({'error': 'Product ID required'}, status=400)

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

    cart, created = Cart.objects.get_or_create(user=request.user)
    item, created = CartItem.objects.get_or_create(cart=cart, product=product)

    if not created:
        item.quantity += 1
        item.save()

    return Response({
        'message': 'Product added to cart',
        'cart': CartSerializer(cart).data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_cart_quantity(request):
    item_id = request.data.get('item_id')
    quantity = request.data.get('quantity')

    if not item_id or quantity is None:
        return Response(
            {'error': 'Item ID and quantity are required'},
            status=400
        )

    try:
        item = CartItem.objects.get(id=item_id)

        quantity = int(quantity)

        if quantity < 1:
            item.delete()
            return Response({'message': 'Item removed'}, status=200)

        item.quantity = quantity
        item.save()

        serializer = CartItemSerializer(item)
        return Response(serializer.data)

    except CartItem.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    item_id = request.data.get('item_id')

    if not item_id:
        return Response({'error': 'Item ID required'}, status=400)

    CartItem.objects.filter(id=item_id).delete()
    return Response({'message': 'Item removed from cart'})


# ====================================
# ORDER
# ====================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        phone = request.data.get('phone')

        if not phone or not phone.isdigit() or len(phone) < 10:
            return Response({'error': 'Invalid phone number'}, status=400)

        cart, created = Cart.objects.get_or_create(user=request.user)

        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=400)

        total = sum(
            item.product.price * item.quantity
            for item in cart.items.all()
        )

        order = Order.objects.create(
            user=request.user,
            total_amount=total
        )

        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

        # clear cart
        cart.items.all().delete()

        return Response({
            'message': 'Order created successfully',
            'order_id': order.id
        })

    except Exception as e:
        return Response({'error': str(e)}, status=500)


# ====================================
# REGISTER
# ====================================
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "message": "User created successfully",
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# ====================================
# MY ORDERS
# ====================================
from .serializers import OrderSerializer


from .serializers import OrderSerializer

from .serializers import OrderSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders(request):

    orders = Order.objects.filter(
        user=request.user
    ).prefetch_related(
        'items__product'
    ).order_by('-id')

    serializer = OrderSerializer(
        orders,
        many=True,
        context={'request': request}   # ⭐ CRITICAL LINE
    )

    return Response(serializer.data)
#cancel krne ke lie
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_id):
    order = get_object_or_404(
        Order,
        id=order_id,
        user=request.user
    )

    # ✅ allow cancel only if pending
    if order.status.lower().strip() != "pending":
        return Response(
            {"error": f"Order status is {order.status}, cannot cancel"},
            status=400
        )

    order.status = "cancelled"
    order.save()

    return Response({"message": "Order cancelled successfully"})