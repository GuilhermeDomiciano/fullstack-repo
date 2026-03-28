<?php

namespace Tests\Feature;

use Tests\TestCase;

class FlamengoAnthemTest extends TestCase
{
    // -------------------------------------------------------------------------
    // GET /api/flamengo-anthem
    // -------------------------------------------------------------------------

    public function test_flamengo_anthem_returns_http_200(): void
    {
        $response = $this->getJson('/api/flamengo-anthem');

        $response->assertStatus(200);
    }

    public function test_flamengo_anthem_returns_json_content_type(): void
    {
        $response = $this->getJson('/api/flamengo-anthem');

        $response->assertHeader('Content-Type', 'application/json');
    }

    public function test_flamengo_anthem_response_has_title_and_lyrics_keys(): void
    {
        $response = $this->getJson('/api/flamengo-anthem');

        $response->assertJsonStructure(['title', 'lyrics']);
    }

    public function test_flamengo_anthem_title_is_non_empty_string(): void
    {
        $response = $this->getJson('/api/flamengo-anthem');

        $data = $response->json();

        $this->assertIsString($data['title']);
        $this->assertNotEmpty($data['title']);
    }

    public function test_flamengo_anthem_lyrics_is_non_empty_string(): void
    {
        $response = $this->getJson('/api/flamengo-anthem');

        $data = $response->json();

        $this->assertIsString($data['lyrics']);
        $this->assertNotEmpty($data['lyrics']);
    }

    public function test_flamengo_anthem_is_accessible_without_authentication_token(): void
    {
        // Explicitly send request without any Authorization header
        $response = $this->getJson('/api/flamengo-anthem');

        $response->assertStatus(200);
    }

    public function test_flamengo_anthem_returns_correct_title(): void
    {
        $response = $this->getJson('/api/flamengo-anthem');

        $response->assertJson(['title' => 'Hino do Flamengo']);
    }

    public function test_flamengo_anthem_lyrics_contain_authentic_lamartine_babo_content(): void
    {
        $response = $this->getJson('/api/flamengo-anthem');

        $lyrics = $response->json('lyrics');

        // Verify key phrases from the authentic Lamartine Babo anthem
        $this->assertStringContainsString('Uma vez Flamengo', $lyrics);
        $this->assertStringContainsString('Sempre Flamengo', $lyrics);
        $this->assertStringContainsString('Flamengo ate morrer', $lyrics);
    }
}
