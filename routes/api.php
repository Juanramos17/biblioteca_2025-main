<?php

use App\Bookshelf\Controllers\Api\BookshelfApiController;
use App\Book\Controllers\Api\BookApiController;
use App\Timeline\Controllers\Api\TimelineApiController;
use App\Users\Controllers\Api\UserApiController;
use App\Floor\Controllers\Api\FloorApiController;
use App\Loan\Controllers\Api\LoanApiController;
use App\Reservation\Controllers\Api\ReservationApiController;
use App\Timeline\TimelineController;
use App\Zone\Controllers\Api\ZoneApiController;
use Illuminate\Support\Facades\Route;



Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/users', [UserApiController::class, 'index']);
    Route::get('/users/{user}', [UserApiController::class, 'show']);
    Route::post('/users', [UserApiController::class, 'store']);
    Route::put('/users/{user}', [UserApiController::class, 'update']);
    Route::delete('/users/{user}', [UserApiController::class, 'destroy']);
});

Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/floors', [FloorApiController::class, 'index']);
    Route::get('/floors/{floor}', [FloorApiController::class, 'show']);
    Route::post('/floors', [FloorApiController::class, 'store']);
    Route::put('/floors/{floor}', [FloorApiController::class, 'update']);
    Route::delete('/floors/{floor}', [FloorApiController::class, 'destroy']);
});

Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/zones', [ZoneApiController::class, 'index']);
    Route::get('/zones/{zone}', [ZoneApiController::class, 'show']);
    Route::post('/zones', [ZoneApiController::class, 'store']);
    Route::put('/zones/{zone}', [ZoneApiController::class, 'update']);
    Route::delete('/zones/{zone}', [ZoneApiController::class, 'destroy']);
});

Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/bookshelves', [BookshelfApiController::class, 'index']);
    Route::get('/bookshelves/{bookshelf}', [BookshelfApiController::class, 'show']);
    Route::post('/bookshelves', [BookshelfApiController::class, 'store']);
    Route::put('/bookshelves/{bookshelf}', [BookshelfApiController::class, 'update']);
    Route::delete('/bookshelves/{bookshelf}', [BookshelfApiController::class, 'destroy']);
});

Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/books', [BookApiController::class, 'index']);
    Route::get('/books/{book}', [BookApiController::class, 'show']);
    Route::post('/books', [BookApiController::class, 'store']);
    Route::put('/books/{book}', [BookApiController::class, 'update']);
    Route::delete('/books/{book}', [BookApiController::class, 'destroy']);
});

Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/loans', [LoanApiController::class, 'index']);
    Route::get('/loans/{loan}', [LoanApiController::class, 'show']);
    Route::post('/loans', [LoanApiController::class, 'store']);
    Route::put('/loans/{loan}', [LoanApiController::class, 'update']);
    Route::delete('/loans/{loan}', [LoanApiController::class, 'destroy']);
});

Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/reservations', [ReservationApiController::class, 'index']);
    Route::get('/reservations/{reservation}', [ReservationApiController::class, 'show']);
    Route::post('/reservations', [ReservationApiController::class, 'store']);
    Route::put('/reservations/{reservation}', [ReservationApiController::class, 'update']);
    Route::delete('/reservations/{reservation}', [ReservationApiController::class, 'destroy']);
});

Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/timelines', [TimelineApiController::class, 'index']);
});

