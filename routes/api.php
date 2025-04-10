<?php

use App\Bookshelf\Controllers\Api\BookshelfApiController;
use App\Book\Controllers\Api\BookApiController;
use App\Users\Controllers\Api\UserApiController;
use App\Floor\Controllers\Api\FloorApiController;
use App\Loan\Controllers\Api\LoanApiController;
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

// import * as React from "react"
// import * as PopoverPrimitive from "@radix-ui/react-popover"

// import { cn } from "@/lib/utils"

// function Popover({
//   ...props
// }: React.ComponentProps<typeof PopoverPrimitive.Root>) {
//   return <PopoverPrimitive.Root data-slot="popover" {...props} />
// }

// function PopoverTrigger({
//   ...props
// }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
//   return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
// }

// function PopoverContent({
//   className,
//   align = "center",
//   sideOffset = 4,
//   ...props
// }: React.ComponentProps<typeof PopoverPrimitive.Content>) {
//   return (
//     <PopoverPrimitive.Portal>
//       <PopoverPrimitive.Content
//         data-slot="popover-content"
//         align={align}
//         sideOffset={sideOffset}
//         className={cn(
//           "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md outline-hidden",
//           className
//         )}
//         {...props}
//       />
//     </PopoverPrimitive.Portal>
//   )
// }

// function PopoverAnchor({
//   ...props
// }: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
//   return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
// }

// export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
