<?php

namespace App\Services;

use App\Exceptions\BusinessException;
use App\Models\LoginLog;
use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function login(array $credentials, Request $request): array
    {
        $user = User::with('company')->where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            $this->logLoginAttempt(null, $request, false, 'Invalid credentials');
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        if (!$user->is_active) {
            $this->logLoginAttempt($user, $request, false, 'Account deactivated');
            throw new BusinessException(__('auth.inactive'));
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        $user->update(['last_login_at' => now()]);

        $this->logLoginAttempt($user, $request, true);

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function logout(User $user, Request $request): void
    {
        $request->user()->currentAccessToken()->delete();
    }

    public function sendResetLinkEmail(string $email): string
    {
        $status = Password::sendResetLink(['email' => $email]);

        if ($status !== Password::RESET_LINK_SENT) {
            throw new BusinessException(__($status));
        }

        return __($status);
    }

    public function resetPassword(array $credentials): string
    {
        $status = Password::reset(
            $credentials,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw new BusinessException(__($status));
        }

        return __($status);
    }

    private function logLoginAttempt(?User $user, Request $request, bool $success, ?string $reason = null): void
    {
        LoginLog::create([
            'user_id' => $user?->id,
            'company_id' => $user?->company_id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'event' => $success ? 'login' : 'failed',
            'success' => $success,
            'failure_reason' => $reason,
        ]);
    }
}
