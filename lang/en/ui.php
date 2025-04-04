<?php

return [
    'messages' => [
        'zones' => [
            'error' => 'El numero de la zona en ese piso esta ya en uso. Introduzca otra.',
        ]
        ],
    'navigation' => [
        'menu' => 'Navigation Menu',
        'items' => [
            'dashboard' => 'Dashboard',
            'users' => 'Users',
            'floors' => 'Floors',
            'repository' => 'Repository',
            'documentation' => 'Documentation',
        ],
    ],
    'roles' => [
        'principal' => 'Principal Rol',
        'roles' => 'Roles',
        'select' => 'Select a role',
        'admin' => 'Admin',
        'user' => 'User',
        'info' => 'The role determines the users overall access level',
    ],
    'genres' => [
        'principal' => 'Main Genre',
        'roles' => 'Genres',
        'select' => 'Select a genre',
        'fiction' => 'Fiction',
        'mystery' => 'Mystery',
        'thriller' => 'Thriller',
        'scienceFiction' => 'Science Fiction',
        'fantasy' => 'Fantasy',
        'romance' => 'Romance',
        'historical' => 'Historical',
        'nonFiction' => 'Non-Fiction',
        'biography' => 'Biography',
        'horror' => 'Horror',
        'info' => 'Select a genre to categorize the content',
    ],

    'permissions' => [
        'users' => [
            'users' => 'Users',
            'view' => 'View users',
            'create' => 'Create users',
            'edit' => 'Edit users',
            'delete' => 'Delete users',
        ],
        'product' => [
            'product' => 'Products',
            'view' => 'View products',
            'create' => 'Create products',
            'edit' => 'Edit products',
            'delete' => 'Delete products',
        ],
        'report' => [
            'report' => 'Reports',
            'view' => 'View reports',
            'export' => 'Export reports',
            'print' => 'Print reports',
        ],
        'settings' => [
            'settings' => 'Settings',
            'access' => 'Access to the settings',
            'modify' => 'Modify settings',
        ],
        

    ],
    'info' => [
    'create' => 'Create New User',
    'edit' => 'Edit User',
    'info' => 'Enter the information to create a new user in the system',
    ],
    'user_menu' => [
        'settings' => 'Settings',
        'logout' => 'Log out',
    ],
    'auth' => [
        'failed' => 'These credentials do not match our records.',
        'throttle' => 'Too many login attempts. Please try again in :seconds seconds.',
    ],
    'settings' => [
        'title' => 'Settings',
        'description' => 'Manage your profile and account settings',
        'navigation' => [
            'profile' => 'Profile',
            'password' => 'Password',
            'appearance' => 'Appearance',
            'languages' => 'Languages',
        ],
        'profile' => [
            'title' => 'Profile settings',
            'information_title' => 'Profile information',
            'information_description' => 'Update your name and email address',
            'name_label' => 'Name',
            'name_placeholder' => 'Full name',
            'email_label' => 'Email address',
            'email_placeholder' => 'Email address',
            'unverified_email' => 'Your email address is unverified.',
            'resend_verification' => 'Click here to resend the verification email.',
            'verification_sent' => 'A new verification link has been sent to your email address.',
            'save_button' => 'Save',
            'saved_message' => 'Saved',
        ],
        'password' => [
            'title' => 'Password settings',
            'update_title' => 'Update password',
            'update_description' => 'Ensure your account is using a long, random password to stay secure',
            'current_password_label' => 'Current password',
            'current_password_placeholder' => 'Current password',
            'new_password_label' => 'New password',
            'new_password_placeholder' => 'New password',
            'confirm_password_label' => 'Confirm password',
            'confirm_password_placeholder' => 'Confirm password',
            'save_button' => 'Save password',
            'saved_message' => 'Saved',
        ],'tabs' => [
            'basic' => 'Basic Information',
            'roles' => 'Roles and Permissions',
        ],
        'appearance' => [
            'title' => 'Appearance settings',
            'description' => 'Update your account\'s appearance settings',
            'modes' => [
                'light' => 'Light',
                'dark' => 'Dark',
                'system' => 'System'
            ]
        ],
        'languages' => [
            'title' => 'Language settings',
            'description' => 'Change your preferred language',
        ],
    ],
    'validation' => [
           'required' => 'The :attribute field is required.',
            'email' => 'The :attribute field must be a valid email address.',
            'min' => [
                'string' => 'The :attribute field must be at least :min characters.',
            ],
            'max' => [
                'string' => 'The :attribute field must not be greater than :max characters.',
            ],
            'unique' => 'The :attribute has already been taken.',
            'confirmed' => 'The :attribute confirmation does not match.',
    ],
    'common' => [
        'buttons' => [
            'cancel' => 'Cancel',
            'delete' => 'Delete',
            'close' => 'Close',
        ],
        'filters'=> [
            'title' => 'Filters',
            'clear' => 'Clear',
        ],
        'delete_dialog' => [
            'success' => 'User deleted successfully',
        ],
        'showing_results' => 'Showing :from to :to of :total results',
        'pagination' => [
            'previous' => 'Previous',
            'next' => 'Next',
            'first' => 'First',
            'last' => 'Last',
        ],
        'per_page' => 'Per page',
        'no_results' => 'No results',
    ],
        'floors' => [
        'floor' => 'Floor',
        'nZonas' => 'Number of Zones',
        'ocupedZones' => 'Occupied Zones',
        'freeZones' => 'Free Zones',
        'floorZones' => 'Floor Zones',
        'noZones' => 'There are no zones on this floor',
        'title' => 'Floors',
        'create' => 'Create Floor',
        'edit' => 'Edit Floor',
        'delete' => 'Delete Floor',
        'locations' => [
            'buildingALeftWing' => 'Building A, Left Wing',
            'buildingARightWing' => 'Building A, Right Wing',
            'buildingBLeftWing' => 'Building B, Left Wing',
            'buildingBRightWing' => 'Building B, Right Wing',
            'buildingCCenter' => 'Building C, Center',
            'buildingDWestWing' => 'Building D, West Wing',
            'buildingEEastWing' => 'Building E, East Wing',
            'buildingFUpperDeck' => 'Building F, Upper Deck',
            'buildingGLowerDeck' => 'Building G, Lower Deck',
            'info' => 'Select a building location',
        ],
    ],

    'users' => [
        'title' => 'Users',
        'create' => 'Create User',
        'edit' => 'Edit User',
        'fields' => [
            'name' => 'Name',
            'email' => 'Email',
            'password' => 'Password',
            'password_optional' => 'Password (optional)',
            'created_at' => 'Created at',
            'actions' => 'Actions',
        ],
        'columns' => [
            'name' => 'Name',
            'email' => 'Email',
            'created_at' => 'Created at',
            'actions' => 'Actions',
        ],
        'filters' => [
            'search' => 'Search',
            'name' => 'User name',
            'email' => 'User email',
        ],
        'placeholders' => [
            'name' => 'User name',
            'email' => 'User email',
            'password' => 'User password',
            'search' => 'Search users...',
        ],
        'buttons' => [
            'new' => 'New User',
            'edit' => 'Edit',
            'save' => 'Save',
            'update' => 'Update',
            'cancel' => 'Cancel',
            'delete' => 'Delete',
            'deleting' => 'Deleting...',
            'saving' => 'Saving...',
            'retry' => 'Retry',
        ],
        'delete' => [
            'title' => 'Are you sure?',
            'description' => 'This action cannot be undone. The user will be permanently deleted from the system.',
        ],
        'delete_dialog' => [
            'title' => 'Are you sure?',
            'description' => 'This action cannot be undone. The user will be permanently deleted from the system.',
            'success' => 'Successfully deleted ;)',
        ],
        'deleted_error' => 'Error deleting user',
        'no_results' => 'No results.',
        'error_loading' => 'Error loading users. Please try again.',
        'showing_results' => 'Showing :from to :to of :total results',
        'pagination' => [
            'previous' => 'Previous',
            'next' => 'Next',
        ],
        
    ],
    
];
