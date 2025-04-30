<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('users', \App\Users\Controllers\UserController::class);
    Route::resource('floors', \App\Floor\Controllers\FloorsController::class);
    Route::resource('zones', \App\Zone\Controllers\ZonesController::class);
    Route::resource('bookshelves', \App\Bookshelf\Controllers\BookshelvesController::class);
    Route::resource('books', \App\Book\Controllers\BooksController::class);
    Route::resource('loans', \App\Loan\Controllers\LoansController::class);
    Route::resource('reservations', \App\Reservation\Controllers\ReservationsController::class);
    Route::resource('timelines', \App\Timeline\TimelineController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
