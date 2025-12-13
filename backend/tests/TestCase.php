<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

/**
 * @method void assertEquals(mixed $expected, mixed $actual, string $message = '')
 * @method void assertTrue(bool $condition, string $message = '')
 * @method void assertFalse(bool $condition, string $message = '')
 * @method void assertNull(mixed $actual, string $message = '')
 * @method void assertNotNull(mixed $actual, string $message = '')
 * @method void assertContains(mixed $needle, iterable $haystack, string $message = '')
 * @method void assertNotContains(mixed $needle, iterable $haystack, string $message = '')
 * @method void assertCount(int $expectedCount, iterable $haystack, string $message = '')
 * @method void assertEmpty(mixed $actual, string $message = '')
 * @method void assertNotEmpty(mixed $actual, string $message = '')
 * @method void assertInstanceOf(string $expected, mixed $actual, string $message = '')
 * @method void assertDatabaseHas(string $table, array $data, string $connection = null)
 * @method void assertDatabaseMissing(string $table, array $data, string $connection = null)
 */
abstract class TestCase extends BaseTestCase
{
    //
}
