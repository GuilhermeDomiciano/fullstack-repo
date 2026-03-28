<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class FlamengoAnthemController extends Controller
{
    /**
     * Return the title and full lyrics of the Flamengo anthem (Lamartine Babo).
     * Data is hardcoded — no database required.
     */
    public function show(): JsonResponse
    {
        $lyrics = implode("\n", [
            'Uma vez Flamengo,',
            'Sempre Flamengo,',
            'Flamengo sempre eu hei de ser.',
            '',
            'E o meu maior prazer ve-lo brilhar,',
            'Seja na terra, seja no mar,',
            'Vencer, vencer, vencer.',
            '',
            'Uma vez Flamengo,',
            'Flamengo ate morrer.',
            '',
            'Na regata ele me mata,',
            'Me maltrata, me arrebata,',
            'Que emocao no coracao.',
            'Consagrado no gramado,',
            'Sempre amado, o mais cotado,',
            'No Fla-Flu e o "Ai, Jesus!"',
            '',
            'Eu teria um desgosto profundo',
            'Se faltasse o Flamengo no mundo.',
            'Ele vibra, ele e fibra,',
            'Muita libra ja pesou.',
            'Flamengo ate morrer eu sou.',
        ]);

        return response()->json([
            'title'  => 'Hino do Flamengo',
            'lyrics' => $lyrics,
        ]);
    }
}
