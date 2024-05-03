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
        Rule::unique('admins'),
        Rule::unique('customers'),
        Rule::unique('vendors'),
        'regex:/^[^@\s]+@[^@\s]+\.[^@\s]+$/',
    ],
    'password' => 'required|string|min:8|regex:/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/',
    'active' => 'sometimes|in:true,false',
    'banned' => 'sometimes|in:true,false',
    'image' => 'sometimes|image|mimes:jpg,png|max:2048',
    'addresses' => 'sometimes|array',
    'addresses.*.city' => 'required|string|min:4|max:255|regex:/^[a-zA-Z ,.\'-]+$/',
    'addresses.*.street' => 'required|string|min:4|max:255|regex:/^[a-zA-Z ,.\'-]+$/',
    'addresses.*.Governate' => 'required|string|min:4|max:255|regex:/^[a-zA-Z ,.\'-]+$/',
    'addresses.*.house_number' => 'sometimes|numeric|min:1|regex:/^[1-9]\d*$/',
    'addresses.*.customer_id' => 'sometimes|integer|exists:customers,id',
    'phones' => 'sometimes|array',
    'phones.*.phoneNumper'=> [
        'required',
        'string',
        'max:20',
        'regex:/^01[012]\d{8}$/',
        Rule::unique('customer_phones'),
        Rule::unique('admins','phone'),
        Rule::unique('vendors','phone'),
    ],
    'phones.*.customer_id' => 'sometimes|integer|exists:customers,id',
];

    }
}
