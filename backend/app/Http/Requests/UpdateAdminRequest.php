<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class UpdateAdminRequest extends FormRequest
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
                return 
                [
                    'fname' => 'sometimes|string|max:255|min:4|regex:/^[a-zA-Z ,.\'-]+$/',
                    'lname' => 'sometimes|string|max:255|min:4|regex:/^[a-zA-Z ,.\'-]+$/',
                    'email' => [
                        'sometimes',
                        'string',
                        'email',
                        'max:255',
                        'regex:/^[^@\s]+@[^@\s]+\.[^@\s]+$/',
                        Rule::unique('admins')->ignore($this->route('admin')),
                        Rule::unique('customers') ,
                        Rule::unique('vendors'),
                        
                    ],
                  
                    'address' => 'sometimes|string|max:255|min:10',
                    'phone' => [
                        'sometimes',
                        'string',
                        'max:20',
                        'regex:/^01[012]\d{8}$/',
                        Rule::unique('customer_phones',"phoneNumper"),
                        Rule::unique('admins','phone'),
                        Rule::unique('vendors','phone'),
                    ],
                    'image' => 'nullable|image|mimes:jpg,png|max:2048',
                ];
           
    }
}
