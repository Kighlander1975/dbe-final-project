<?php

namespace App\Http\Controllers;

use App\Models\AdminSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminSettingController extends Controller
{
    /**
     * Get all admin settings
     */
    public function index(Request $request)
    {
        $settings = AdminSetting::with(['creator', 'updater'])
            ->orderBy('key')
            ->get()
            ->map(function ($setting) {
                return [
                    'id' => $setting->id,
                    'key' => $setting->key,
                    'value' => $setting->value,
                    'created_from' => $setting->created_from,
                    'updated_from' => $setting->updated_from,
                    'created_at' => $setting->created_at,
                    'updated_at' => $setting->updated_at,
                    'creator_name' => $setting->creator?->name,
                    'updater_name' => $setting->updater?->name,
                ];
            });

        return response()->json([
            'settings' => $settings
        ]);
    }

    /**
     * Get a specific setting
     */
    public function show(Request $request, string $key)
    {
        $setting = AdminSetting::where('key', $key)->with(['creator', 'updater'])->first();

        if (!$setting) {
            return response()->json(['error' => 'Setting not found'], 404);
        }

        return response()->json([
            'setting' => [
                'id' => $setting->id,
                'key' => $setting->key,
                'value' => $setting->value,
                'created_from' => $setting->created_from,
                'updated_from' => $setting->updated_from,
                'created_at' => $setting->created_at,
                'updated_at' => $setting->updated_at,
                'creator_name' => $setting->creator?->name,
                'updater_name' => $setting->updater?->name,
            ]
        ]);
    }

    /**
     * Create or update a setting
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'key' => 'required|string|max:200|regex:/^[a-zA-Z0-9_\-\.]+$/',
            'value' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $userId = $request->user()->id;
        $setting = AdminSetting::setValue(
            $request->key,
            $request->value,
            $userId
        );

        return response()->json([
            'message' => 'Einstellung gespeichert',
            'setting' => [
                'id' => $setting->id,
                'key' => $setting->key,
                'value' => $setting->value,
                'updated_from' => $setting->updated_from,
                'updated_at' => $setting->updated_at,
                'updater_name' => $request->user()->name,
            ]
        ], 201);
    }

    /**
     * Update a specific setting
     */
    public function update(Request $request, string $key)
    {
        $validator = Validator::make($request->all(), [
            'value' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $setting = AdminSetting::where('key', $key)->first();

        if (!$setting) {
            return response()->json(['error' => 'Setting not found'], 404);
        }

        $setting->update([
            'value' => $request->value,
            'updated_from' => $request->user()->id
        ]);

        return response()->json([
            'message' => 'Einstellung aktualisiert',
            'setting' => [
                'id' => $setting->id,
                'key' => $setting->key,
                'value' => $setting->value,
                'updated_from' => $setting->updated_from,
                'updated_at' => $setting->updated_at,
                'updater_name' => $request->user()->name,
            ]
        ]);
    }

    /**
     * Delete a setting
     */
    public function destroy(Request $request, string $key)
    {
        $setting = AdminSetting::where('key', $key)->first();

        if (!$setting) {
            return response()->json(['error' => 'Setting not found'], 404);
        }

        $setting->delete();

        return response()->json([
            'message' => 'Einstellung gelöscht'
        ]);
    }

    /**
     * Get version setting (public access)
     */
    public function getVersion()
    {
        $version = AdminSetting::getValue('version', '1.0');

        return response()->json([
            'version' => $version
        ]);
    }

    /**
     * Get debug_server_error setting (public access)
     */
    public function getDebugSetting()
    {
        $debugValue = AdminSetting::getValue('debug_server_error', 'false');

        return response()->json([
            'setting' => [
                'key' => 'debug_server_error',
                'value' => $debugValue
            ]
        ]);
    }
}
