<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    // Customer Auth - Login
    public function loginCustomer(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)
                    ->where('role', 'customer')
                    ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid customer credentials.'],
            ]);
        }

        $token = $user->createToken('customer_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'token' => $token,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
            ]
        ]);
    }

    // Customer Auth - Register
    public function registerCustomer(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->where(function ($query) {
                    return $query->where('role', 'customer');
                }),
            ],
            'phone' => ['required', 'string', 'regex:/^(?:\+88|88)?01[3-9]\d{8}$/'],
            'password' => 'required|string|min:8|confirmed',
        ], [
            'email.unique' => 'This email address is already registered as a customer account.',
            'phone.regex' => 'Please enter a valid 11-digit Bangladeshi mobile number.',
            'password.min' => 'Password must be at least 8 digits long.',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'role' => 'customer',
        ]);

        $token = $user->createToken('customer_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Customer registered successfully!',
            'token' => $token,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
            ]
        ]);
    }

    // Admin Auth - Login
    public function loginAdmin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)
                    ->whereIn('role', ['Super Admin', 'admin'])
                    ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid administrator credentials.'],
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
    public function registerAdmin(Request $request)
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
            'password' => 'required|string|min:8|confirmed',
        ], [
            'email.unique' => 'This email address is already registered as an administrator account.',
            'phone.regex' => 'Please enter a valid 11-digit Bangladeshi mobile number.',
            'password.min' => 'Password must be at least 8 digits long.',
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
        ]);
    }
}
