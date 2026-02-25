<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'room_type_id' => ['required', 'exists:room_types,id'],
            'room_number' => ['required', 'string', 'max:10', 'unique:rooms,room_number'],
            'floor' => ['required', 'integer', 'min:1', 'max:50'],
            'status' => ['required', 'in:available,maintenance'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
