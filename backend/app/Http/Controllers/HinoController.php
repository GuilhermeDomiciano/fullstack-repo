<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class HinoController extends Controller
{
    /**
     * Return the Flamengo hymn as JSON.
     *
     * GET /api/hino/flamengo
     */
    public function flamengo(): JsonResponse
    {
        return response()->json([
            'clube'      => 'Flamengo',
            'titulo'     => 'Hino do Flamengo',
            'compositor' => 'Lamartine Babo',
            'estrofes'   => [
                [
                    'versos' => [
                        'Uma vez Flamengo,',
                        'Sempre Flamengo,',
                        'Flamengo sempre eu hei de ser.',
                    ],
                ],
                [
                    'versos' => [
                        'É o meu maior prazer vê-lo brilhar,',
                        'Seja na terra, seja no mar,',
                        'Vencer, vencer, vencer.',
                    ],
                ],
                [
                    'versos' => [
                        'Uma vez Flamengo,',
                        'Flamengo até morrer.',
                    ],
                ],
                [
                    'versos' => [
                        'Na regata ele me mata,',
                        'Me maltrata, me arrebata,',
                        'Que emoção no coração.',
                        'Consagrado no gramado,',
                        'Sempre amado, o mais cotado,',
                        'No Fla-Flu é o "Ai, Jesus!"',
                    ],
                ],
                [
                    'versos' => [
                        'Eu teria um desgosto profundo',
                        'Se faltasse o Flamengo no mundo.',
                        'Ele vibra, ele é fibra,',
                        'Muita libra já pesou.',
                        'Flamengo até morrer eu sou.',
                    ],
                ],
            ],
        ]);
    }
}
