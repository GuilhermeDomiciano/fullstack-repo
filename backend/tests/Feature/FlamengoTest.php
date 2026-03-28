<?php

namespace Tests\Feature;

use Tests\TestCase;

class FlamengoTest extends TestCase
{
    // -------------------------------------------------------------------------
    // GET /api/flamengo
    // -------------------------------------------------------------------------

    public function test_get_flamengo_returns_200(): void
    {
        $response = $this->getJson('/api/flamengo');

        $response->assertStatus(200);
    }

    public function test_get_flamengo_returns_correct_json_structure(): void
    {
        $response = $this->getJson('/api/flamengo');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'nome',
                'letra',
            ]);
    }

    public function test_get_flamengo_nome_is_correct_string(): void
    {
        $response = $this->getJson('/api/flamengo');

        $response->assertStatus(200)
            ->assertJson([
                'nome' => 'Hino do Flamengo',
            ]);
    }

    public function test_get_flamengo_letra_is_a_multiline_string(): void
    {
        $response = $this->getJson('/api/flamengo');

        $response->assertStatus(200);

        $letra = $response->json('letra');

        $this->assertIsString($letra);
        $this->assertStringContainsString("\n", $letra, 'A letra deve conter quebras de linha.');
    }

    public function test_get_flamengo_is_accessible_without_authentication(): void
    {
        // No Authorization header — endpoint must be public
        $response = $this->getJson('/api/flamengo');

        $response->assertStatus(200);
    }
}
