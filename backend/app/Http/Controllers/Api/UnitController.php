<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UnitResource;
use App\Models\Unit;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    use ApiResponseTrait;

    public function list(Request $request): JsonResponse
    {
        $units = Unit::where('company_id', $request->user()->company_id)
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return $this->successResponse(UnitResource::collection($units));
    }
}
