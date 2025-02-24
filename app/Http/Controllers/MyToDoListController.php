<?php

namespace App\Http\Controllers;

use App\Models\MyToDoList;
use Illuminate\Http\Request;

class MyToDoListController extends Controller
{
    public function index()
    {
        return response()->json(MyToDoList::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'mytodolist_title' => 'required|string',
            'time' => 'required',
            'date' => 'required',
        ]);

        $task = MyToDoList::create($request->all());
        return response()->json($task, 201);
    }

    public function show($id)
    {
        $task = MyToDoList::findOrFail($id);
        return response()->json($task);
    }

    public function update(Request $request, $id)
    {
        $task = MyToDoList::findOrFail($id);
        $task->update($request->all());
        return response()->json($task);
    }

    public function destroy($id)
    {
        $task = MyToDoList::findOrFail($id);
        $task->delete();
        return response()->json(null, 204);
    }

   
    public function archive($id)
    {
        $task = MyToDoList::find($id);
        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }
        $task->archived = true;
        $task->save();

        return response()->json(['message' => 'Task archived successfully']);
    }

    // Unarchive Task
    public function unarchive($id)
    {
        $task = MyToDoList::find($id);
        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }
        $task->archived = false;
        $task->save();

        return response()->json(['message' => 'Task unarchived successfully']);
    }

    public function markAsDone($id)
{
    $task = MyToDoList::find($id);
    if (!$task) {
        return response()->json(['message' => 'Task not found'], 404);
    }

    $task->status = 'done';
    $task->save();

    return response()->json(['message' => 'Task marked as done', 'task' => $task]);
}




}

