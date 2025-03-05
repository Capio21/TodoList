<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Notification;

class NotificationController extends Controller
{
    // Get notifications for a user
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $notifications = Notification::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }

    public function getUserNotifications(Request $request)
    {
        // Get the authToken from the query parameters
        $token = $request->query('authToken');
    
        if (!$token) {
            return response()->json(['error' => 'Unauthorized: No Token Provided'], 401);
        }
    
        // Find the user by the authToken
        $user = User::where('authToken', $token)->first();
    
        if (!$user) {
            return response()->json(['error' => 'Unauthorized: Invalid Token'], 401);
        }
    
        // Fetch notifications based on the user's id
        $notifications = Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();
    
        return response()->json([
            'message' => 'Notifications fetched successfully',
            'notifications' => $notifications
        ]);
    }


    // Mark a single notification as read
    public function markAsRead($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['status' => 'read']);

        return response()->json(['message' => 'Notification marked as read']);
    }

    // Mark all notifications as read for the user
    public function markAllAsRead() {
        Notification::where('status', 'unread')->update(['status' => 'read']);

        return response()->json(['message' => 'All notifications marked as read']);
    }
}
