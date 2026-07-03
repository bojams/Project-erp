<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Company;
use App\Models\ExpenseCategory;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $superAdmin = User::where('email', 'superadmin@hideo.com')->first();

        $company = Company::create([
            'name' => 'Hideo Demo Store',
            'address' => 'Jl. Merdeka No. 1, Jakarta',
            'phone' => '021-12345678',
            'email' => 'demo@hideo.com',
            'currency' => 'IDR',
            'timezone' => 'Asia/Jakarta',
            'date_format' => 'd/m/Y',
            'low_stock_threshold' => 5,
            'is_active' => true,
            'created_by' => $superAdmin?->id,
        ]);

        $superAdmin?->update(['company_id' => $company->id]);

        $owner = User::factory()->create([
            'name' => 'Demo Owner',
            'email' => 'owner@hideo.com',
            'password' => bcrypt('password'),
            'company_id' => $company->id,
            'is_active' => true,
            'created_by' => $superAdmin?->id,
        ]);
        $owner->assignRole('owner');

        $manager = User::factory()->create([
            'name' => 'Demo Manager',
            'email' => 'manager@hideo.com',
            'password' => bcrypt('password'),
            'company_id' => $company->id,
            'is_active' => true,
            'created_by' => $owner->id,
        ]);
        $manager->assignRole('manager');

        $staff = User::factory()->create([
            'name' => 'Demo Staff',
            'email' => 'staff@hideo.com',
            'password' => bcrypt('password'),
            'company_id' => $company->id,
            'is_active' => true,
            'created_by' => $manager->id,
        ]);
        $staff->assignRole('staff');

        Category::insert([
            ['company_id' => $company->id, 'name' => 'Makanan', 'slug' => 'makanan', 'is_active' => true, 'created_by' => $owner->id],
            ['company_id' => $company->id, 'name' => 'Minuman', 'slug' => 'minuman', 'is_active' => true, 'created_by' => $owner->id],
            ['company_id' => $company->id, 'name' => 'Elektronik', 'slug' => 'elektronik', 'is_active' => true, 'created_by' => $owner->id],
            ['company_id' => $company->id, 'name' => 'Pakaian', 'slug' => 'pakaian', 'is_active' => true, 'created_by' => $owner->id],
        ]);

        Unit::insert([
            ['company_id' => $company->id, 'name' => 'Pieces', 'short_code' => 'pcs', 'is_active' => true, 'created_by' => $owner->id],
            ['company_id' => $company->id, 'name' => 'Kilogram', 'short_code' => 'kg', 'is_active' => true, 'created_by' => $owner->id],
            ['company_id' => $company->id, 'name' => 'Liter', 'short_code' => 'L', 'is_active' => true, 'created_by' => $owner->id],
            ['company_id' => $company->id, 'name' => 'Box', 'short_code' => 'box', 'is_active' => true, 'created_by' => $owner->id],
        ]);

        ExpenseCategory::insert([
            ['company_id' => $company->id, 'name' => 'Sewa', 'slug' => 'sewa', 'is_active' => true, 'created_by' => $owner->id],
            ['company_id' => $company->id, 'name' => 'Listrik & Air', 'slug' => 'listrik-air', 'is_active' => true, 'created_by' => $owner->id],
            ['company_id' => $company->id, 'name' => 'Gaji Karyawan', 'slug' => 'gaji-karyawan', 'is_active' => true, 'created_by' => $owner->id],
            ['company_id' => $company->id, 'name' => 'Operasional', 'slug' => 'operasional', 'is_active' => true, 'created_by' => $owner->id],
            ['company_id' => $company->id, 'name' => 'Marketing', 'slug' => 'marketing', 'is_active' => true, 'created_by' => $owner->id],
        ]);
    }
}
