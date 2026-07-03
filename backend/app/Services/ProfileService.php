<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ProfileService
{
    public function show(User $user): User
    {
        return $user->load('company');
    }

    public function update(User $user, array $data): User
    {
        $user->update($data);
        return $user->fresh()->load('company');
    }

    public function changePassword(User $user, string $newPassword): void
    {
        $user->update([
            'password' => Hash::make($newPassword),
        ]);
    }
}
