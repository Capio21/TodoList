<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ActivityController extends Controller
{
    // Fetch all activities (including filtering by status)
    public function index(Request $request)
    {
        $query = Activity::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->get(), 200);
    }

    // Store a new activity
    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'date_started' => 'required|date',
        'due_date' => 'required|date|after_or_equal:date_started',
        'tags' => 'nullable|string',
        'status' => 'required|in:pending,complete,overdue',
        'archive' => 'boolean',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $activity = Activity::create($request->all());
    return response()->json($activity, 201);
}


    // Show a single activity
    public function show($id)
    {
        try {
            $activity = Activity::findOrFail($id);
            return response()->json($activity, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Activity not found'], 404);
        }
    }

    // Update an existing activity
    public function update(Request $request, $id)
    {
        try {
            $activity = Activity::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'date_started' => 'sometimes|required|date',
                'due_date' => 'sometimes|required|date|after_or_equal:date_started',
                'tags' => 'nullable|string',
                'status' => 'sometimes|required|in:pending,complete,overdue',
                'archive' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $activity->update($request->all());
            return response()->json($activity, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Activity not found or failed to update'], 500);
        }
    }

    // Delete an activity
    public function destroy($id)
    {
        try {
            $activity = Activity::findOrFail($id);
            $activity->delete();
            return response()->json(['message' => 'Activity deleted'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Activity not found or failed to delete'], 500);
        }
    }

    // Archive an activity
    public function archive($id, Request $request)
    {
        $activity = Activity::findOrFail($id);
        $activity->archive = $request->archive;
        $activity->save();
    
        return response()->json(['message' => 'Activity archive status updated successfully!', 'activity' => $activity]);
    }
    

    // Unarchive an activity
    public function unarchive($id)
    {
        try {
            $activity = Activity::findOrFail($id);
            $activity->update(['archive' => false]);
            return response()->json(['message' => 'Activity unarchived successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Activity not found or failed to unarchive'], 500);
        }
    }
}
