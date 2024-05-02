<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreReviewRequest extends FormRequest
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
            'rate' => 'required|integer|min:1|max:5',
            'customer_id' => 'required|exists:customers,id',
            'product_id' => 'required|exists:products,id',
        ];
    }


        /**
     * Get the validation error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'rate.required' => 'The rate field is required.',
            'rate.integer' => 'The rate field must be an integer.',
            'rate.min' => 'The rate field must be at least :min.',
            'rate.max' => 'The rate field may not be greater than :max.',
            'customer_id.required' => 'The customer ID field is required.',
            'customer_id.exists' => 'The selected customer ID is invalid.',
            'product_id.required' => 'The product ID field is required.',
            'product_id.exists' => 'The selected product ID is invalid.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }
}
