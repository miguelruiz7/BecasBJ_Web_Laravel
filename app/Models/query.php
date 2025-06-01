<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class query extends Model
{
    protected $table = 'queries';
    protected $primaryKey = 'query_id';
    protected $keyType = 'string';
    public $timestamps = false;
}
