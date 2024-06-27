<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterFormValdationRequest extends FormRequest
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
            'email' => [
                Rule::unique('admins') ,
                Rule::unique('customers') ,
                Rule::unique('vendors') ,
                
            ],
           

            'phone' => [
                Rule::unique('customer_phones',"phoneNumper"),
                Rule::unique('admins','phone'),
                Rule::unique('vendors','phone'),
            ],
        ];
    }
}
