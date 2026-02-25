<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'room_id' => ['required', 'exists:rooms,id'],
            'guest_name' => ['required', 'string', 'max:255'],
            'guest_email' => ['required', 'email', 'max:255'],
            'guest_phone' => ['required', 'string', 'regex:/^[0-9\-\+\s\(\)]{7,20}$/'],
            'guest_address' => ['nullable', 'string', 'max:500'],
            'check_in_date' => ['required', 'date', 'after_or_equal:today'],
            'check_out_date' => ['required', 'date', 'after:check_in_date'],
            'booking_source' => ['required', 'in:direct,ota,walk_in'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'special_requests' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $roomId = $this->input('room_id');
            $checkIn = $this->input('check_in_date');
            $checkOut = $this->input('check_out_date');

            if ($roomId && $checkIn && $checkOut) {
                $room = \App\Models\Room::find($roomId);
                if ($room && !$room->isAvailableFor($checkIn, $checkOut)) {
                    $validator->errors()->add('room_id', 'This room is not available for the selected dates.');
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'check_in_date.after_or_equal' => 'Check-in date must be today or later.',
            'check_out_date.after' => 'Check-out date must be after check-in date.',
            'guest_phone.regex' => 'Phone number format is invalid.',
        ];
    }
}
