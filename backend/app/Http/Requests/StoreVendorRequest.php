<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVendorRequest extends FormRequest
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
            'name' => 'required|string|max:255|min:4|regex:/^[a-zA-Z ,.\'-]+$/',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'regex:/^[^@\s]+@[^@\s]+\.[^@\s]+$/',
                Rule::unique('admins'),
                Rule::unique('customers'),
                Rule::unique('vendors') ,
                
            ],
            'password' => 'required|string|min:8|regex:/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/',
            'address' => 'required|string|max:255|min:10',
            'phone' => [
                'required',
                'string',
                'max:20',
                'regex:/^01[012]\d{8}$/',
                Rule::unique('customer_phones',"phoneNumper"),
                Rule::unique('admins','phone'),
                Rule::unique('vendors','phone'),
            ],
            // 'national_id' => 'required|image|mimes:jpg,png|max:2048',
            'image' => 'sometimes|image|mimes:jpg,png|max:2048',

        ];
    }
}
