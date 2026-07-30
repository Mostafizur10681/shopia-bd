<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Category;
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
        return response()->json(Category::with('children')->get());
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories,slug',
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
        ]);

        $category = Category::create($validated);
        return response()->json(['status' => 'success', 'category' => $category]);
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
        return response()->json(['status' => 'success', 'product' => $product]);
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
