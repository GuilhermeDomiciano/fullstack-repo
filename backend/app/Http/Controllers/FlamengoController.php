<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class FlamengoController extends Controller
{
    /**
     * Return the complete lyrics of the Hino do Flamengo by Lamartine Babo.
     */
    public function index(): JsonResponse
    {
        $letra = "Meu Flamengo lindo e valente,\n"
            . "Flamengo do meu coração,\n"
            . "Tu és a glória do Brasil,\n"
            . "Salve! Salve! Flamengo...\n"
            . "\n"
            . "Uma vez Flamengo, Flamengo até morrer,\n"
            . "Ser flamenguista é uma glória\n"
            . "Que poucos podem ter.\n"
            . "\n"
            . "Tem uma estrela no céu\n"
            . "Que brilha mais que as outras,\n"
            . "E quando o Flamengo joga\n"
            . "Essa estrela pisca, pisca\n"
            . "Pra dizer que é o mais forte.\n"
            . "\n"
            . "Salve o Flamengo querido,\n"
            . "Campeão dos campeões,\n"
            . "Tua história é tão linda\n"
            . "Que emociona os corações.\n"
            . "\n"
            . "Meu Flamengo lindo e valente,\n"
            . "Flamengo do meu coração,\n"
            . "Tu és a glória do Brasil,\n"
            . "Salve! Salve! Flamengo...";

        return response()->json([
            'nome'  => 'Hino do Flamengo',
            'letra' => $letra,
        ]);
    }
}
