<?php

namespace Database\Seeders;

use Domain\Loans\Model\Loan;
use Illuminate\Database\Seeder;

class LoanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        Loan::factory()->count(10)->create();
    }
}
