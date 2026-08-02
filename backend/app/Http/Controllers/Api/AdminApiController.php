<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Review;
use App\Models\Attribute;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

use Illuminate\Validation\Rule;

class AdminApiController extends Controller
{
    // Admin Auth - Login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Find user registered specifically as an Admin / Super Admin
        $user = User::where('email', $request->email)
                    ->whereIn('role', ['Super Admin', 'admin'])
                    ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid administrator credentials provided.'],
            ]);
        }

        $token = $user->createToken('admin_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'token' => $token,
            'admin' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role ?? 'Super Admin',
            ]
        ]);
    }

    // Admin Auth - Register
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->where(function ($query) {
                    return $query->whereIn('role', ['Super Admin', 'admin']);
                }),
            ],
            'phone' => ['required', 'string', 'regex:/^(?:\+88|88)?01[3-9]\d{8}$/'],
            'password' => 'required|string|min:8|confirmed', // min 8 chars & expects password_confirmation
        ], [
            'email.unique' => 'This email address is already registered as an administrator account.',
            'phone.regex' => 'Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01712345678).',
            'password.min' => 'Password must be at least 8 digits/characters long.',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'role' => 'Super Admin',
        ]);

        $token = $user->createToken('admin_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Admin registered successfully!',
            'token' => $token,
            'admin' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
            ]
        ], 201);
    }

    // Dashboard Overview Metrics
    public function dashboardMetrics()
    {
        $totalRevenue = Order::sum('grand_total');
        $totalSales = Order::count();
        $totalProducts = Product::count();
        $totalCustomers = User::where('role', 'customer')->count();

        $recentOrders = Order::with('items')->latest()->take(5)->get();
        $topSellingProducts = Product::orderBy('reviews_count', 'desc')->take(5)->get();

        return response()->json([
            'status' => 'success',
            'metrics' => [
                'total_revenue' => $totalRevenue,
                'total_sales' => $totalSales,
                'total_products' => $totalProducts,
                'total_customers' => $totalCustomers,
            ],
            'recent_orders' => $recentOrders,
            'top_selling_products' => $topSellingProducts,
        ]);
    }

    // Category Endpoints
    public function categories()
    {
        return response()->json(Category::with(['parent', 'children'])->latest()->get());
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']) . '-' . time();
        }

        $category = Category::create($validated);
        return response()->json(['status' => 'success', 'category' => $category], 201);
    }

    public function updateCategory(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $category->update($validated);
        return response()->json(['status' => 'success', 'category' => $category]);
    }

    public function deleteCategory($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json(['status' => 'success', 'message' => 'Category deleted successfully']);
    }

    // Sub Category Endpoints
    public function subCategories()
    {
        return response()->json(SubCategory::with('category')->latest()->get());
    }

    public function storeSubCategory(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']) . '-' . time();
        }

        $subCategory = SubCategory::create($validated);
        return response()->json(['status' => 'success', 'sub_category' => $subCategory], 201);
    }

    public function updateSubCategory(Request $request, $id)
    {
        $subCategory = SubCategory::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $subCategory->update($validated);
        return response()->json(['status' => 'success', 'sub_category' => $subCategory]);
    }

    public function deleteSubCategory($id)
    {
        $subCategory = SubCategory::findOrFail($id);
        $subCategory->delete();

        return response()->json(['status' => 'success', 'message' => 'Sub category deleted successfully']);
    }

    // Review Endpoints
    public function reviews()
    {
        return response()->json(Review::with('product')->latest()->get());
    }

    public function storeReview(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'product_id' => 'nullable|exists:products,id',
            'comment' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'status' => 'nullable|in:Approved,Pending,Rejected',
            'image' => 'nullable|string',
        ]);

        if (empty($validated['status'])) {
            $validated['status'] = 'Pending';
        }

        $review = Review::create($validated);
        return response()->json(['status' => 'success', 'review' => $review], 201);
    }

    public function updateReview(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'product_id' => 'nullable|exists:products,id',
            'comment' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'status' => 'required|in:Approved,Pending,Rejected',
            'image' => 'nullable|string',
        ]);

        $review->update($validated);
        return response()->json(['status' => 'success', 'review' => $review]);
    }

    public function deleteReview($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return response()->json(['status' => 'success', 'message' => 'Review deleted successfully']);
    }

    // Attribute Endpoints
    public function attributes()
    {
        return response()->json(Attribute::latest()->get());
    }

    public function storeAttribute(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'values' => 'nullable|array',
            'status' => 'nullable|in:Active,Inactive',
            'image' => 'nullable|string',
        ]);

        if (empty($validated['status'])) {
            $validated['status'] = 'Active';
        }

        $attribute = Attribute::create($validated);
        return response()->json(['status' => 'success', 'attribute' => $attribute], 201);
    }

    public function updateAttribute(Request $request, $id)
    {
        $attribute = Attribute::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'values' => 'nullable|array',
            'status' => 'required|in:Active,Inactive',
            'image' => 'nullable|string',
        ]);

        $attribute->update($validated);
        return response()->json(['status' => 'success', 'attribute' => $attribute]);
    }

    public function deleteAttribute($id)
    {
        $attribute = Attribute::findOrFail($id);
        $attribute->delete();

        return response()->json(['status' => 'success', 'message' => 'Attribute deleted successfully']);
    }

    // Public Product Endpoints
    public function publicProducts()
    {
        return response()->json([
            'status' => 'success',
            'products' => Product::with('category')->latest()->get()
        ]);
    }

    public function getProductBySlug($slug)
    {
        $product = Product::with('category')->where('slug', $slug)->first();

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        }

        // Fetch related products in same category
        $related = Product::where('id', '!=', $product->id)
            ->where('category_id', $product->category_id)
            ->take(4)
            ->get();

        return response()->json([
            'status' => 'success',
            'product' => $product,
            'related_products' => $related
        ]);
    }

    // Product Endpoints
    public function products()
    {
        return response()->json(Product::with('category')->latest()->get());
    }

    public function storeProduct(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug',
            'category_id' => 'nullable|exists:categories,id',
            'price' => 'required|numeric',
            'original_price' => 'nullable|numeric',
            'stock' => 'required|integer',
            'description' => 'nullable|string',
            'main_image' => 'nullable|string',
        ]);

        $product = Product::create($validated);
        return response()->json(['status' => 'success', 'product' => $product], 201);
    }

    public function updateProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug,' . $id,
            'category_id' => 'nullable|exists:categories,id',
            'price' => 'required|numeric',
            'original_price' => 'nullable|numeric',
            'stock' => 'required|integer',
            'description' => 'nullable|string',
            'main_image' => 'nullable|string',
        ]);

        $product->update($validated);
        return response()->json(['status' => 'success', 'product' => $product]);
    }

    public function deleteProduct($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['status' => 'success', 'message' => 'Product deleted successfully']);
    }

    // Order Endpoints
    public function orders()
    {
        return response()->json(Order::with('items')->latest()->get());
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);
        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        return response()->json(['status' => 'success', 'order' => $order]);
    }
}
