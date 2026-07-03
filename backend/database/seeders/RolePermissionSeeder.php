<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'users.view', 'users.create', 'users.edit', 'users.delete',
            'roles.view', 'roles.create', 'roles.edit', 'roles.delete',
            'companies.view', 'companies.edit',
            'categories.view', 'categories.create', 'categories.edit', 'categories.delete',
            'units.view', 'units.create', 'units.edit', 'units.delete',
            'products.view', 'products.create', 'products.edit', 'products.delete',
            'suppliers.view', 'suppliers.create', 'suppliers.edit', 'suppliers.delete',
            'customers.view', 'customers.create', 'customers.edit', 'customers.delete',
            'purchases.view', 'purchases.create', 'purchases.edit', 'purchases.delete', 'purchases.approve',
            'sales.view', 'sales.create', 'sales.edit', 'sales.delete',
            'stock.view', 'stock.create', 'stock.edit', 'stock.delete',
            'expenses.view', 'expenses.create', 'expenses.edit', 'expenses.delete',
            'expense_categories.view', 'expense_categories.create', 'expense_categories.edit', 'expense_categories.delete',
            'reports.view',
            'settings.view', 'settings.edit',
            'activity_logs.view',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'web']);
        }

        $superAdmin = Role::create(['name' => 'super_admin', 'guard_name' => 'web']);
        $superAdmin->givePermissionTo(Permission::all());

        $owner = Role::create(['name' => 'owner', 'guard_name' => 'web']);
        $owner->givePermissionTo([
            'users.view', 'users.create', 'users.edit', 'users.delete',
            'categories.view', 'categories.create', 'categories.edit', 'categories.delete',
            'units.view', 'units.create', 'units.edit', 'units.delete',
            'products.view', 'products.create', 'products.edit', 'products.delete',
            'suppliers.view', 'suppliers.create', 'suppliers.edit', 'suppliers.delete',
            'customers.view', 'customers.create', 'customers.edit', 'customers.delete',
            'purchases.view', 'purchases.create', 'purchases.edit', 'purchases.delete', 'purchases.approve',
            'sales.view', 'sales.create', 'sales.edit', 'sales.delete',
            'stock.view', 'stock.create', 'stock.edit', 'stock.delete',
            'expenses.view', 'expenses.create', 'expenses.edit', 'expenses.delete',
            'expense_categories.view', 'expense_categories.create', 'expense_categories.edit', 'expense_categories.delete',
            'reports.view',
            'settings.view', 'settings.edit',
            'activity_logs.view',
        ]);

        $manager = Role::create(['name' => 'manager', 'guard_name' => 'web']);
        $manager->givePermissionTo([
            'categories.view', 'categories.create', 'categories.edit',
            'units.view',
            'products.view', 'products.create', 'products.edit',
            'suppliers.view',
            'customers.view', 'customers.create', 'customers.edit',
            'purchases.view', 'purchases.create', 'purchases.edit',
            'sales.view', 'sales.create', 'sales.edit',
            'stock.view',
            'expenses.view', 'expenses.create', 'expenses.edit',
            'expense_categories.view',
            'reports.view',
        ]);

        $staff = Role::create(['name' => 'staff', 'guard_name' => 'web']);
        $staff->givePermissionTo([
            'categories.view',
            'units.view',
            'products.view',
            'suppliers.view',
            'customers.view', 'customers.create',
            'purchases.view', 'purchases.create',
            'sales.view', 'sales.create',
            'stock.view',
            'expenses.view', 'expenses.create',
            'expense_categories.view',
        ]);

        $superAdminUser = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@hideo.com',
            'password' => bcrypt('password'),
            'is_active' => true,
        ]);
        $superAdminUser->assignRole('super_admin');
    }
}
