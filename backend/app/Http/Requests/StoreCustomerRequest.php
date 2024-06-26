<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class StoreCustomerRequest extends FormRequest
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
    'name' => 'required|string|min:4|max:255|regex:/^[a-zA-Z ,.\'-]+$/',
    'email' => [
        'required',
        'string',
        'email',
        'max:255',
        'regex:/^[^@\s]+@[^@\s]+\.[^@\s]+$/',
        Rule::unique('admins'),
        Rule::unique('customers'),
        Rule::unique('vendors'),
        
    ],
    'password' => 'required|string|min:8|regex:/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/',
    'image' => 'sometimes|image|mimes:jpg,png|max:2048',
    'addresses' => 'required|sometimes|array',
    'addresses.*.city' => 'required|string|min:3|max:255|regex:/^(?=.*[A-Za-z])[A-Za-z0-9 _]+$/',
    'addresses.*.street' => 'required|string|min:2|max:255|regex:/^(?=.*[A-Za-z])[A-Za-z0-9 _]+$/',
    'addresses.*.governorate' => 'required|string|min:4|max:255|regex:/^(?=.*[A-Za-z])[A-Za-z0-9 _]+$/',
    'addresses.*.house_number' => 'sometimes|numeric|min:1|regex:/^[1-9]\d*$/',
    'phones' => 'required|sometimes|array',
    'phones.*.phoneNumper'=> [
        'required',
        'string',
        'max:20',
        'regex:/^01[012]\d{8}$/',
        Rule::unique('customer_phones'),
        Rule::unique('admins','phone'),
        Rule::unique('vendors','phone'),
    ],
     
];

    }
}
