<?php

use App\Http\Controllers\controladorBecas;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('consulta');
});


Route::group(['prefix' => '/func',], function () {
    /* Plataforma */
    Route::post('consultar', [controladorBecas::class, 'consultaBeca']);
});
