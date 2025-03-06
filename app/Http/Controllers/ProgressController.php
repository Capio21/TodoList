<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Progress;

class ProgressController extends Controller {
    // Fetch all tasks
    public function index() {
        return response()->json(Progress::all());
    }

    // Create a new task
    public function store(Request $request) {
        $task = Progress::create($request->all());
        return response()->json($task);
    }

    // Update task completion status
    public function update(Request $request, Progress $progress) {
        $progress->update(['completed' => $request->completed]);
        return response()->json($progress);
    }

    // Delete a task
    public function destroy(Progress $progress) {
        $progress->delete();
        return response()->json(['message' => 'Task deleted']);
    }
}
