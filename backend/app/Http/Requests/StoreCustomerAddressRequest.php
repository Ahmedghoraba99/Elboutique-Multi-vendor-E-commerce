<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerAddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'governorate' => 'required|string|max:255|min:4|regex:/^[a-zA-Z ,.\'-]+$/',
            'city' => 'required|string|max:255|min:4|regex:/^[a-zA-Z ,.\'-]+$/',
            'street' => 'required|string|max:255|min:4|regex:/^[a-zA-Z ,.\'-]+$/',
            'house_number' => 'sometimes|numeric|min:1|regex:/^[1-9]\d*$/',
            'customer_id' => 'required|integer|exists:customers,id',
        ];
    }
}
