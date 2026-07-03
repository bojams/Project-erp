<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    public function view(User $user, Product $product): bool
    {
        return $user->company_id === $product->company_id;
    }

    public function create(User $user): bool
    {
        return $user->can('products.create');
    }

    public function update(User $user, Product $product): bool
    {
        return $user->company_id === $product->company_id && $user->can('products.edit');
    }

    public function delete(User $user, Product $product): bool
    {
        return $user->company_id === $product->company_id && $user->can('products.delete');
    }
}
