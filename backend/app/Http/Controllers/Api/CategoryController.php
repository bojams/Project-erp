<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    use ApiResponseTrait;

    public function list(Request $request): JsonResponse
    {
        $categories = Category::where('company_id', $request->user()->company_id)
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return $this->successResponse(CategoryResource::collection($categories));
    }
}
