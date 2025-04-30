<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'user_id',
        'username',
        'description',
        'time_started',
        'time_ended',
        'deadline',
        'status',
        'tags',
        'visibility',
        'archive',
    ];

    // If you're planning to use custom date formats for time fields, you can add this:
    protected $dates = [
        'time_started',
        'time_ended',
        'deadline',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

}
