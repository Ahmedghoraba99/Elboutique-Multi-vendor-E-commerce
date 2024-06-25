<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerAddressRequest extends FormRequest
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
                'city' => 'sometimes|string|min:4|max:255|regex:/^[a-zA-Z ,.\'-]+$/',
                'street' => 'sometimes|string|min:4|max:255|regex:/^[a-zA-Z ,.\'-]+$/',
                'governorate' => 'sometimes|string|min:4|max:255|regex:/^[a-zA-Z ,.\'-]+$/',
                'house_number' => 'sometimes|numeric|min:1|regex:/^[1-9]\d*$/',
                'customer_id' => 'sometimes|integer|exists:customers,id',
            ];
        }
     
}
