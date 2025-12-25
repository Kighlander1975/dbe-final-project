<?php

namespace App\Services;

class RankingService
{
    /**
     * Berechne Punkte basierend auf Spieleranzahl und Platzierung
     *
     * @param int $playerCount Anzahl Spieler im Spiel
     * @param int $finalRank Endplatzierung (1-basiert)
     * @return int Erhaltene Punkte
     */
    public static function calculatePoints(int $playerCount, int $finalRank): int
    {
        $basePoints = $playerCount * 2.5;
        $maxPoints = round($basePoints);

        // Prozentuale Verteilung basierend auf Rang
        $percentages = [
            1 => 100,   // 1. Platz: 100% der Max-Punkte
            2 => 70,    // 2. Platz: 70%
            3 => 45,    // 3. Platz: 45%
            4 => 25,    // 4. Platz: 25%
        ];

        // Für Plätze > 3: Abnehmende Berechnung
        if ($finalRank > 3) {
            $basePercentage = 25; // Start bei Platz 4
            $decrement = 5; // 5% weniger pro Platz
            $percentages[$finalRank] = max(5, $basePercentage - (($finalRank - 4) * $decrement));
        }

        return round($maxPoints * ($percentages[$finalRank] / 100));
    }

    /**
     * Berechne Rating-Veränderung nach Elo-Formel
     *
     * @param float $playerRating Aktuelles Rating des Spielers
     * @param array $opponentRatings Ratings der Gegner
     * @param int $placement Endplatzierung (1-basiert)
     * @param int $playerCount Gesamtanzahl Spieler
     * @param string $gameType Spieltyp ('casual', 'liga', 'extrem')
     * @return float Rating-Veränderung
     */
    public static function calculateRatingChange(
        float $playerRating,
        array $opponentRatings,
        int $placement,
        int $playerCount,
        string $gameType = 'liga'
    ): float {
        // Wenn keine Gegner-Ratings vorhanden, keine Rating-Änderung
        if (empty($opponentRatings)) {
            return 0.0;
        }

        // Erwartete Punktzahl gegen jeden Gegner berechnen
        $expectedScores = [];
        foreach ($opponentRatings as $opponentRating) {
            $expectedScores[] = 1 / (1 + pow(10, ($opponentRating - $playerRating) / 400));
        }

        // Durchschnittliche erwartete Punktzahl
        $avgExpectedScore = array_sum($expectedScores) / count($expectedScores);

        // Tatsächliche Punktzahl basierend auf Platzierung
        $actualScore = ($playerCount - $placement) / ($playerCount - 1);

        // K-Faktor basierend auf Spielgröße und Spieltyp
        $baseK = 32;
        $sizeMultiplier = 1 + ($playerCount - 6) * 0.1;
        $typeMultiplier = match($gameType) {
            'casual' => 0.8,
            'liga' => 1.0,
            'extrem' => 0.9,
            default => 1.0
        };
        $K = $baseK * $sizeMultiplier * $typeMultiplier;

        // Rating-Veränderung
        $ratingChange = $K * ($actualScore - $avgExpectedScore);

        return round($ratingChange * 100) / 100; // Auf 2 Dezimalstellen runden
    }

    /**
     * Bestimme Spieltyp basierend auf Spieleranzahl
     *
     * @param int $playerCount Anzahl Spieler
     * @return string Spieltyp ('casual', 'liga', 'extrem')
     */
    public static function getGameType(int $playerCount): string
    {
        return match(true) {
            $playerCount >= 2 && $playerCount <= 5 => 'casual',
            $playerCount >= 6 && $playerCount <= 10 => 'liga',
            default => 'extrem'
        };
    }
}