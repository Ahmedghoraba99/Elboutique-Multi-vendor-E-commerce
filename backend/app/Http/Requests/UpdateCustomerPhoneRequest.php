<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class UpdateCustomerPhoneRequest extends FormRequest
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
                'phoneNumper' =>  [
                    'sometimes',
                    'string',
                    'max:20',
                    'regex:/^01[012]\d{8}$/',
                    Rule::unique('customer_phones'),
                    Rule::unique('admins','phone'),
                    Rule::unique('vendors','phone'),
                ],
                'customer_id' => 'sometimes|integer|exists:customers,id',
            ];
 
      
    }
}
