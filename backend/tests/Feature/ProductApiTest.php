<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Company;
use App\Models\Product;
use App\Models\Unit;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Company $company;
    private Category $category;
    private Unit $unit;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->company = Company::factory()->create();
        $this->user = User::factory()->create(['company_id' => $this->company->id]);
        $this->user->assignRole('super_admin');
        $this->category = Category::factory()->create(['company_id' => $this->company->id]);
        $this->unit = Unit::factory()->create(['company_id' => $this->company->id]);
    }

    public function test_can_create_product(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/products', [
                'name' => 'Test Product',
                'sku' => 'TEST-001',
                'unit_id' => $this->unit->id,
                'category_id' => $this->category->id,
                'purchase_price' => 10000,
                'selling_price' => 15000,
                'stock' => 50,
                'stock_minimum' => 5,
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Test Product',
                    'stock' => 50,
                    'stock_minimum' => 5,
                ],
            ]);
    }

    public function test_can_update_product(): void
    {
        $product = Product::create([
            'company_id' => $this->company->id,
            'category_id' => $this->category->id,
            'unit_id' => $this->unit->id,
            'name' => 'Original',
            'sku' => 'TEST-002',
            'purchase_price' => 10000,
            'selling_price' => 15000,
            'stock' => 10,
            'stock_minimum' => 2,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->putJson("/api/products/{$product->id}", [
                'name' => 'Updated',
                'sku' => 'TEST-002',
                'unit_id' => $this->unit->id,
                'purchase_price' => 12000,
                'selling_price' => 18000,
                'stock' => 100,
                'stock_minimum' => 3,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Updated',
                    'stock' => 100,
                    'stock_minimum' => 3,
                ],
            ]);
    }

    public function test_create_product_without_stock_defaults_to_zero(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/products', [
                'name' => 'No Stock',
                'sku' => 'TEST-003',
                'unit_id' => $this->unit->id,
                'purchase_price' => 5000,
                'selling_price' => 7500,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.stock', 0);
    }

    public function test_update_with_method_spoofing_via_post(): void
    {
        $product = Product::create([
            'company_id' => $this->company->id,
            'category_id' => $this->category->id,
            'unit_id' => $this->unit->id,
            'name' => 'Original',
            'sku' => 'TEST-004',
            'purchase_price' => 10000,
            'selling_price' => 15000,
            'stock' => 10,
            'stock_minimum' => 2,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->post("/api/products/{$product->id}", [
                '_method' => 'PUT',
                'name' => 'Updated via Spoof',
                'sku' => 'TEST-004',
                'unit_id' => $this->unit->id,
                'purchase_price' => 12000,
                'selling_price' => 18000,
                'stock' => 75,
                'stock_minimum' => 5,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Updated via Spoof',
                    'stock' => 75,
                ],
            ]);
    }
}
