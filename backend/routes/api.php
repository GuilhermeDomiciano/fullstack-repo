<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\InviteController;
use App\Http\Controllers\WorkspaceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Authentication routes (public) apply rate limiting to mitigate
| brute-force attacks (throttle: 6 attempts per minute per IP).
|
*/

// Public authentication routes
Route::middleware('throttle:6,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// Protected routes (require a valid Sanctum token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user',    [AuthController::class, 'user']);

    // Workspaces
    Route::get('/workspaces',                                        [WorkspaceController::class, 'index']);
    Route::post('/workspaces',                                       [WorkspaceController::class, 'store']);
    Route::get('/workspaces/{id}',                                   [WorkspaceController::class, 'show']);
    Route::delete('/workspaces/{workspaceId}/members/{userId}',      [WorkspaceController::class, 'removeMember']);

    // Invites
    Route::post('/workspaces/{id}/invites',  [InviteController::class, 'store']);
    Route::post('/invites/accept/{token}',   [InviteController::class, 'accept']);
});
