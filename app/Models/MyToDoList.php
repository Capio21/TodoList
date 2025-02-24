<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MyToDoList extends Model
{
    use HasFactory;

    protected $fillable = [
        'mytodolist_title',
        'description',
        'time',
        'date',
        'status',
        'archived',
        'user_id',
    ];
}
