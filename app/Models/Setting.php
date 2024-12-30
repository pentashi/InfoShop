<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Settings
 * @package App\Models
 */

class Setting extends Model
{
    use HasFactory;

    protected $fillable = ['meta_value', 'meta_value'];
}
