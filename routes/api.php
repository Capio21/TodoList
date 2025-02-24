<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\MyToDoListController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['web'])->group(function () {
    Route::get('/csrf-cookie', function () {
        return response()->json(['csrf_token' => csrf_token()]);
    });
});
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// login / register
Route::post('/register', [AuthController::class, 'register']);

Route::get('/show', [AuthController::class, 'show']);

Route::get('/users', [AuthController::class, 'index']);

Route::get('/users', [AuthController::class, 'getUsers']);



Route::get('/users', [AuthController::class, 'getUsers']);
Route::put('/users/{id}', [AuthController::class, 'updateUser']);
Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);
// delete archive




// Crud routes


Route::get('/tasks', [MyToDoListController::class, 'index']);
Route::post('/tasks', [MyToDoListController::class, 'store']);
Route::get('/tasks/{id}', [MyToDoListController::class, 'show']);
Route::put('/tasks/{id}', [MyToDoListController::class, 'update']);
Route::delete('/tasks/{id}', [MyToDoListController::class, 'destroy']);
Route::put('/tasks/{id}/archive', [MyToDoListController::class, 'archive']);
Route::put('/tasks/{id}/restore', [MyToDoListController::class, 'restore']);

Route::put('/tasks/{id}/archive', [MyToDoListController::class, 'archive']); // Archive task
Route::put('/tasks/{id}/unarchive', [MyToDoListController::class, 'unarchive']); // Unarchive task

Route::put('/tasks/{id}/mark-done', [MyToDoListController::class, 'markAsDone']);


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json($request->user());
});

Route::get('/user', [AuthController::class, 'getUserByToken']);

Route::middleware('auth:sanctum')->post('/update-profile', [AuthController::class, 'updateProfile']);





