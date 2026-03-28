<?php

namespace App\Http\Controllers;

class MathController extends Controller
{
    public function sum(): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'operands' => [60, 9],
            'result'   => 60 + 9,
        ]);
    }
}
